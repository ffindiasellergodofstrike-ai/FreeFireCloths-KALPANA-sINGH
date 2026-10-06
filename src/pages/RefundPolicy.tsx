import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  useEffect(() => {
    document.title = 'Refund & Cancellation Policy – Free Fire Store';
  }, []);
  return (
    <div id="refund-policy-page-root">
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="curr">Refund Policy</span>
          </div>
        </div>
      </div>

      <div className="policy-wrap">
        <div className="policy-header">
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', textTransform: 'uppercase', letterSpacing: '1px' }}>RETURN AND REFUND POLICY</h1>
          <div className="policy-meta">
            <span><strong>Trade Name:</strong> Free Fire Store</span>
            <span><strong>Owner:</strong> Kalpana Singh</span>
            <span><strong>Updated:</strong> July 28, 2026</span>
          </div>
        </div>

        <div className="policy-body">
          <div className="policy-info-box">
            <p><strong>Business Name:</strong> Free Fire Store</p>
            <p><strong>Owner / Proprietor:</strong> Kalpana Singh</p>
            <p><strong>Business Name:</strong> Free Fire Store</p>
            <p><strong>Udyam Reg. No:</strong> UDYAM-UP-03-0123799</p>
            <p><strong>Business Type:</strong> We sell clothes and premium clothing in India.</p>
            <p><strong>Registered Address:</strong> PRANNATHPUR BACHHARIYA, SULTANPUR, UTTAR PRADESH, INDIA, 228171</p>
            <p><strong>Website:</strong> www.garenaofficialfreefire.shop</p>
            <p><strong>Support Email:</strong> connectwithgarena@gmail.com &nbsp;|&nbsp; <strong>Phone:</strong> +91 7393845435</p>
          </div>

          <p>At Free Fire Store, we are committed to ensuring you have a seamless and satisfying shopping experience. If you are not entirely happy with your purchase, we are here to help. Please read our Return and Refund Policy carefully before placing your order.</p>

          <h2>1. RETURN ELIGIBILITY</h2>
          <p>We offer a 7-day return policy from the date of delivery.</p>
          <p>To be eligible for a return, <strong>ALL</strong> of the following conditions must be met:</p>
          <ul>
            <li>Your return request must be raised within 7 days of the delivery date as shown in your tracking information.</li>
            <li>The item must be unused, unworn, and unwashed.</li>
            <li>All original brand tags, labels, and hygiene stickers must be intact and attached to the item.</li>
            <li>The item must be in its original packaging.</li>
            <li>A valid proof of purchase (Order ID, order confirmation email, or invoice) must be provided.</li>
          </ul>
          <p>Items that do not meet all of the above conditions will not be accepted for return, and no refund will be issued.</p>

          <h2>2. NON-RETURNABLE ITEMS</h2>
          <p>For hygiene and quality control reasons, the following items cannot be returned or exchanged under any circumstances (except if received in a damaged or defective condition with proof provided within 48 hours of delivery):</p>
          <ul>
            <li>Innerwear, underwear, boxers, briefs, bras, and lingerie</li>
            <li>Socks and stockings</li>
            <li>Shapewear and body-hugging compression garments that involve direct skin contact without an outer layer</li>
            <li>Items marked as "Final Sale", "Clearance", or purchased during special sale events</li>
            <li>Gift cards or digital products (if any)</li>
            <li>Any item that has been used, washed, altered, or is missing its tags</li>
          </ul>

          <h2>3. SALE AND PROMOTIONAL ORDER POLICY</h2>
          <ul>
            <li>No returns are accepted on items purchased during sale events, flash sales, festive sales, or orders placed using discount codes, unless the item is received damaged or defective.</li>
            <li>One size exchange is permitted per sale item, subject to stock availability.</li>
            <li>Sale exchange requests must be raised within 7 days of delivery.</li>
          </ul>

          <h2>4. DAMAGED, DEFECTIVE, OR INCORRECT ITEMS</h2>
          <p>If you receive an item that is damaged, defective, or incorrect (wrong product, wrong size, or wrong colour), please contact us within <strong>48 hours</strong> of delivery at connectwithgarena@gmail.com or +91 7393845435.</p>
          <p>You must provide:</p>
          <ul>
            <li>Your Order ID and registered mobile number</li>
            <li>Clear photographs of the item from multiple angles showing the damage or defect</li>
            <li>A photograph of the original packaging and shipping label</li>
          </ul>
          <p>Once verified, we will arrange a free pickup from your address and offer you a full refund or replacement, as per your preference. All shipping costs for damaged or incorrect item returns are borne by Free Fire Store.</p>
          <p><strong>Please note:</strong> Damage claims raised after 48 hours of delivery will not be accepted.</p>

          <h2>5. HOW TO INITIATE A RETURN</h2>
          <p><strong>Step 1:</strong> Contact us within 7 days of delivery:<br />
          Email: <strong>connectwithgarena@gmail.com</strong><br />
          Phone / WhatsApp: <strong>+91 7393845435</strong></p>
          <p><strong>Step 2:</strong> Share your Order ID, registered mobile number, reason for return, and clear photographs of the item and its original packaging.</p>
          <p><strong>Step 3:</strong> Our support team will review your request and respond with an approval or rejection within 1 to 2 business days.</p>
          <p><strong>Step 4:</strong> If approved, we will arrange a reverse pickup from your delivery address (subject to pin code serviceability). You will receive a call or message from our courier partner to schedule the pickup.</p>
          <p><strong>Step 5:</strong> Once we receive the returned item at our facility and it passes quality inspection, your refund or exchange will be processed.</p>
          <p><strong>Important:</strong> Items sent back to us without a prior approved return request will NOT be accepted and will be returned to the sender. No refund will be issued for such items.</p>

          <h2>6. REVERSE PICKUP</h2>
          <p>We offer free reverse pickup for most serviceable pin codes across India through our courier partners.</p>
          <p>Our courier partner will attempt pickup up to 2 times at your delivery address. If the pickup is not completed within 2 days of scheduling, please contact us to reschedule.</p>
          <p>If your pin code is NOT serviceable for reverse pickup, you will need to self-ship the item to our return address (see Section 7 below).</p>

          <h2>7. SELF-SHIPPING FOR NON-SERVICEABLE PIN CODES</h2>
          <p>If reverse pickup is not available at your pin code, please ship the item to the following address at your own cost:</p>
          <div className="policy-info-box" style={{ marginTop: '12px' }}>
            <p><strong>Return Address:</strong></p>
            <p>Free Fire Store</p>
            <p>C/O Kalpana Singh</p>
            <p>PRANNATHPUR BACHHARIYA, SULTANPUR,</p>
            <p>UTTAR PRADESH, INDIA, 228171</p>
            <p>Phone: +91 7393845435</p>
          </div>
          <p><strong>Important instructions for self-shipped returns:</strong></p>
          <ul>
            <li>Pack the item securely in its original packaging to prevent damage during transit.</li>
            <li>Clearly write your Order ID and registered mobile number on the outside of the package.</li>
            <li>Use a trackable courier service. We recommend India Post Speed Post for the widest coverage across India.</li>
            <li>Share the tracking number with us at connectwithgarena@gmail.com after shipping.</li>
            <li>Free Fire Store is NOT responsible for items lost, stolen, or damaged during self-shipping. Customers are advised to use insured courier services for high-value returns.</li>
            <li>Self-shipping costs are borne by the customer, except in cases of damaged, defective, or incorrect items.</li>
          </ul>

          <h2>8. EXCHANGES</h2>
          <p>We offer one size or colour exchange per item, subject to stock availability.</p>
          <ul>
            <li>Exchange requests must be raised within 7 days of delivery.</li>
            <li>The item must meet all return eligibility conditions listed in Section 1.</li>
            <li>Exchange is allowed for the same product in a different size or colour, or for a different product of equal value, subject to availability.</li>
            <li>If the replacement product is of higher value, the price difference must be paid by the customer before dispatch.</li>
            <li>If the replacement product is of lower value, the balance will be issued as store credit.</li>
            <li>No further return or exchange is permitted on an already exchanged item.</li>
          </ul>
          <p>To initiate an exchange, follow the same process as a return (Section 5) and mention "Exchange Request" in your message.</p>

          <h2>9. REFUND PROCESS AND TIMELINES</h2>
          <p>Once we receive the returned item at our facility:</p>
          <ul>
            <li>Quality inspection will be completed within 1 to 2 business days of receipt.</li>
            <li>You will be notified via email or SMS about the inspection result.</li>
            <li>If approved, your refund will be initiated within 48 hours of inspection completion (Monday to Friday, excluding public holidays).</li>
          </ul>

          <div style={{ margin: '20px 0' }}>
            <table >
              <thead>
                <tr >
                  <th >PAYMENT METHOD USED</th>
                  <th >REFUND ISSUED AS</th>
                  <th >TIMELINE AFTER INITIATION</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td data-label="Payment Method Used">Credit Card / Debit Card</td>
                  <td data-label="Refund Issued As">Back to the same card</td>
                  <td data-label="Timeline After Initiation">5 to 7 business days</td>
                </tr>
                <tr >
                  <td data-label="Payment Method Used">Net Banking</td>
                  <td data-label="Refund Issued As">Back to the same bank account</td>
                  <td data-label="Timeline After Initiation">5 to 7 business days</td>
                </tr>
                <tr >
                  <td data-label="Payment Method Used">UPI (Google Pay, PhonePe, Paytm)</td>
                  <td data-label="Refund Issued As">Back to the same UPI ID</td>
                  <td data-label="Timeline After Initiation">2 to 5 business days</td>
                </tr>
                <tr >
                  <td data-label="Payment Method Used">Digital Wallets</td>
                  <td data-label="Refund Issued As">Back to the same wallet</td>
                  <td data-label="Timeline After Initiation">2 to 3 business days</td>
                </tr>
                <tr >
                  <td data-label="Payment Method Used">EMI Orders</td>
                  <td data-label="Refund Issued As">Refund to card, EMI cancellation by bank</td>
                  <td data-label="Timeline After Initiation">7 to 10 business days</td>
                </tr>
                <tr >
                  <td data-label="Payment Method Used">Cash on Delivery (COD)</td>
                  <td data-label="Refund Issued As">Store Credit to registered email</td>
                  <td data-label="Timeline After Initiation">Issued within 48 hours</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Important Notes on Refunds:</strong></p>
          <ul>
            <li>Refund timelines after initiation depend on your bank or payment provider and are outside our control.</li>
            <li>COD orders will <strong>NOT</strong> receive a cash refund or bank transfer. Refunds for COD orders are issued exclusively as store credit to your registered email ID.</li>
            <li>Store credit is valid for 6 months from the date of issue and can be used for any future purchase on www.garenaofficialfreefire.shop.</li>
            <li>Store credit cannot be extended beyond its validity period, transferred to another account, or converted to cash.</li>
            <li>The original COD handling fee (if any) is non-refundable and will be deducted from the refund amount.</li>
            <li>Original shipping charges are non-refundable, except in cases where Free Fire Store dispatched a wrong or defective item.</li>
          </ul>

          <h2>10. LATE OR MISSING REFUNDS</h2>
          <p>If you have not received your refund within the stated timeframe after we have initiated it, please follow these steps:</p>
          <p><strong>Step 1:</strong> Check your bank account, card statement, or UPI app again.</p>
          <p><strong>Step 2:</strong> Contact your bank or card issuer, as refund posting times vary between financial institutions.</p>
          <p><strong>Step 3:</strong> If the refund still has not appeared after 7 business days from our initiation date, contact us at connectwithgarena@gmail.com with your Order ID and we will investigate with our payment gateway partner.</p>

          <h2>11. ORDER CANCELLATION AND REFUND</h2>
          <p><strong>Cancellation by Customer (Before Dispatch):</strong></p>
          <ul>
            <li>You may cancel your order within 24 hours of placing it by contacting us at connectwithgarena@gmail.com or +91 7393845435.</li>
            <li>A full refund will be processed to your original payment method within 5 to 7 business days.</li>
            <li>COD orders cancelled before dispatch will not attract any cancellation charge.</li>
          </ul>
          <p><strong>Cancellation by Customer (After Dispatch):</strong></p>
          <ul>
            <li>Once an order has been dispatched, cancellation is not possible.</li>
            <li>If you refuse delivery, the item will be returned to us. A refund will be issued after deducting the original and return shipping charges from the order value.</li>
            <li>COD orders where delivery is refused will not receive any refund, as no payment was made by the customer.</li>
          </ul>
          <p><strong>Cancellation by Free Fire Store:</strong></p>
          <ul>
            <li>We may cancel orders due to stock unavailability, payment failure, pricing errors, incomplete address, or suspected fraud.</li>
            <li>A full refund will be issued within 5 to 7 business days of cancellation and you will be notified by email or SMS.</li>
          </ul>

          <h2>12. PAYMENT GATEWAY AND CHARGEBACK POLICY</h2>
          <p>All online refunds are processed through our authorised payment gateway partners including PayU Payments Private Limited, Razorpay, CCAvenue, Cashfree, and Shopify Payments. These gateways are PCI-DSS compliant and authorised by the Reserve Bank of India (RBI).</p>
          <p>If you believe an incorrect or unauthorised charge has occurred, please contact us at connectwithgarena@gmail.com BEFORE initiating a chargeback with your bank. We will investigate and resolve the issue promptly.</p>
          <p>Initiating a chargeback for a legitimate and fulfilled order without first contacting us may be considered fraudulent. In such cases, we reserve the right to submit transaction evidence to the payment gateway and your bank, and to take appropriate legal action.</p>

          <h2>13. GRIEVANCE OFFICER</h2>
          <p>In accordance with the Consumer Protection Act, 2019 and the Consumer Protection (E-Commerce) Rules, 2020, our Grievance Officer details are:</p>
          <div className="policy-info-box" style={{ marginTop: '12px' }}>
            <p><strong>Name:</strong> Kalpana Singh</p>
            <p><strong>Designation:</strong> Proprietor and Grievance Officer</p>
            <p><strong>Email:</strong> connectwithgarena@gmail.com</p>
            <p><strong>Phone:</strong> +91 7393845435</p>
            <p><strong>Address:</strong> PRANNATHPUR BACHHARIYA, SULTANPUR, UTTAR PRADESH, INDIA, 228171</p>
            <p><strong>Working Hours:</strong> Monday to Saturday, 10:00 AM to 6:00 PM IST</p>
          </div>
          <p>All grievances will be acknowledged within 48 hours and resolved within 30 days of receipt.</p>

          <h2>14. CONTACT US</h2>
          <p>For any return, refund, exchange, or cancellation queries, please contact us:</p>
          <div className="policy-info-box" style={{ marginTop: '12px' }}>
            <p><strong>Business Name:</strong> Free Fire Store</p>
            <p><strong>Proprietor:</strong> Kalpana Singh</p>
            <p><strong>Email:</strong> connectwithgarena@gmail.com</p>
            <p><strong>Phone / WhatsApp:</strong> +91 7393845435</p>
            <p><strong>Business Name:</strong> Free Fire Store</p>
            <p><strong>Udyam Reg. No:</strong> UDYAM-UP-03-0123799</p>
            <p><strong>Business Type:</strong> We sell clothes and premium clothing in India.</p>
            <p><strong>Registered Address:</strong> PRANNATHPUR BACHHARIYA, SULTANPUR, UTTAR PRADESH, INDIA, 228171</p>
            <p><strong>Website:</strong> www.garenaofficialfreefire.shop</p>
            <p><strong>Support Hours:</strong> Monday to Saturday, 10:00 AM to 6:00 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
