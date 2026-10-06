export function saveOrderReceipt(gid: string, receipt?: string) {
  if (receipt) sessionStorage.setItem(`order-receipt:${gid}`,receipt);
}
export async function sendOrderConfirmation(gid: string): Promise<string> {
  const key=`order-receipt:${gid}`, receipt=sessionStorage.getItem(key);
  if (!receipt) return 'Your order details are available in My Orders.';
  try {
    const response=await fetch('/api/order-confirmation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({receipt})});
    if (!response.ok) return 'Your order is saved. The confirmation email could not be sent yet; refresh this page to retry.';
    sessionStorage.removeItem(key);
    return 'Your order confirmation email has been sent.';
  } catch { return 'Your order is saved. Email is temporarily unavailable; refresh this page to retry.'; }
}

export async function sendCodConfirmation(orderId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/cod-confirmation', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    return response.ok && (await response.json()).sent === true;
  } catch { return false; }
}
