import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface FilterSectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showFilters: boolean;
}

const categories = [
  { id: 'all', label: 'All Experiences', icon: '🎯' },
  { id: 'adventure', label: 'Adventure', icon: '⛰️' },
  { id: 'trekking', label: 'Trekking', icon: '🥾' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'cruise', label: 'Cruise', icon: '⛴️' },
  { id: 'trail', label: 'Trail', icon: '🚶' },
];

export default function FilterSection({ 
  selectedCategory, 
  onCategoryChange, 
  showFilters 
}: FilterSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: showFilters ? 1 : 0, 
        height: showFilters ? 'auto' : 0 
      }}
      className={`overflow-hidden ${showFilters ? 'block' : 'hidden lg:block'}`}
    >
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 hover:border-yellow-300'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.label}</span>
            {selectedCategory === cat.id && (
              <X className="w-4 h-4 ml-1" />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}