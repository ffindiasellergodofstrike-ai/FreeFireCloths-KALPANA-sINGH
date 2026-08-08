import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OrderItem {
  id: string | number;
  name?: string;
  title?: string;
  price: number;
  qty?: number;
  quantity?: number;
  size?: string;
  cat?: string;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: number;
  total: number;
  status: string;
  createdAt: any;
  items: OrderItem[];
}

interface UserProfileData {
  name?: string;
  email?: string;
  mobile?: string;
}

export default function MyOrders() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    // Fetch user profile from Firebase Firestore
    async function fetchUserProfile() {
      try {
        const userRef = doc(db, 'users', user.email.toLowerCase());
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfileData(userSnap.data() as UserProfileData);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }

    fetchUserProfile();

    // Set up real-time listener for orders from Firebase
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid || user.email),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((document) => {
          fetchedOrders.push({ id: document.id, ...document.data() } as Order);
        });
        setOrders(fetchedOrders);
        setLoading(false);
      }, (error) => {
        console.error("Error listening to real-time orders:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up order snapshot listener:", error);
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const emoji = (cat?: string) => cat === 'men' ? '👕' : cat === 'women' ? '👗' : '💻';

  const getFormattedDate = (createdAt: any) => {
    if (!createdAt) return 'Pending';
    let d: Date;
    if (typeof createdAt === 'string') {
      d = new Date(createdAt);
    } else if (createdAt.toDate) {
      d = createdAt.toDate();
    } else if (createdAt.seconds) {
      d = new Date(createdAt.seconds * 1000);
    } else {
      return 'Pending';
    }
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getOrderStatus = (order: Order) => {
    if (order.status) return order.status;
    if (!order.createdAt) return 'Order Placed';
    let datePlaced: Date;
    if (typeof order.createdAt === 'string') {
      datePlaced = new Date(order.createdAt);
    } else if (order.createdAt.toDate) {
      datePlaced = order.createdAt.toDate();
    } else if (order.createdAt.seconds) {
      datePlaced = new Date(order.createdAt.seconds * 1000);
    } else {
      return 'Order Placed';
    }

    const diffTime = Math.abs(new Date().getTime() - datePlaced.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays >= 10) {
      return 'Delivered';
    } else if (diffDays >= 3) {
      return 'In Transit';
    }
    return 'Order Placed';
  };

  if (!user) {
    return (
      <div id="orders-page-root">
        <div className="page-hero">
          <div className="container">
            <h1>My Profile & Orders</h1>
            <p>Track your purchases & manage your account</p>
          </div>
        </div>
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-h)', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>ACCESS RESTRICTED</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '28px' }}>Please log in to your account to view your profile details and purchase history.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-black">LOG IN NOW</Link>
            <Link to="/" className="btn btn-outline">RETURN HOME</Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profileData?.name || user.name || 'FREE FIRE STORE Customer';
  const displayEmail = profileData?.email || user.email;
  const displayMobile = profileData?.mobile || user.mobile || 'Not provided';

  return (
    <div id="orders-page-root">
      <div className="page-hero">
        <div className="container">
          <h1>My Profile & Orders</h1>
          <p>Manage your user details & track your order shipments</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px 60px' }}>
        {/* USER PROFILE SECTION */}
        <div 
          id="user-profile-section"
          style={{ 
            background: '#ffffff', 
            border: '1px solid var(--border)', 
            padding: '28px 32px', 
            marginBottom: '40px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '18px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-h)', fontWeight: 700, letterSpacing: '1px', margin: 0, color: 'var(--dark)' }}>
                ACCOUNT PROFILE
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--gray)', margin: '4px 0 0' }}>Your verified user credentials and contact information</p>
            </div>
            <button 
              onClick={handleLogout} 
              style={{ 
                background: '#000000', 
                color: '#ffffff', 
                border: 'none', 
                padding: '12px 24px', 
                fontSize: '11px', 
                fontFamily: 'var(--font-h)', 
                fontWeight: 700, 
                letterSpacing: '1.5px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#000000'}
              id="profile-logout-btn"
            >
              <i className="fa fa-sign-out"></i> LOG OUT
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
                FULL NAME
              </span>
              <strong style={{ fontSize: '15px', color: 'var(--dark)', display: 'block', fontFamily: 'var(--font-h)' }}>
                {displayName}
              </strong>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
                EMAIL ADDRESS
              </span>
              <strong style={{ fontSize: '15px', color: 'var(--dark)', display: 'block', wordBreak: 'break-all', fontFamily: 'var(--font-h)' }}>
                {displayEmail}
              </strong>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
                MOBILE NUMBER
              </span>
              <strong style={{ fontSize: '15px', color: 'var(--dark)', display: 'block', fontFamily: 'var(--font-h)' }}>
                {displayMobile}
              </strong>
            </div>
          </div>
        </div>

        {/* ORDERS SECTION HEADER */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-h)', fontWeight: 700, letterSpacing: '1px', margin: 0, color: 'var(--dark)' }}>
            PURCHASE HISTORY & ORDERS
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--gray)', margin: '4px 0 0' }}>Real-time order status tracking directly from Firebase</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--dark)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--gray)', fontFamily: 'var(--font-h)', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>RETRIEVING ORDERS FROM FIREBASE...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-h)', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>NO ORDERS FOUND</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>You haven't placed any orders yet. Start exploring our collections today!</p>
            <Link to="/collections/all" className="btn btn-black">BROWSE CATALOG</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} id="ordersArchive">
            {orders.map((order) => {
              const statusText = getOrderStatus(order);
              const statusLower = statusText.toLowerCase();
              
              let statusBg = '#f0fdf4';
              let statusColor = '#166534';
              let statusBorder = '#bbf7d0';

              if (statusLower.includes('transit') || statusLower.includes('ship')) {
                statusBg = '#eff6ff';
                statusColor = '#1e40af';
                statusBorder = '#bfdbfe';
              } else if (statusLower.includes('process') || statusLower.includes('placed')) {
                statusBg = '#fff7ed';
                statusColor = '#9a3412';
                statusBorder = '#fed7aa';
              } else if (statusLower.includes('cancel')) {
                statusBg = '#fef2f2';
                statusColor = '#991b1b';
                statusBorder = '#fecaca';
              }

              return (
                <div 
                  key={order.id} 
                  style={{ background: '#fff', border: '1px solid var(--border)', padding: '24px' }}
                  id={`order-record-${order.orderNumber}`}
                >
                  {/* Order Top Bar */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-h)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: 'var(--gray)' }}>ORDER ID:</span>
                      <strong style={{ fontFamily: 'var(--font-h)', fontSize: '13px', marginLeft: '6px', color: 'var(--dark)' }}>#{order.orderNumber}</strong>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-h)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: 'var(--gray)' }}>DATE:</span>
                      <strong style={{ fontFamily: 'var(--font-h)', fontSize: '13px', marginLeft: '6px', color: 'var(--dark)' }}>
                        {getFormattedDate(order.createdAt)}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-h)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: 'var(--gray)' }}>STATUS:</span>
                      <strong style={{ fontFamily: 'var(--font-h)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginLeft: '6px', color: statusColor, background: statusBg, border: `1px solid ${statusBorder}`, padding: '4px 10px' }}>
                        {statusText.toUpperCase()}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-h)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: 'var(--gray)' }}>GRAND TOTAL:</span>
                      <strong style={{ fontFamily: 'var(--font-h)', fontSize: '14px', marginLeft: '6px', color: 'var(--dark)' }}>{fmt(order.total)}</strong>
                    </div>
                  </div>

                  {/* Items in the Order */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name || item.title} 
                            style={{ width: '56px', height: '56px', objectFit: 'cover', flexShrink: 0 }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className={`ph ph-${item.cat === 'electronics' ? 'elec' : item.cat || 'men'}`} style={{ width: '56px', height: '56px', fontSize: '28px', flexShrink: 0 }}>
                            {emoji(item.cat)}
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dark)' }}>{item.name || item.title}</h4>
                          <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '2px' }}>
                            Size: {item.size || 'ONE SIZE'} &nbsp;|&nbsp; Qty: {item.qty || item.quantity || 1}
                          </p>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{fmt(item.price * (item.qty || item.quantity || 1))}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
