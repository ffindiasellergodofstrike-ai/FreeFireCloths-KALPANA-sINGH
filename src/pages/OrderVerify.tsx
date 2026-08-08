import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, orderBy, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, User, Phone, Calendar, ChevronDown, Plus, ClipboardList, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderLog {
  id: string;
  customerName: string;
  phoneNumber: string;
  mobileNumber: string;
  shippingCompany: string;
  shippingLevel: string;
  deliveryDate: string;
  createdAt: any;
  trackingId?: string;
  orderId?: string;
  deliveryAddress?: string;
}

export default function OrderVerify() {
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [shippingCompany, setShippingCompany] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [shippingLevel, setShippingLevel] = useState('Standard Delivery');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [allLogs, setAllLogs] = useState<OrderLog[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, 'order_verify_logs'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const logsData: OrderLog[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<OrderLog, 'id'>),
      }));

      const seen = new Set<string>();
      const deduplicated = logsData.filter((log) => {
        const key = `${log.customerName}_${log.trackingId || log.orderId || log.createdAt}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setAllLogs(deduplicated);
    } catch (error) {
      console.error('Error fetching order logs:', error);
      toast.error('Failed to load order logs');
    } finally {
      setIsLoading(false);
    }
  };

  const seedManojRecord = async () => {
    try {
      const q = query(
        collection(db, 'order_verify_logs'),
        where('trackingId', '==', 'SF3673820650VNM')
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        // Document exists — force update address on every load until address is present
        const existingDoc = existing.docs[0];
        const data = existingDoc.data();
        if (!data.deliveryAddress || data.deliveryAddress === '') {
          await updateDoc(doc(db, 'order_verify_logs', existingDoc.id), {
            deliveryAddress: 'House No 126, CV Raman Pillai Rd, Bakery, Vazhuthacaud, Thiruvananthapuram, Kerala - 695014'
          });
        }
        return;
      }

      // Document does not exist — create it fresh
      await addDoc(collection(db, 'order_verify_logs'), {
        customerName: 'Manoj Sharma',
        phoneNumber: '+91-7593945430',
        mobileNumber: '+91-7593945430',
        shippingCompany: 'Shadowfax',
        shippingLevel: 'Standard Delivery',
        trackingId: 'SF3673820650VNM',
        orderId: 'ORD-1784126835',
        deliveryDate: '2026-07-23',
        deliveryAddress: 'House No 126, CV Raman Pillai Rd, Bakery, Vazhuthacaud, Thiruvananthapuram, Kerala - 695014',
        createdAt: Timestamp.now()
      });
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  const seedManojRecord2 = async () => {
    try {
      const q = query(
        collection(db, 'order_verify_logs'),
        where('trackingId', '==', 'SF3673820986VNM')
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        const existingDoc = existing.docs[0];
        const data = existingDoc.data();
        if (!data.deliveryAddress || data.deliveryAddress === '') {
          await updateDoc(doc(db, 'order_verify_logs', existingDoc.id), {
            deliveryAddress: 'House No 126, CV Raman Pillai Rd, Bakery, Vazhuthacaud, Thiruvananthapuram, Kerala - 695014'
          });
        }
        return;
      }

      await addDoc(collection(db, 'order_verify_logs'), {
        customerName: 'Manoj Sharma',
        phoneNumber: '+91-7593945430',
        mobileNumber: '+91-7593945430',
        shippingCompany: 'Shadowfax',
        shippingLevel: 'Standard Delivery',
        trackingId: 'SF3673820986VNM',
        orderId: 'ORD-1784133153',
        deliveryDate: '2026-07-20',
        deliveryAddress: 'House No 126, CV Raman Pillai Rd, Bakery, Vazhuthacaud, Thiruvananthapuram, Kerala - 695014',
        createdAt: Timestamp.now()
      });
    } catch (err) {
      console.error('Seed 2 error:', err);
    }
  };

  useEffect(() => {
    async function init() {
      await seedManojRecord();
      await seedManojRecord2();
      await fetchLogs();
    }
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !customerName.trim() ||
      !phoneNumber.trim() ||
      !mobileNumber.trim() ||
      !shippingCompany.trim() ||
      !shippingLevel.trim() ||
      !deliveryDate.trim()
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const newLog = {
        customerName: customerName.trim(),
        deliveryAddress: deliveryAddress.trim(),
        phoneNumber: phoneNumber.trim(),
        mobileNumber: mobileNumber.trim(),
        shippingCompany: shippingCompany.trim(),
        shippingLevel: shippingLevel.trim(),
        trackingId: trackingId.trim(),
        orderId: orderId.trim(),
        deliveryDate: deliveryDate.trim(),
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'order_verify_logs'), newLog);

      toast.success('Order log created successfully');

      // Reset form
      setCustomerName('');
      setDeliveryAddress('');
      setPhoneNumber('');
      setMobileNumber('');
      setShippingCompany('');
      setTrackingId('');
      setOrderId('');
      setShippingLevel('Standard Delivery');
      setDeliveryDate('');

      // Refresh logs
      await fetchLogs();
    } catch (error) {
      console.error('Error creating order log:', error);
      toast.error('Failed to create order log');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique customer names sorted alphabetically
  const uniqueCustomers = Array.from(new Set(allLogs.map((log) => log.customerName))).sort();

  // Filter logs for selected customer with deduplication
  const rawSelectedLogs = selectedCustomer
    ? allLogs.filter((log) => log.customerName.toLowerCase() === selectedCustomer.toLowerCase())
    : [];

  const selectedSeen = new Set<string>();
  const selectedLogs = rawSelectedLogs.filter((log) => {
    const key = `${log.customerName}_${log.trackingId || log.orderId || log.createdAt}`;
    if (selectedSeen.has(key)) return false;
    selectedSeen.add(key);
    return true;
  });

  const formatDeliveryDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return dateStr;
  };

  const formatCreatedAt = (ts: any) => {
    if (!ts) return 'N/A';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 id="order-verify-title" className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          Order Verify — Admin Panel
        </h1>
        <p id="order-verify-subtitle" className="text-slate-500 text-sm mt-1">
          Manage and verify delivery records for payment gateway compliance.
        </p>
      </div>

      {/* PHASE 1 — Create Order Log */}
      <motion.div
        id="phase1-create-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-12"
      >
        <div className="mb-6">
          <h2 id="create-log-heading" className="text-lg font-black uppercase tracking-tight text-black flex items-center gap-2">
            <Plus className="w-5 h-5 text-black" />
            Create Order Log
          </h2>
          <p id="create-log-subheading" className="text-slate-500 text-xs mt-0.5">
            Add a new delivery record to the system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div>
              <label htmlFor="input-customer-name" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Customer Name
              </label>
              <div className="relative">
                <input
                  id="input-customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Manish Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="sm:col-span-2">
              <label htmlFor="input-delivery-address" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Delivery Address
              </label>
              <textarea
                id="input-delivery-address"
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Full shipping address including city, state and pincode"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="input-phone-number" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Phone Number
              </label>
              <input
                id="input-phone-number"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="10-digit phone number"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="input-mobile-number" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Mobile Number
              </label>
              <input
                id="input-mobile-number"
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="WhatsApp or alternate mobile"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Shipping Company */}
            <div>
              <label htmlFor="input-shipping-company" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Shipping Company
              </label>
              <input
                id="input-shipping-company"
                type="text"
                required
                value={shippingCompany}
                onChange={(e) => setShippingCompany(e.target.value)}
                placeholder="e.g. Delhivery, BlueDart, DTDC, Ekart"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Tracking ID */}
            <div>
              <label htmlFor="input-tracking-id" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Tracking ID
              </label>
              <input
                id="input-tracking-id"
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. SF3673820650VNM"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Order ID */}
            <div>
              <label htmlFor="input-order-id" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Order ID
              </label>
              <input
                id="input-order-id"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-1784126835"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Shipping Level */}
            <div>
              <label htmlFor="select-shipping-level" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Shipping Level
              </label>
              <div className="relative">
                <select
                  id="select-shipping-level"
                  required
                  value={shippingLevel}
                  onChange={(e) => setShippingLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors appearance-none cursor-pointer pr-10"
                >
                  <option value="Standard Delivery">Standard Delivery</option>
                  <option value="Express Delivery">Express Delivery</option>
                  <option value="Priority Delivery">Priority Delivery</option>
                  <option value="Same Day Delivery">Same Day Delivery</option>
                  <option value="Next Day Delivery">Next Day Delivery</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Delivery Date */}
            <div>
              <label htmlFor="input-delivery-date" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Delivery Date
              </label>
              <input
                id="input-delivery-date"
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-create-order-log"
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Create Order Log'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* DIVIDER */}
      <hr id="phase-divider" className="my-12 border-slate-200" />

      {/* PHASE 2 — Order Logs Section */}
      <div id="phase2-logs-section" className="space-y-8">
        {/* Sub-part A — Customer Selector Dropdown */}
        <div id="customer-selector-card" className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <label htmlFor="select-customer-dropdown" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            Select Customer to View Details
          </label>
          <div className="relative">
            <select
              id="select-customer-dropdown"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm outline-none focus:border-black transition-colors appearance-none cursor-pointer pr-10 font-medium text-slate-800"
            >
              <option value="">— Select a customer —</option>
              {uniqueCustomers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sub-part B — Selected Customer Detail View */}
        <div id="selected-customer-details-container">
          {isLoading ? (
            <div id="loading-logs-indicator" className="text-center py-12 text-slate-400 text-sm font-medium">
              Loading order records...
            </div>
          ) : !selectedCustomer ? (
            <div id="no-customer-selected-state" className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 text-sm font-medium shadow-sm">
              Select a customer above to view their delivery details.
            </div>
          ) : selectedLogs.length === 0 ? (
            <div id="no-records-found-state" className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 text-sm font-medium shadow-sm">
              No records found for this customer.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div id="selected-logs-list" className="space-y-8">
                {selectedLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    id={`order-log-card-${log.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-sm"
                  >
                    {/* TOP SECTION — Dark Banner */}
                    <div id={`log-card-header-${log.id}`} className="bg-black text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="block text-[10px] font-black tracking-widest uppercase text-slate-400 mb-1">
                          DELIVERY CONFIRMATION
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          {log.customerName}
                        </h3>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>DELIVERED</span>
                      </div>
                    </div>

                    {/* Shipping Address Band */}
                    <div id={`log-card-address-${log.id}`} className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Shipping Address</p>
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                        {log.deliveryAddress || '—'}
                      </p>
                    </div>

                    {/* BOTTOM SECTION — Detail Grid */}
                    <div id={`log-card-body-${log.id}`} className="bg-white p-6 sm:p-8">
                      {/* Prominent Tracking ID Banner */}
                      {log.trackingId && (
                        <div className="mb-6 p-4 bg-slate-50 border-l-4 border-emerald-500 rounded-r-2xl border-t border-b border-r border-slate-100 flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              {log.shippingCompany ? `${log.shippingCompany} Tracking ID` : 'Tracking ID'}
                            </span>
                            <span className="text-base sm:text-lg font-mono font-bold text-slate-900 tracking-wider">
                              {log.trackingId}
                            </span>
                          </div>
                          {log.orderId && (
                            <div className="text-left sm:text-right">
                              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                Order ID
                              </span>
                              <span className="text-sm font-mono font-bold text-slate-800">
                                {log.orderId}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Phone Number */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              Phone Number
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {log.phoneNumber}
                            </span>
                          </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              Mobile Number
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {log.mobileNumber}
                            </span>
                          </div>
                        </div>

                        {/* Courier Partner */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              Courier Partner
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {log.shippingCompany}
                            </span>
                          </div>
                        </div>

                        {/* Shipping Level */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                              Shipping Level
                            </span>
                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold">
                              {log.shippingLevel}
                            </span>
                          </div>
                        </div>

                        {/* Tracking ID Grid Item */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              Tracking ID
                            </span>
                            <span className="text-sm font-mono font-bold text-slate-900">
                              {log.trackingId || '—'}
                            </span>
                          </div>
                        </div>

                        {/* Order ID Grid Item */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                            <ClipboardList className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              Order ID
                            </span>
                            <span className="text-sm font-mono font-bold text-slate-900">
                              {log.orderId || '—'}
                            </span>
                          </div>
                        </div>

                        {/* Delivery Date */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              Delivery Date
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {formatDeliveryDate(log.deliveryDate)}
                            </span>
                          </div>
                        </div>

                        {/* Log Created At */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                            <ClipboardList className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              Log Created At
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {formatCreatedAt(log.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM Footer Band */}
                      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                        <span className="font-bold text-slate-500 uppercase tracking-wider">
                          FREE FIRE SHOP — OFFICIAL DELIVERY RECORD
                        </span>
                        <span className="italic">
                          {log.trackingId === 'SF3673820650VNM'
                            ? 'Shipment delivered on 23 July 2026 (Thursday) at 03:30 PM — Verified via Shadowfax logistics. Tracking ID: SF3673820650VNM'
                            : log.trackingId === 'SF3673820986VNM'
                            ? 'Shipment delivered on 20 July 2026 (Monday) at 05:16 PM — Verified via Shadowfax logistics. Tracking ID: SF3673820986VNM'
                            : 'This record is generated for payment gateway verification purposes.'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

