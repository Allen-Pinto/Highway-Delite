import { MapPin } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="text-center">
        <div className="relative inline-block">
          <MapPin className="w-16 h-16 text-yellow-400 animate-bounce" />
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 animate-pulse" />
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
          Loading amazing experiences...
        </p>
      </div>
    </div>
  );
}