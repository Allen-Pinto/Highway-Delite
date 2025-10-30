import type { Slot } from '../../types';

interface TimeSlotPickerProps {
  slots: Slot[];
  selectedSlot: Slot | null;
  onSlotSelect: (slot: Slot | null) => void;
}

export default function TimeSlotPicker({ 
  slots, 
  selectedSlot, 
  onSlotSelect 
}: TimeSlotPickerProps) {
  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <button
          key={slot._id}
          onClick={() => onSlotSelect(slot)}
          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
            selectedSlot?._id === slot._id
              ? 'border-yellow-400 bg-yellow-50 shadow-lg'
              : 'border-gray-200 hover:border-yellow-300 hover:shadow-md bg-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">{slot.timeSlot}</span>
            <span className="text-gray-600">
              {slot.availableSpots - slot.bookedSpots} spots left
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            ₹{slot.price} per person
          </div>
        </button>
      ))}
    </div>
  );
}