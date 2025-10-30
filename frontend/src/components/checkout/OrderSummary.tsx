import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { PromoCode } from '../../types';

interface OrderSummaryProps {
  experienceData: {
    name: string;
    image: string;
    location: string;
    duration: string;
    date: string;
    timeSlot: string;
    quantity: number;
  };
  pricing: {
    subtotal: number;
    discount: number;
    cgst: number;
    sgst: number;
    total: number;
  };
  appliedPromo: PromoCode | null;
  loading: boolean;
  disabled: boolean;
}

export default function OrderSummary({
  experienceData,
  pricing,
  appliedPromo,
  loading,
  disabled
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Experience Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="flex gap-4">
          <img
            src={experienceData.image}
            alt={experienceData.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2">
              {experienceData.name}
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{experienceData.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{experienceData.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{experienceData.timeSlot}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{experienceData.quantity} person(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(pricing.subtotal)}</span>
        </div>

        {appliedPromo && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount ({appliedPromo.code})</span>
            <span className="text-green-600">-{formatCurrency(pricing.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">CGST (9%)</span>
          <span className="text-gray-900">{formatCurrency(pricing.cgst)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">SGST (9%)</span>
          <span className="text-gray-900">{formatCurrency(pricing.sgst)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center font-bold text-lg">
            <span className="text-gray-900">Total Amount</span>
            <span className="text-yellow-600">{formatCurrency(pricing.total)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-6 bg-gray-50">
        <button
          type="submit"
          disabled={disabled || loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-4 px-6 rounded-xl transition-colors duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Pay ${formatCurrency(pricing.total)}`
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          By completing this booking, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
}