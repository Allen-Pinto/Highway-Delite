import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, Calendar, MapPin, Clock, Users, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import Button from '../components/shared/Button';
import type { Booking } from '../types/index';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const booking = location.state?.booking as Booking;
  const experienceName = location.state?.experienceName as string;

  useEffect(() => {
    if (!booking) {
      navigate('/experiences');
      return;
    }

    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B'],
      });
    }, 100);

    return () => clearInterval(interval);
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  const experience = booking.experience as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      <Navbar />

      <div className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 shadow-2xl">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Booking Confirmed! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600"
          >
            Get ready for an amazing experience!
          </motion.p>
        </motion.div>

        {/* Booking Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-6 border-2 border-yellow-400"
        >
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your Booking Reference</p>
            <p className="text-3xl font-bold text-gray-900 tracking-wider">{booking.referenceId}</p>
            <p className="text-sm text-gray-500 mt-2">Save this for your records</p>
          </div>
        </motion.div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          {/* Experience Image */}
          {experience?.image && (
            <div className="h-48 overflow-hidden">
              <img
                src={experience.image}
                alt={experienceName || experience.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {experienceName || experience?.title}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Date & Time</p>
                  <p className="text-gray-600">
                    {formatDate(booking.bookingDate)} at {booking.timeSlot}
                  </p>
                </div>
              </div>

              {experience?.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{experience.location}</p>
                  </div>
                </div>
              )}

              {experience?.duration && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Duration</p>
                    <p className="text-gray-600">{experience.duration}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Number of People</p>
                    <p className="text-gray-600">{booking.quantity} person(s)</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(booking.subtotal)}</span>
                </div>
                {booking.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {booking.promoCode && `(${booking.promoCode})`}</span>
                    <span>- {formatCurrency(booking.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST (9%)</span>
                  <span className="text-gray-900">{formatCurrency(booking.cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST (9%)</span>
                  <span className="text-gray-900">{formatCurrency(booking.sgst)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 text-lg font-bold">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-yellow-600">{formatCurrency(booking.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Email Confirmation Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-8"
        >
          <div className="flex gap-3">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Confirmation Email Sent</h3>
              <p className="text-sm text-gray-700">
                We've sent a detailed confirmation email to <strong>{booking.customerEmail}</strong> with all your booking details and instructions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="lg"
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Receipt
          </Button>
          <Link to="/experiences" className="flex-1">
            <Button
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Experiences
            </Button>
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center text-sm text-gray-600"
        >
          <p className="mb-2">Need help? Contact us at support@highwaydelite.com</p>
          <p>or call +91 1800-123-4567</p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}