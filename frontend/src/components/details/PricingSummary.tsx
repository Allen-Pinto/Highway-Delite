import type { Slot } from '../../types';

interface PricingSummaryProps {
  basePrice: number;
  selectedSlot: Slot | null;
  quantity: number;
  subtotal: number;
  onQuantityChange: (quantity: number) => void;
  onProceedToCheckout: () => void;
  maxQuantity: number;
}

export default function PricingSummary({
  basePrice,
  selectedSlot,
  quantity,
  subtotal,
  onQuantityChange,
  onProceedToCheckout,
  maxQuantity
}: PricingSummaryProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Price per person</span>
          <span className="font-semibold">₹{selectedSlot?.price || basePrice}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              -
            </button>
            <span className="font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
        </div>
        
        <button
          onClick={onProceedToCheckout}
          disabled={!selectedSlot}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          {selectedSlot ? 'Proceed to Checkout' : 'Select Time Slot'}
        </button>
      </div>
    </div>
  );
}