import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  createJWS,
  createJWE,
  verifyCallbackToken,
  getPayGlocalEndpoints,
  PayCollectPayload,
  PayCollectResponse,
  PayGlocalStatusResponse,
} from "./lib/payglocal";

async function runServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", store: "Garena Official Free Fire Store" });
  });

  // ============================================
  // PAYGLOCAL PAYMENT GATEWAY API ENDPOINTS
  // ============================================

  /**
   * 1. Initiate PayGlocal PayCollect Payment
   */
  app.post("/api/payglocal/initiate", async (req, res) => {
    try {
      const { amount, email, customerId, orderId, productName } = req.body;

      if (!amount || !email) {
        return res.status(400).json({
          success: false,
          error: "Amount and email are required parameters.",
        });
      }

      const merchantId = process.env.PAYGLOCAL_MERCHANT_ID;
      const kid = process.env.PAYGLOCAL_PVT_KEY_KID;
      const callbackUrl = "https://www.garenaofficialfreefire.shop/api/payglocal/callback";

      if (!merchantId || !kid || merchantId.includes("your_mid") || kid.includes("your_private_key")) {
        return res.status(500).json({
          success: false,
          error:
            "Missing or placeholder PAYGLOCAL_MERCHANT_ID or PAYGLOCAL_PVT_KEY_KID. Please set your real keys in Vercel Environment Variables.",
        });
      }

      const cleanOrderId = orderId
        ? String(orderId).replace(/^gl-/i, "")
        : `ORD-${Date.now()}`;
      const merchantUniqueId = crypto.randomUUID();

      const payload: PayCollectPayload = {
        merchantTxnId: cleanOrderId,
        merchantUniqueId: merchantUniqueId,
        paymentData: {
          totalAmount: Number(amount).toFixed(2),
          txnCurrency: "INR",
        },
        merchantCallbackURL: callbackUrl,
        riskData: {
          customerData: {
            merchantAssignedCustomerId: customerId || `cust_${Date.now()}`,
          },
          shippingData: {
            addressCountry: "IN",
            emailId: email,
          },
        },
      };

      // Create JWS & JWE
      const jwsToken = await createJWS(merchantId, kid);
      const jweBody = await createJWE(
        payload as unknown as Record<string, unknown>
      );

      const endpoints = getPayGlocalEndpoints();

      const payglocalResponse = await fetch(endpoints.paycollect, {
        method: "POST",
        headers: {
          "Content-Type": "application/jose",
          "X-GL-TOKEN-EXTERNAL": jwsToken,
        },
        body: jweBody,
      });

      const responseText = await payglocalResponse.text();
      let responseData: PayCollectResponse;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        console.error("Non-JSON response from PayGlocal:", responseText);
        return res.status(502).json({
          success: false,
          error: "Invalid response from PayGlocal gateway",
          details: responseText,
        });
      }

      if (!payglocalResponse.ok || responseData.status === "FAILED") {
        return res.status(400).json({
          success: false,
          error:
            responseData.error?.message ||
            "Payment initiation failed with PayGlocal",
          details: responseData,
        });
      }

      const redirectUrl = responseData.data?.redirectUrl;
      const gid = responseData.data?.gid;

      return res.json({
        success: true,
        redirectUrl,
        gid,
        merchantTxnId: cleanOrderId,
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error initiating PayGlocal payment:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server error while processing payment",
      });
    }
  });

  /**
   * 2. Handle PayGlocal Callback (POST form-data x-gl-token)
   */
  app.post("/api/payglocal/callback", async (req, res) => {
    const siteUrl = "https://www.garenaofficialfreefire.shop";

    try {
      const token = req.body?.["x-gl-token"];
      const directGid = req.body?.gid;

      let status = "UNKNOWN";
      let gid = directGid || "";
      let isValidToken = false;

      if (token) {
        const decodedPayload = await verifyCallbackToken(token);
        if (decodedPayload) {
          isValidToken = true;
          status = decodedPayload.status || "UNKNOWN";
          gid = decodedPayload.gid || gid;
        }
      }

      // Fallback check
      if (!isValidToken && gid) {
        try {
          const merchantId = process.env.PAYGLOCAL_MERCHANT_ID || "";
          const kid = process.env.PAYGLOCAL_PVT_KEY_KID || "";
          const jwsToken = await createJWS(merchantId, kid);
          const endpoints = getPayGlocalEndpoints();

          const statusRes = await fetch(endpoints.status(gid), {
            method: "GET",
            headers: {
              "X-GL-TOKEN-EXTERNAL": jwsToken,
            },
          });

          if (statusRes.ok) {
            const statusData: PayGlocalStatusResponse = await statusRes.json();
            status = statusData.status || statusData.data?.status || "UNKNOWN";
          }
        } catch (fallbackErr) {
          console.error("Fallback status API check failed:", fallbackErr);
        }
      }

      const successfulStatuses = ["SUCCESS", "SENT_FOR_CAPTURE", "CAPTURED"];

      if (successfulStatuses.includes(status.toUpperCase())) {
        return res.redirect(
          303,
          `${siteUrl}/checkout/success?gid=${encodeURIComponent(gid)}`
        );
      } else {
        return res.redirect(
          303,
          `${siteUrl}/checkout/failed?gid=${encodeURIComponent(
            gid
          )}&status=${encodeURIComponent(status)}`
        );
      }
    } catch (error) {
      console.error("Error handling PayGlocal callback:", error);
      return res.redirect(303, `${siteUrl}/checkout/failed?status=SERVER_ERROR`);
    }
  });

  /**
   * 3. PayGlocal Status Endpoint
   */
  app.get("/api/payglocal/status", async (req, res) => {
    try {
      const gid = req.query.gid as string;

      if (!gid) {
        return res
          .status(400)
          .json({ success: false, error: "GID parameter is required" });
      }

      const merchantId = process.env.PAYGLOCAL_MERCHANT_ID;
      const kid = process.env.PAYGLOCAL_PVT_KEY_KID;

      if (!merchantId || !kid) {
        return res.status(500).json({
          success: false,
          error: "Missing Merchant ID or Private Key KID",
        });
      }

      const jwsToken = await createJWS(merchantId, kid);
      const endpoints = getPayGlocalEndpoints();

      const response = await fetch(endpoints.status(gid), {
        method: "GET",
        headers: {
          "X-GL-TOKEN-EXTERNAL": jwsToken,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: "Failed to fetch transaction status",
          details: data,
        });
      }

      return res.json({ success: true, gid, data });
    } catch (error: unknown) {
      const err = error as Error;
      return res
        .status(500)
        .json({ success: false, error: err.message || "Internal error" });
    }
  });

  // Serve static assets and frontend index
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "Starting server in DEVELOPMENT mode with Vite integration..."
    );
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running successfully on http://localhost:${PORT}`);
  });
}

runServer();
