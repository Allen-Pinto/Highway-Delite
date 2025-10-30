import { formatDateShort } from '../../utils/helpers';
import { Calendar } from 'lucide-react';
import clsx from 'clsx';

interface DateSelectorProps {
  availableDates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function DateSelector({
  availableDates,
  selectedDate,
  onDateSelect,
}: DateSelectorProps) {
  if (availableDates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No available dates at the moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {availableDates.slice(0, 15).map((date) => {
        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const isSelected = date === selectedDate;

        return (
          <button
            key={date}
            onClick={() => onDateSelect(date)}
            className={clsx(
              'p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105',
              isSelected
                ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                : 'border-gray-200 hover:border-yellow-300 hover:shadow-md bg-white'
            )}
          >
            <div className={clsx(
              'text-xs font-medium mb-1',
              isSelected ? 'text-yellow-600' : 'text-gray-500'
            )}>
              {dayName}
            </div>
            <div className={clsx(
              'text-lg font-bold',
              isSelected ? 'text-gray-900' : 'text-gray-700'
            )}>
              {formatDateShort(date)}
            </div>
          </button>
        );
      })}
    </div>
  );
}