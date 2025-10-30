import { Tag, X, CheckCircle } from 'lucide-react';
import type { PromoCode } from '../../types';

interface PromoCodeInputProps {
  promoCode: string;
  appliedPromo: PromoCode | null;
  loading: boolean;
  onPromoCodeChange: (code: string) => void;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export default function PromoCodeInput({
  promoCode,
  appliedPromo,
  loading,
  onPromoCodeChange,
  onApply,
  onRemove
}: PromoCodeInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(promoCode);
  };

  return (
    <div className="space-y-4">
      {appliedPromo ? (
        /* Applied Promo Code */
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">{appliedPromo.code}</p>
              <p className="text-sm text-green-600">
                ₹{appliedPromo.discountAmount} discount applied
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 hover:bg-green-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      ) : (
        /* Promo Code Input */
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e.target.value)}
              placeholder="Enter promo code"
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !promoCode.trim()}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </form>
      )}
      
      <p className="text-sm text-gray-500">
        Have a promo code? Enter it above to get discounts on your booking.
      </p>
    </div>
  );
}