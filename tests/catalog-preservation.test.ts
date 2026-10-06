import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { SOURCE_PRODUCTS as PRODUCTS } from "../src/data/products";
import {
  REFERENCE_PRODUCTS,
  isImportedOptionAvailable,
} from "../src/data/reference-products";
import catalog from "../src/data/reference-catalog.json";
import reviewSummary from "../src/data/reference-review-summary.json";
import baseline from "../docs/website-a-baseline.json";
import provenance from "../docs/catalog-provenance.json";
import media from "../docs/hosted-media.json";
import { restoreOriginImages, restoreOriginSource } from "./helpers/origin-images";
import { hostedImageForLegacyUrl } from "../src/lib/hosted-images";

const digest = (data: string | Buffer) =>
  createHash("sha256").update(data).digest("hex");
test("all Website A product records remain exactly identical", () => {
  const original = PRODUCTS.filter((p) => !p.sourceId);
  assert.equal(original.length, provenance.websiteA.count);
  assert.equal(
    digest(JSON.stringify(restoreOriginImages(original))),
    provenance.websiteA.productsSha256,
  );
});
test("protected A files, dependencies, routes, branding and legal information are byte identical", () => {
  const presentationChanges = new Set([
    // Explicitly authorized in brand-removal/account/email follow-up; narrow invariants tested separately.
    "api/payglocal/initiate.js",
    "server.ts",
    ".env.example",
    "package.json",
    "package-lock.json",
    "vercel.json",
    "src/context/ProductContext.tsx",
    "src/context/CartContext.tsx",
    "src/pages/Login.tsx",
    "src/pages/Register.tsx",
    "src/pages/Checkout.tsx",
    "src/pages/PaymentSuccess.tsx",
    "src/pages/PaymentFailure.tsx",
    "src/pages/MyOrders.tsx",
    "src/pages/GarenaCheckout.tsx",
    "src/pages/Terms.tsx",
    "src/pages/RefundPolicy.tsx",
    "src/pages/ShippingPolicy.tsx",
    "src/components/ImagePreloader.tsx",
    "src/components/Navbar.tsx",
    "src/components/ProductCard.tsx",
    "src/data/products.ts",
    "src/main.tsx",
    "src/pages/Collection.tsx",
    "src/pages/Home.tsx",
    "src/pages/ProductDetail.tsx",
    "src/pages/Search.tsx",
    // Public route isolation and matching crawler metadata, explicitly requested.
    "src/App.tsx",
    "index.html",
    "src/components/Footer.tsx",
  ]);
  for (const [file, hash] of Object.entries(baseline)) {
    if (!presentationChanges.has(file))
      assert.equal(digest(restoreOriginSource(readFileSync(file, "utf8"))), hash, file);
  }
  const header = readFileSync("src/components/Navbar.tsx", "utf8");
  assert.match(header, /<span className="logo-main">FREE FIRE STORE<\/span>/);
});
test("all 251 imported records map losslessly to unique numeric IDs and original schema", () => {
  assert.equal(REFERENCE_PRODUCTS.length, provenance.websiteB.count);
  assert.equal(new Set(PRODUCTS.map((p) => p.id)).size, PRODUCTS.length);
  for (const source of catalog) {
    const mapped = REFERENCE_PRODUCTS.find((p) => p.sourceId === source.id)!;
    assert.ok(mapped);
    const { id, sourceId, variants, ...metadata } = mapped;
    const {
      id: originalId,
      variants: originalVariants,
      ...originalMetadata
    } = source;
    assert.equal(id, -originalId);
    assert.deepEqual(metadata, {
      ...originalMetadata,
      ...reviewSummary[String(originalId) as keyof typeof reviewSummary],
    });
    assert.deepEqual(
      variants,
      originalVariants.map(({ available, ...v }) => ({
        ...v,
        ...(available ? {} : { stock: 0 }),
      })),
    );
    assert.ok(mapped.price > 0 && mapped.sizes.length > 0);
    assert.ok(
      mapped.variants?.some((v) => v.stock !== 0),
      mapped.name,
    );
    for (const variant of mapped.variants || []) {
      assert.equal(variant.price, mapped.price, "A cart uses product price");
      assert.equal(
        isImportedOptionAvailable(mapped, variant.size!, variant.color!),
        variant.stock !== 0,
      );
    }
  }
});
test("all imported product and review images use the verified Cloudinary inventory", () => {
  const knownUrls = new Set(Object.values(media.assets).map((asset) => asset.url));
  const usedUrls = new Set<string>();
  assert.equal(knownUrls.size, 3667);
  for (const [path, asset] of Object.entries(media.assets)) {
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    assert.ok(asset.bytes > 0);
    assert.match(asset.url, /^https:\/\/res\.cloudinary\.com\/smi5oqr3\/image\/upload\/v\d+\/freefire_store_migration\//);
    assert.equal(
      hostedImageForLegacyUrl(path, "https://store.example"),
      asset.url.replace(/\/v\d+\//, "/"),
      "Persisted legacy image URLs must resolve to the uploaded asset",
    );
  }
  const check = (url: string) => {
    assert.ok(knownUrls.has(url), url);
    usedUrls.add(url);
  };
  let reviewCount = 0;
  for (const product of REFERENCE_PRODUCTS) {
    [
      ...(product.images || []),
      ...Object.values(product.variantImages || {}).flat(),
      ...(product.variants?.flatMap((v) => (v.image ? [v.image] : [])) || []),
    ].forEach(check);
    const data = JSON.parse(
      readFileSync(`public/reviews/${product.sourceId}.json`, "utf8"),
    );
    assert.equal(data.productId, product.sourceId);
    assert.equal(data.reviews.length, product.reviews);
    for (const review of data.reviews) {
      assert.equal(review.productId, product.sourceId);
      assert.equal(review.verifiedStorePurchase, false);
      review.images.forEach(check);
      reviewCount++;
    }
  }
  assert.equal(reviewCount, 1198);
  assert.equal(usedUrls.size, knownUrls.size);
});
test("hosting migration changes only image URLs in catalog and review records", () => {
  const originalPaths = new Map(Object.entries(media.assets).map(([path, asset]) => [asset.url, path]));
  const restore = (value: unknown): unknown => {
    if (typeof value === "string") return originalPaths.get(value) ?? value;
    if (Array.isArray(value)) return value.map(restore);
    if (value && typeof value === "object")
      return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, restore(child)]));
    return value;
  };
  for (const [file, hash] of Object.entries(media.sourceJsonSha256)) {
    const current = JSON.parse(readFileSync(file, "utf8"));
    assert.equal(digest(JSON.stringify(restore(current))), hash, file);
  }
});
test("legacy variant behavior and positive custom-product IDs are preserved", () => {
  const original = PRODUCTS.filter((p) => !p.sourceId);
  assert.ok(
    original.every((p) =>
      isImportedOptionAvailable(p, p.sizes[0], p.colors?.[0] || ""),
    ),
  );
  assert.equal(
    Math.max(...PRODUCTS.map((p) => p.id)),
    Math.max(...original.map((p) => p.id)),
  );
  assert.ok(REFERENCE_PRODUCTS.every((p) => p.id < 0));
});
