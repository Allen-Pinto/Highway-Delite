import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Users, ChevronLeft, 
  CheckCircle, Star, Heart, Share2, Info 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import Loading from '../components/shared/Loading';
import DateSelector from '../components/details/DateSelector';
import TimeSlotPicker from '../components/details/TimeSlotPicker';
import PricingSummary from '../components/details/PricingSummary';
import { experienceApi } from '../services/api';
import type { Experience, Slot } from '../types/index';
import { getCategoryColor, formatDate } from '../utils/helpers';

export default function ExperienceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExperience();
    }
  }, [id]);

  useEffect(() => {
    if (selectedDate && id) {
      fetchSlotsByDate();
    }
  }, [selectedDate, id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const response = await experienceApi.getById(id!);
      setExperience(response.data);

      // Get available dates
      const datesResponse = await experienceApi.getAvailableDates(id!);
      setAvailableDates(datesResponse.data);

      // Auto-select first available date
      if (datesResponse.data.length > 0) {
        setSelectedDate(datesResponse.data[0]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load experience');
      navigate('/experiences');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlotsByDate = async () => {
    try {
      const response = await experienceApi.getSlotsByDate(id!, selectedDate);
      setAvailableSlots(response.data);
      setSelectedSlot(null); // Reset slot when date changes
    } catch (error) {
      toast.error('Failed to load time slots');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedSlot) return;
    
    const maxAllowed = selectedSlot.availableSpots - selectedSlot.bookedSpots;
    if (newQuantity > maxAllowed) {
      toast.error(`Only ${maxAllowed} spots available`);
      return;
    }
    
    if (newQuantity < 1) {
      toast.error('Minimum 1 person required');
      return;
    }

    setQuantity(newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    // Store booking data in sessionStorage
    const bookingData = {
      experienceId: experience!._id,
      experienceName: experience!.title,
      experienceImage: experience!.image,
      experienceLocation: experience!.location,
      experienceDuration: experience!.duration,
      slotId: selectedSlot._id,
      date: selectedDate,
      timeSlot: selectedSlot.timeSlot,
      quantity,
      price: selectedSlot.price,
      subtotal: selectedSlot.price * quantity,
      category: experience!.category,
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/checkout');
  };

  if (loading) {
    return <Loading />;
  }

  if (!experience) {
    return null;
  }

  const subtotal = selectedSlot ? selectedSlot.price * quantity : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Image Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-24 right-6 flex gap-3">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg hover:shadow-xl ${
              isFavorited ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-900 hover:bg-white'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorited ? 'fill-white' : ''}`} />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl">
            <Share2 className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Title & Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getCategoryColor(experience.category)}`}>
                {experience.category.charAt(0).toUpperCase() + experience.category.slice(1)}
              </span>
              {experience.rating && (
                <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                  <span className="font-semibold text-gray-900">{experience.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {experience.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{experience.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{experience.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Max {experience.maxGroupSize} people</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Experience</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{experience.description}</p>
            </motion.div>

            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {experience.includedItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Date Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Date</h2>
              <DateSelector
                availableDates={availableDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </motion.div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-md"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Available Time Slots for {formatDate(selectedDate)}
                </h2>
                {availableSlots.length > 0 ? (
                  <TimeSlotPicker
                    slots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No available slots for this date</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Important Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100"
            >
              <div className="flex gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Important Information</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Please arrive 15 minutes before your scheduled time</li>
                    <li>• Bring a valid ID proof for verification</li>
                    <li>• Cancellation available up to 24 hours before the experience</li>
                    <li>• Weather conditions may affect the experience</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PricingSummary
                basePrice={experience.basePrice}
                selectedSlot={selectedSlot}
                quantity={quantity}
                subtotal={subtotal}
                onQuantityChange={handleQuantityChange}
                onProceedToCheckout={handleProceedToCheckout}
                maxQuantity={selectedSlot ? selectedSlot.availableSpots - selectedSlot.bookedSpots : experience.maxGroupSize}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}