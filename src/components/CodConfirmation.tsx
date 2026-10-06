import { useEffect, useRef, useState } from 'react';
import { sendCodConfirmation } from '../lib/order-email';

export default function CodConfirmation({ orderId, autoSend = false }: { orderId: string; autoSend?: boolean }) {
  const started = useRef(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const send = async () => {
    setStatus('sending');
    setStatus(await sendCodConfirmation(orderId) ? 'sent' : 'failed');
  };
  useEffect(() => {
    if (autoSend && !started.current) { started.current = true; void send(); }
  }, [autoSend, orderId]);
  return <div className="cod-confirmation">
    <p role="status">{status === 'sending' ? 'Sending your order confirmation…' : status === 'sent' ? 'Your order confirmation email has been sent.' : status === 'failed' ? 'Your order is saved. Email is unavailable right now; you can retry without placing another order.' : ''}</p>
    {(status === 'idle' || status === 'failed') && <button type="button" onClick={() => void send()} className="confirmation-retry">{status === 'failed' ? 'Retry confirmation email' : 'Send confirmation email'}</button>}
  </div>;
}
