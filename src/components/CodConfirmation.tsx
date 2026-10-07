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
  return null;
}
