import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, ShieldCheck, ArrowRight, UserPlus, LogIn, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface AuthModalProps {
  onSuccess?: () => void;
}

export default function AuthModal({ onSuccess }: AuthModalProps) {
  const { showAuthModal, closeAuthModal, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ email: string; password: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // Check if user exists
      const userRef = doc(db, 'users', formData.email);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        toast.error('User already exists. Please login.');
        setIsLoading(false);
        return;
      }

      // Save user to Firestore
      const userData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        pincode: formData.pincode,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, userData);

      setSuccessData({ email: formData.email, password: formData.password });
      login(formData.email);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', formData.email);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists() || userSnap.data().password !== formData.password) {
        toast.error('Invalid email or password.');
        setIsLoading(false);
        return;
      }

      login(formData.email);
      toast.success('Logged in successfully!');
      if (onSuccess) onSuccess();
      closeAuthModal();
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-[95%] sm:w-full sm:max-w-md bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-h-[95vh] flex flex-col"
      >
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-slate-100 transition-colors z-20 bg-slate-100/80 sm:bg-slate-100/50"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-slate-500 hover:text-slate-800" />
        </button>

        <div className="p-5 sm:p-10 overflow-y-auto flex-grow scrollbar-hide">
          <AnimatePresence mode="wait">
            {successData ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-2 sm:py-0"
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black mb-1 sm:mb-2">Account Created!</h2>
                <p className="text-slate-500 text-[10px] sm:text-sm mb-6 sm:mb-8">Your official credentials for Free Fire Shop.</p>
                
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-left border border-slate-100 space-y-3 sm:space-y-4">
                  <div>
                    <span className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Login ID / Gmail</span>
                    <p className="text-xs sm:text-sm font-bold text-black break-all">{successData.email}</p>
                  </div>
                  <div>
                    <span className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Secure Password</span>
                    <p className="text-xs sm:text-sm font-bold text-black">{successData.password}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (onSuccess) onSuccess();
                    closeAuthModal();
                  }}
                  className="w-full bg-black text-white font-bold py-3.5 sm:py-4 rounded-xl text-[10px] sm:text-xs hover:bg-slate-800 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
                >
                  Continue to Checkout <ArrowRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="forms"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-black mb-1.5 sm:mb-2 uppercase tracking-tight">Free Fire Shop</h2>
                  <p className="text-slate-500 text-[10px] sm:text-xs font-medium leading-relaxed max-w-[240px] mx-auto">
                    Login or Register to secure your official order items
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6 sm:mb-8">
                  <button 
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${activeTab === 'login' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <LogIn size={12} /> Login
                  </button>
                  <button 
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${activeTab === 'register' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <UserPlus size={12} /> Register
                  </button>
                </div>

                <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-3 sm:space-y-4">
                  {activeTab === 'register' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Identity Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input 
                            required
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-xs sm:text-sm outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Mobile Contact</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                              required
                              type="tel" 
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleInputChange}
                              placeholder="Mobile Number"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-xs sm:text-sm outline-none focus:border-black transition-colors"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">PIN Code</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                              required
                              type="text" 
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              placeholder="6-Digit PIN"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-xs sm:text-sm outline-none focus:border-black transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Gmail Account</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        required
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-xs sm:text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  <div className={`grid ${activeTab === 'register' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-3 sm:gap-4`}>
                    <div className="space-y-1">
                      <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Secret Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          required
                          type="password" 
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-xs sm:text-sm outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>

                    {activeTab === 'register' && (
                      <div className="space-y-1">
                        <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm Secret</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input 
                            required
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-xs sm:text-sm outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-black text-white font-bold py-3.5 sm:py-4 rounded-xl text-[10px] sm:text-xs hover:bg-slate-800 transition-all uppercase tracking-widest mt-4 sm:mt-6 flex items-center justify-center gap-2 disabled:opacity-50 transform active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      activeTab === 'login' ? 'Login' : 'Verify & Register'
                    )}
                  </button>
                </form>

                <p className="text-center text-[8px] sm:text-[9px] text-slate-400 mt-6 sm:mt-8 leading-relaxed font-medium">
                  Secure checkout enabled. By continuing, you accept our <br className="hidden sm:block"/>
                  <Link to="/policies/terms" onClick={closeAuthModal} className="text-black font-bold hover:underline">Terms of Service</Link> and <Link to="/policies/privacy" onClick={closeAuthModal} className="text-black font-bold hover:underline">Privacy Protocol</Link>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
