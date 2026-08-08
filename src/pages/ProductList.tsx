import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/collections/all', { replace: true });
  }, [navigate]);

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <p>Redirecting to collection...</p>
    </div>
  );
}
