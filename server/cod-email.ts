import { createHash } from 'node:crypto';
import { PRODUCTS } from '../src/data/products';
import type { OrderEmail } from './order-message';
import { deliverOrderEmail } from './email-delivery';

export class CodEmailError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export type EmailJob = { order: OrderEmail; expires: number; sent: boolean; leaseUntil: number };
export interface CodEmailStore {
  reserve(orderId: string, now: number): Promise<EmailJob>;
  complete(orderId: string): Promise<void>;
  release(orderId: string): Promise<void>;
}
const clean = (value: unknown, max = 200) => typeof value === 'string' ? value.replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, max) : '';
export const recipientKey = (email: string) => createHash('sha256').update(email.toLowerCase()).digest('hex');

// Read the stored order, never a recipient, total or product description from the email request.
export function codOrderMessage(order: any, now: number): OrderEmail {
  const fail = () => { throw new CodEmailError(409, 'Order is not eligible for confirmation'); };
  const created = typeof order?.createdAt === 'string' ? Date.parse(order.createdAt) : order?.createdAt?.toMillis?.();
  if (order?.paymentMethod !== 'Cash on Delivery (COD)' || order.status !== 'Order Placed (COD)' || !Number.isFinite(created) || created > now + 60000 || created < now - 23 * 3600000) fail();
  const email = clean(order.userEmail, 254).toLowerCase();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || clean(order.shippingAddress?.email, 254).toLowerCase() !== email) fail();
  const customer = Object.fromEntries(['firstName', 'lastName', 'address', 'city', 'state', 'pincode', 'phone'].map(key => [key, clean(order.shippingAddress?.[key])])) as OrderEmail['customer'];
  if (!customer.firstName || !customer.address || !customer.city || !/^\d{6}$/.test(customer.pincode) || customer.phone.replace(/\D/g, '').length < 10) fail();
  if (!Array.isArray(order.items) || !order.items.length || order.items.length > 50) fail();
  const items: OrderEmail['items'] = order.items.map((item: any) => {
    const product = PRODUCTS.find(p => p.id === Number(item?.id));
    const qty = Number(item?.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 100 || !product.sizes.includes(item.size) || Number(item.price) !== product.price) return fail();
    const color = clean(item.color, 60);
    if (color && !product.colors?.includes(color)) return fail();
    return { id: product.id, name: product.name, size: item.size, color, qty, price: product.price };
  });
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (!Number.isFinite(Number(order.total)) || Math.round(total * 100) !== Math.round(Number(order.total) * 100) || !/^\d{6}$/.test(String(order.orderNumber))) fail();
  return { payment: 'cod', email, customer, items, total, orderNumber: String(order.orderNumber) };
}

export async function confirmCodEmail(store: CodEmailStore, orderId: string, now = Date.now(), send = deliverOrderEmail) {
  const job = await store.reserve(orderId, now);
  if (job.sent) return;
  try {
    await send(job.order, `cod-confirmation/${orderId}`);
    await store.complete(orderId);
  } catch (error) {
    // A timeout can mean the provider accepted the message. Keep the same payload/key for retries.
    await store.release(orderId).catch(() => {});
    throw error;
  }
}
