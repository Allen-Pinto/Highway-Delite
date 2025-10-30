import { MapPin, Clock, Users, Star } from 'lucide-react';
import { getCategoryColor } from '../../utils/helpers';

interface ExperienceHeaderProps {
  title: string;
  location: string;
  duration: string;
  maxGroupSize: number;
  category: string;
  rating?: number;
  image: string;
}

export default function ExperienceHeader({
  title,
  location,
  duration,
  maxGroupSize,
  category,
  rating,
  image
}: ExperienceHeaderProps) {
  return (
    <div className="relative h-[60vh] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getCategoryColor(category)}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            {rating && (
              <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <div className="flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Max {maxGroupSize} people</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}