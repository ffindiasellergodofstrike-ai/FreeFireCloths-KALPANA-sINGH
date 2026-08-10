import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ShippingPolicy() {
  useEffect(() => {
    document.title = 'Shipping Policy – FREE FIRE STORE';
  }, []);
  return (
    <div id="shipping-policy-page-root">
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="curr">Shipping Policy</span>
          </div>
        </div>
      </div>

      <div className="policy-wrap">
        <div className="policy-header">
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', textTransform: 'uppercase', letterSpacing: '1px' }}>SHIPPING POLICY</h1>
          <div className="policy-meta">
            <span><strong>Trade Name:</strong> FREE FIRE STORE</span>
            <span><strong>Owner:</strong> Kalpana Singh</span>
            <span><strong>Updated:</strong> July 28, 2026</span>
          </div>
        </div>

        <div className="policy-body">
          <div className="policy-info-box">
            <p><strong>Business Name:</strong> FREE FIRE STORE</p>
            <p><strong>Owner / Proprietor:</strong> Kalpana Singh</p>
            <p><strong>Registered Address:</strong> PRANNATHPUR BACHHARIYA, KADIPUR, AKHANDNAGAR, SULTANPUR, UTTAR PRADESH, INDIA, 228171</p>
            <p><strong>Website:</strong> www.garenaofficialfreefire.shop</p>
            <p><strong>Support Email:</strong> contactkalpnaji@gmail.com &nbsp;|&nbsp; <strong>Phone:</strong> +91 9319969384</p>
          </div>

          <h2>OVERVIEW</h2>
          <p>Thank you for shopping with FREE FIRE STORE! We are committed to delivering your fashion and lifestyle products accurately, in perfect condition, and as swiftly as possible anywhere in India. Please read this Shipping Policy carefully to understand how and when your orders will arrive.</p>

          <h2>SECTION 1 — ORDER PROCESSING TIME</h2>
          <p>All orders are processed within 1 to 3 business days after you receive your Order Confirmation email.</p>
          <ul>
            <li>Business days are Monday to Saturday, excluding all Indian public holidays.</li>
            <li>Orders placed on Sundays or public holidays will be processed on the next available business day.</li>
            <li>You will receive a Shipping Confirmation email and SMS once your order has been dispatched from our facility.</li>
          </ul>
          <p><strong>NOTE:</strong> Processing time is SEPARATE from shipping/delivery time. Your total wait time = Processing Time + Delivery Time.</p>
          <p>During high-demand periods (festive sales, new launches), processing may take up to 5 business days. We appreciate your patience.</p>

          <h2>SECTION 2 — SHIPPING CHARGES</h2>
          <div style={{ margin: '20px 0' }}>
            <table >
              <thead>
                <tr >
                  <th >ORDER TYPE</th>
                  <th >SHIPPING FEE</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td >Prepaid Orders above Rs.999</td>
                  <td >FREE — No shipping charge</td>
                </tr>
                <tr >
                  <td >Prepaid Orders below Rs.999</td>
                  <td >Rs. 80 flat shipping fee</td>
                </tr>
                <tr >
                  <td >Cash on Delivery (COD) Orders</td>
                  <td >Rs. 50 non-refundable COD handling fee added at checkout</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Shipping charges are shown clearly at checkout before you complete your payment.</p>
          <p>Shipping fees are <strong>NON-REFUNDABLE</strong>, except in cases where Garena Store dispatched a wrong or defective item.</p>

          <h2>SECTION 3 — DELIVERY TIMEFRAMES</h2>
          <p>Estimated delivery times AFTER dispatch:</p>
          <div style={{ margin: '20px 0' }}>
            <table >
              <thead>
                <tr >
                  <th >LOCATION</th>
                  <th >ESTIMATED DELIVERY</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td >Metro Cities (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad)</td>
                  <td >3 to 5 Business Days</td>
                </tr>
                <tr >
                  <td >Tier-2 and Tier-3 Cities</td>
                  <td >5 to 7 Business Days</td>
                </tr>
                <tr >
                  <td >Remote / Rural Areas and North-East India</td>
                  <td >7 to 12 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><strong>IMPORTANT:</strong> These are estimated timelines and are NOT guaranteed. Actual delivery may vary based on your pin code, courier workload, weather, or other external factors.</p>
          <p>If your order has not arrived within 15 days of your Shipping Confirmation email, contact us immediately at:</p>
          <p><strong>Email:</strong> contactkalpnaji@gmail.com &nbsp;|&nbsp; <strong>Phone:</strong> +91 9319969384</p>

          <h2>SECTION 4 — CASH ON DELIVERY (COD)</h2>
          <p>COD is available for most pin codes across India.</p>
          <ul>
            <li>A non-refundable COD handling fee of Rs. 50 is added at checkout for all COD orders.</li>
            <li>COD availability depends on your pin code and our courier partner's serviceability. You will be notified at checkout if COD is unavailable for your location.</li>
            <li>Please keep the <strong>EXACT</strong> amount ready at the time of delivery. Courier executives may not carry change.</li>
            <li>COD refunds are issued as store credit only. See our Refund Policy for full details.</li>
          </ul>

          <h2>SECTION 5 — PAYMENT METHODS ACCEPTED</h2>
          <p>All online payments are processed securely through our authorised payment gateway partners:</p>
          <div style={{ margin: '20px 0' }}>
            <table >
              <thead>
                <tr >
                  <th >PAYMENT METHOD</th>
                  <th >GATEWAY</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td >Credit Cards (Visa, MasterCard, RuPay, American Express)</td>
                  <td >PayU / Razorpay / CCAvenue</td>
                </tr>
                <tr >
                  <td >Debit Cards (Visa, MasterCard, RuPay)</td>
                  <td >PayU / Razorpay / CCAvenue</td>
                </tr>
                <tr >
                  <td >Net Banking (All major Indian banks)</td>
                  <td >PayU / Razorpay / Cashfree</td>
                </tr>
                <tr >
                  <td >UPI (GPay, PhonePe, Paytm, BHIM, Amazon Pay)</td>
                  <td >PayU / Razorpay / Cashfree</td>
                </tr>
                <tr >
                  <td >Digital Wallets (Paytm, Mobikwik, etc.)</td>
                  <td >PayU / Razorpay</td>
                </tr>
                <tr >
                  <td >EMI</td>
                  <td >Subject to bank eligibility</td>
                </tr>
                <tr >
                  <td >Cash on Delivery (COD)</td>
                  <td >Available for eligible pin codes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>All transactions are SSL encrypted. Garena Store does NOT store your card, UPI, or banking credentials.</p>

          <h2>SECTION 6 — SERVICE AREAS AND COURIER PARTNERS</h2>
          <p>We ship to ALL states and union territories within India.</p>
          <p>International shipping is <strong>NOT</strong> available at this time.</p>
          <p>If your pin code is not serviceable, you will be notified at checkout.</p>
          <p>Our trusted courier partners include:</p>
          <ul>
            <li>Delhivery</li>
            <li>Shiprocket</li>
            <li>BlueDart</li>
            <li>DTDC</li>
            <li>Xpressbees</li>
            <li>Ecom Express</li>
            <li>India Post (Speed Post)</li>
          </ul>
          <p>Courier partner assignment is automatic based on your location and availability. You cannot choose your courier partner.</p>

          <h2>SECTION 7 — ORDER TRACKING</h2>
          <p>After dispatch, you will receive your tracking number and courier partner name via email and SMS.</p>
          <ul>
            <li>Tracking updates may take up to 24 to 48 hours to appear on the courier partner's website after dispatch.</li>
            <li>Use your tracking number on the courier partner's website to check your delivery status in real time.</li>
            <li>If tracking shows no update for more than 5 business days, contact us at contactkalpnaji@gmail.com with your Order ID and we will investigate with the courier partner.</li>
          </ul>

          <h2>SECTION 8 — DELIVERY ATTEMPTS</h2>
          <p>Our courier partners will attempt delivery up to 2 times at your registered delivery address.</p>
          <ul>
            <li>If delivery fails on both attempts (no one available, wrong address, refused delivery), the package will be returned to us.</li>
            <li>Re-delivery of returned packages may attract additional shipping charges.</li>
            <li>For COD orders where delivery is refused, no refund will be issued as no payment was made by the customer.</li>
          </ul>

          <h2>SECTION 9 — INCORRECT SHIPPING ADDRESS</h2>
          <p>Garena Store is <strong>NOT</strong> responsible for non-delivery or delays caused by an incorrect, incomplete, or invalid delivery address provided by you at checkout.</p>
          <p>Before placing your order, please verify:</p>
          <ul>
            <li>Full name</li>
            <li>Flat/house number and street name</li>
            <li>Locality and city</li>
            <li>District and state</li>
            <li>Pin code (6-digit)</li>
            <li>Mobile number</li>
          </ul>
          <p>If you notice an address error AFTER placing your order, contact us <strong>IMMEDIATELY</strong>:</p>
          <p><strong>Email:</strong> contactkalpnaji@gmail.com &nbsp;|&nbsp; <strong>Phone:</strong> +91 9319969384</p>
          <p>We will try to update the address before dispatch. Once dispatched, address changes are NOT possible.</p>

          <h2>SECTION 10 — DAMAGED OR TAMPERED PACKAGES</h2>
          <p>If your package arrives visibly damaged, tampered, or open at the time of delivery:</p>
          <ul>
            <li>Do <strong>NOT</strong> accept the delivery.</li>
            <li>Ask the courier executive to mark it as "REFUSED — PACKAGE DAMAGED" and return it.</li>
          </ul>
          <p>If you have already accepted a damaged package:</p>
          <ul>
            <li>Take clear photographs of the item <strong>AND</strong> the packaging immediately, before opening fully.</li>
            <li>Contact us within 24 hours of delivery:</li>
          </ul>
          <p><strong>Email:</strong> contactkalpnaji@gmail.com &nbsp;|&nbsp; <strong>Phone:</strong> +91 9319969384</p>
          <p>We will arrange a free replacement or full refund as per our Refund and Return Policy.</p>
          <p>Damage claims raised after 24 hours of delivery will not be accepted.</p>

          <h2>SECTION 11 — LOST PACKAGES IN TRANSIT</h2>
          <p>In the rare event that your package is lost in transit:</p>
          <ul>
            <li>Check your tracking — confirm status with courier.</li>
            <li>Contact us within 48 hours of the expected delivery date if the package has not arrived.</li>
            <li>We will raise a formal investigation with the courier partner within 1 to 2 business days.</li>
            <li>Resolution will be provided within 7 business days.</li>
          </ul>
          <p>Garena Store is not legally liable for packages lost by the courier partner after dispatch. However, we will actively coordinate with the courier partner on your behalf and work to resolve the issue at the earliest.</p>

          <h2>SECTION 12 — DELAYS AND DISRUPTIONS</h2>
          <p>Garena Store will not be held liable for delivery delays caused by:</p>
          <ul>
            <li>Courier partner delays or logistics issues</li>
            <li>Natural disasters, floods, or extreme weather</li>
            <li>Cyclones, earthquakes, or other force majeure events</li>
            <li>Strikes, civil unrest, or curfews</li>
            <li>Government-imposed restrictions or national lockdowns</li>
            <li>National and state public holidays</li>
          </ul>
          <p>We will proactively notify you of known delays and help track and resolve your shipment at the earliest.</p>

          <h2>SECTION 13 — MULTIPLE ITEMS IN ONE ORDER</h2>
          <p>If you order multiple items, they may be shipped in separate packages with different tracking numbers, depending on stock availability and courier routing. You will receive individual tracking details for each package via email and SMS.</p>

          <h2>SECTION 14 — CONTACT US</h2>
          <p>For any shipping or delivery related queries, please contact us:</p>
          <div className="policy-info-box" style={{ marginTop: '12px' }}>
            <p><strong>Business Name:</strong> FREE FIRE STORE</p>
            <p><strong>Proprietor:</strong> Kalpana Singh</p>
            <p><strong>Email:</strong> contactkalpnaji@gmail.com</p>
            <p><strong>Phone / WhatsApp:</strong> +91 9319969384</p>
            <p><strong>Registered Address:</strong> PRANNATHPUR BACHHARIYA, KADIPUR, AKHANDNAGAR, SULTANPUR, UTTAR PRADESH, INDIA, 228171</p>
            <p><strong>Website:</strong> www.garenaofficialfreefire.shop</p>
            <p><strong>Support Hours:</strong> Monday to Saturday, 10:00 AM to 6:00 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
