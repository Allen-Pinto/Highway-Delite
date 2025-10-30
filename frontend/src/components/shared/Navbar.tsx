import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <MapPin className="w-8 h-8 text-yellow-400 transform group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xl font-bold text-gray-900">highway</span>
              <span className="text-sm text-gray-600 block -mt-1">delite</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/experiences"
              className="text-gray-700 hover:text-yellow-500 font-medium transition-colors"
            >
              Experiences
            </Link>
            <Link
              to="/experiences"
              className="text-gray-700 hover:text-yellow-500 font-medium transition-colors"
            >
              Destinations
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-yellow-500 font-medium transition-colors"
            >
              About
            </Link>
            <Link to="/experiences">
              <button className="bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-md">
                Book Now
              </button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4">
          <Link
            to="/experiences"
            className="block text-gray-700 hover:text-yellow-500 font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Experiences
          </Link>
          <Link to="/experiences" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-lg font-semibold">
              Book Now
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
