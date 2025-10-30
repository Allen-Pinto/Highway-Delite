import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Tag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import CheckoutForm from '../components/checkout/CheckoutForm';
import PromoCodeInput from '../components/checkout/PromoCodeInput';
import OrderSummary from '../components/checkout/OrderSummary';
import { bookingApi, promoApi } from '../services/api';
import type { PromoCode } from '../types/index';
import { calculateGST } from '../utils/helpers';

interface BookingData {
  experienceId: string;
  experienceName: string;
  experienceImage: string;
  experienceLocation: string;
  experienceDuration: string;
  slotId: string;
  date: string;
  timeSlot: string;
  quantity: number;
  price: number;
  subtotal: number;
  category: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form data
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    // Get booking data from session storage
    const storedData = sessionStorage.getItem('bookingData');
    if (!storedData) {
      toast.error('No booking data found');
      navigate('/experiences');
      return;
    }

    setBookingData(JSON.parse(storedData));
  }, [navigate]);

  const handleApplyPromo = async (code: string) => {
    if (!code.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    if (!bookingData) return;

    setPromoLoading(true);
    try {
      const response = await promoApi.validate(
        code,
        bookingData.subtotal,
        bookingData.category,
        customerEmail || undefined
      );

      setAppliedPromo(response.data);
      setPromoCode(code);
      toast.success(`Promo code applied! You saved ₹${response.data.discountAmount}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid promo code');
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('Promo code removed');
  };

  // Simple idempotency key generator for frontend
  const generateIdempotencyKey = () => {
    return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingData) return;

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Generate idempotency key
      const idempotencyKey = generateIdempotencyKey();

      const response = await bookingApi.create({
        experienceId: bookingData.experienceId,
        slotId: bookingData.slotId,
        quantity: bookingData.quantity,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        promoCode: appliedPromo?.code,
        idempotencyKey,
      });

      // Clear session storage
      sessionStorage.removeItem('bookingData');

      // Navigate to success page with booking data
      navigate('/success', {
        state: {
          booking: response.data,
          experienceName: bookingData.experienceName,
        },
      });

      toast.success('Booking confirmed! Check your email for details.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  // Calculate pricing
  const subtotal = bookingData.subtotal;
  const discount = appliedPromo?.discountAmount || 0;
  const taxableAmount = subtotal - discount;
  const gst = calculateGST(taxableAmount);
  const total = taxableAmount + gst.total;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Experience</span>
        </button>

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-lg text-gray-600">Fill in your details to confirm the experience</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-md"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
                <CheckoutForm
                  customerName={customerName}
                  customerEmail={customerEmail}
                  customerPhone={customerPhone}
                  onNameChange={setCustomerName}
                  onEmailChange={setCustomerEmail}
                  onPhoneChange={setCustomerPhone}
                />
              </motion.div>

              {/* Promo Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-md"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Promo Code</h2>
                </div>
                <PromoCodeInput
                  promoCode={promoCode}
                  appliedPromo={appliedPromo}
                  loading={promoLoading}
                  onPromoCodeChange={setPromoCode}
                  onApply={handleApplyPromo}
                  onRemove={handleRemovePromo}
                />
              </motion.div>

              {/* Terms & Conditions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-md"
              >
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      I agree to the{' '}
                      <button type="button" className="text-yellow-600 hover:text-yellow-700 font-medium underline">
                        terms and conditions
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-yellow-600 hover:text-yellow-700 font-medium underline">
                        cancellation policy
                      </button>
                    </span>
                  </div>
                </label>
              </motion.div>

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
              >
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Please Note:</p>
                    <ul className="space-y-1">
                      <li>• You'll receive a confirmation email with all booking details</li>
                      <li>• Cancellations must be made at least 24 hours in advance</li>
                      <li>• Refunds will be processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary
                  experienceData={{
                    name: bookingData.experienceName,
                    image: bookingData.experienceImage,
                    location: bookingData.experienceLocation,
                    duration: bookingData.experienceDuration,
                    date: bookingData.date,
                    timeSlot: bookingData.timeSlot,
                    quantity: bookingData.quantity,
                  }}
                  pricing={{
                    subtotal,
                    discount,
                    cgst: gst.cgst,
                    sgst: gst.sgst,
                    total,
                  }}
                  appliedPromo={appliedPromo}
                  loading={loading}
                  disabled={!agreedToTerms}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}