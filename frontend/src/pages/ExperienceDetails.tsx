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
  const [fetchingSlots, setFetchingSlots] = useState(false);

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

  // ========== FIXED: Removed .data from all API responses ==========
  
  const fetchExperience = async () => {
    try {
      setLoading(true);
      
      // Fetch experience details
      const experienceData = await experienceApi.getById(id!);
      setExperience(experienceData);
      
      // Fetch available dates
      const dates = await experienceApi.getAvailableDates(id!);
      setAvailableDates(dates);
      
      // Auto-select first available date
      if (dates && dates.length > 0) {
        setSelectedDate(dates[0]);
      } else {
        toast.error('No available dates for this experience');
      }
      
    } catch (error: any) {
      console.error('Error fetching experience:', error);
      toast.error(error.response?.data?.message || 'Failed to load experience');
      navigate('/experiences');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlotsByDate = async () => {
    if (!selectedDate) return;
    
    try {
      setFetchingSlots(true);
      const slots = await experienceApi.getSlotsByDate(id!, selectedDate);
      
      console.log('Slots fetched:', slots); // Debug log
      
      // Handle both array and object responses
      const slotsArray = Array.isArray(slots) ? slots : slots.slots || [];
      setAvailableSlots(slotsArray);
      
      // Reset selected slot when date changes
      setSelectedSlot(null);
      
      // Auto-select first available slot if any
      if (slotsArray.length > 0) {
        // Optionally auto-select first slot (uncomment if desired)
        // setSelectedSlot(slotsArray[0]);
      }
      
    } catch (error: any) {
      console.error('Error fetching slots:', error);
      toast.error(error.response?.data?.message || 'Failed to load time slots');
      setAvailableSlots([]);
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedSlot) {
      toast.error('Please select a time slot first');
      return;
    }
    
    const maxAllowed = selectedSlot.availableSpots - selectedSlot.bookedSpots;
    
    if (newQuantity > maxAllowed) {
      toast.error(`Only ${maxAllowed} spots available for this slot`);
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

    if (!experience) {
      toast.error('Experience data not loaded');
      return;
    }

    // Validate slot availability
    const availableSpots = selectedSlot.availableSpots - selectedSlot.bookedSpots;
    if (quantity > availableSpots) {
      toast.error(`Only ${availableSpots} spots available`);
      return;
    }

    // Store booking data in sessionStorage
    const bookingData = {
      experienceId: experience._id,
      experienceName: experience.title,
      experienceImage: experience.image,
      experienceLocation: experience.location,
      experienceDuration: experience.duration,
      slotId: selectedSlot._id,
      date: selectedDate,
      timeSlot: selectedSlot.timeSlot,
      quantity,
      price: selectedSlot.price || experience.basePrice,
      subtotal: (selectedSlot.price || experience.basePrice) * quantity,
      category: experience.category,
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/checkout');
  };

  if (loading) {
    return <Loading />;
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience Not Found</h2>
          <p className="text-gray-600 mb-4">The experience you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/experiences')}
            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Browse Experiences
          </button>
        </div>
      </div>
    );
  }

  const subtotal = selectedSlot 
    ? (selectedSlot.price || experience.basePrice) * quantity 
    : 0;

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
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-image.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl z-10"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-24 right-6 flex gap-3 z-10">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg hover:shadow-xl ${
              isFavorited ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-900 hover:bg-white'
            }`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-6 h-6 ${isFavorited ? 'fill-white' : ''}`} />
          </button>
          <button 
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl"
            aria-label="Share"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: experience.title,
                  text: experience.description,
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Title & Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Experience</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{experience.description}</p>
            </motion.div>

            {/* What's Included */}
            {experience.includedItems && experience.includedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-md"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {experience.includedItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Date Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Date</h2>
              {availableDates.length > 0 ? (
                <DateSelector
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No available dates found</p>
                </div>
              )}
            </motion.div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-md"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Available Time Slots for {formatDate(selectedDate)}
                </h2>
                
                {fetchingSlots ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <TimeSlotPicker
                    slots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Info className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-600">No available slots</p>
                    <p className="text-sm text-gray-400 mt-1">Please try another date</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Important Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-100"
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
                maxQuantity={selectedSlot 
                  ? selectedSlot.availableSpots - selectedSlot.bookedSpots 
                  : experience.maxGroupSize
                }
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}