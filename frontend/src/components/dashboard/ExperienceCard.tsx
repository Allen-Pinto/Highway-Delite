import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users } from 'lucide-react';

interface ExperienceCardProps {
  experience: {
    _id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    basePrice: number;
    image: string;
    duration: string;
    maxGroupSize: number;
  };
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
      onClick={() => navigate(`/experiences/${experience._id}`)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
          ₹{experience.basePrice}
        </div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize">
          {experience.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{experience.title}</h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {experience.location}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{experience.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {experience.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Max {experience.maxGroupSize}
          </span>
        </div>

        <button className="w-full mt-4 bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ExperienceCard;
