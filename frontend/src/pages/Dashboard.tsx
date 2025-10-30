// pages/Dashboard.tsx - SMOOTH VERSION
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Users, Star, Heart, TrendingUp, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import Loading from '../components/shared/Loading';
import { experienceApi } from '../services/api';
import type { Experience } from '../types';
import { formatCurrency, getCategoryColor, debounce } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    { id: 'all', label: 'All Experiences', icon: '🎯' },
    { id: 'adventure', label: 'Adventure', icon: '⛰️' },
    { id: 'trekking', label: 'Trekking', icon: '🥾' },
    { id: 'beach', label: 'Beach', icon: '🏖️' },
    { id: 'cruise', label: 'Cruise', icon: '⛴️' },
    { id: 'trail', label: 'Trail', icon: '🚶' },
  ];

  // Load all experiences once on component mount
  useEffect(() => {
    fetchAllExperiences();
  }, []);

  // Update URL params without triggering re-fetch
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (selectedCategory !== 'all') newParams.set('category', selectedCategory);
    setSearchParams(newParams);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const fetchAllExperiences = async () => {
    try {
      setLoading(true);
      const response = await experienceApi.getAll();
      setAllExperiences(response.data);
      setExperiences(response.data);
      console.log(`✅ Loaded ${response.data.length} experiences`);
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      toast.error(error.response?.data?.message || 'Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering - instant and smooth
  const filteredExperiences = useMemo(() => {
    if (!allExperiences.length) return [];

    let filtered = allExperiences;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(query) ||
        exp.location.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allExperiences, selectedCategory, searchQuery]);

  // Debounced search for API call only when needed
  const performSearch = debounce(async (query: string) => {
    if (query.length > 2) {
      // Only call API for longer searches
      setIsSearching(true);
      try {
        const response = await experienceApi.getAll({ search: query });
        setExperiences(response.data);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to client-side filtering
        setExperiences(filteredExperiences);
      } finally {
        setIsSearching(false);
      }
    } else {
      // Use client-side filtering for short queries
      setExperiences(filteredExperiences);
    }
  }, 300);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // No API call needed - client-side filtering handles this instantly
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(id);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setExperiences(allExperiences);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-600">
              {isSearching ? 'Searching...' : `${experiences.length} experiences available`}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Experiences
          </h1>
          <p className="text-xl text-gray-600">
            Find your perfect adventure across India's most beautiful destinations
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search experiences, locations..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all duration-300 text-lg shadow-sm hover:shadow-md"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filters */}
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
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Experience Grid */}
        <AnimatePresence mode="wait">
          {experiences.length > 0 ? (
            <motion.div
              key="experiences-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/experiences/${exp._id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                      {formatCurrency(exp.basePrice)}
                    </div>

                    {/* Category Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-lg backdrop-blur-sm ${getCategoryColor(exp.category)}`}>
                      {exp.category}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(exp._id, e)}
                      className="absolute top-16 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(exp._id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-700'
                        }`}
                      />
                    </button>

                    {/* Rating */}
                    {exp.rating && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-sm text-gray-900">
                          {exp.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                      {exp.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span className="line-clamp-1">{exp.location}</span>
                    </p>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exp.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Max {exp.maxGroupSize}
                      </span>
                    </div>

                    <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isSearching ? 'Searching...' : 'No experiences found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {isSearching 
                  ? 'Looking for the best experiences...' 
                  : 'Try adjusting your search or filters to find what you\'re looking for'
                }
              </p>
              {!isSearching && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Clear Filters & Reload
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}