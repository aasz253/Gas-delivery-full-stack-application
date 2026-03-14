import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <span className={`text-2xl font-black tracking-tighter ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>
            GasLink
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`font-bold transition hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}>
            Home
          </Link>
          
          {user ? (
            <>
              {user.role === 'distributor' && (
                <Link to="/dashboard" className={`font-bold transition hover:text-blue-600 ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600'}`}>
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className={`font-bold transition hover:text-blue-600 ${location.pathname === '/admin' ? 'text-blue-600' : 'text-gray-600'}`}>
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center gap-6 border-l border-gray-200 pl-8">
                <span className="flex items-center gap-2 font-bold text-gray-900">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <User size={18} className="text-blue-600" />
                  </div>
                  {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition shadow-sm"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-600 font-bold hover:text-blue-600 transition px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 py-6' : 'max-h-0'}`}>
        <div className="container mx-auto px-6 flex flex-col gap-6 font-bold text-lg">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600">Home</Link>
          {user ? (
            <>
              {user.role === 'distributor' && (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600">Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600">Admin Panel</Link>
              )}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                <span className="text-gray-900 flex items-center gap-2">
                  <User size={20} className="text-blue-600" /> {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-4 text-gray-600">Login</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white py-4 rounded-2xl text-center shadow-lg shadow-blue-200">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
