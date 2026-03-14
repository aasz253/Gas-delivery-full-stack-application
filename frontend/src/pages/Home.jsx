import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag, Star, ShieldCheck, Clock, Zap, ArrowRight, ChevronRight, PhoneCall } from 'lucide-react';

const Home = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/shops');
        setShops(res.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          fetchShops();
        },
        () => fetchShops()
      );
    } else {
      fetchShops();
    }
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xl font-bold text-gray-600 animate-pulse tracking-tight">Finding nearby gas distributors...</p>
    </div>
  );

  return (
    <div className="space-y-24 pb-20 mt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-blue-50 rounded-bl-[10rem] opacity-50"></div>
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 py-12">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-black text-sm uppercase tracking-wider animate-bounce">
              <Zap size={16} /> Fast Delivery in 30 Mins
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
              LPG Gas Delivery <br />
              <span className="text-blue-600">Simplified.</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
              Skip the long queues and heavy lifting. Get your gas cylinders delivered directly to your doorstep with real-time tracking.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#shops" className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center gap-3 transform hover:-translate-y-1 active:translate-y-0">
                Order Now <ArrowRight size={20} />
              </a>
              <Link to="/how-it-works" className="bg-white text-gray-700 border-2 border-gray-100 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-gray-50 transition flex items-center gap-3">
                How it works
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-8 border-t border-gray-100">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-gray-500">
                <span className="text-gray-900">5,000+</span> happy customers <br /> in Nairobi
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img src="/ChatGPT Image Mar 14, 2026, 11_14_52 AM.png" alt="Gas Delivery" className="w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-lg">Express Delivery</span>
                  <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-black uppercase">On Time</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-white/80">
                  <Clock size={16} /> Arriving in 12 minutes
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-20 animate-pulse delay-700"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'Orders Delivered', value: '12K+', icon: ShoppingBag, color: 'blue' },
          { label: 'Active Shops', value: '450+', icon: MapPin, color: 'indigo' },
          { label: 'Reliability', value: '99.9%', icon: ShieldCheck, color: 'green' },
          { label: 'Delivery Time', value: '25m', icon: Clock, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 text-center hover:shadow-xl transition-all duration-300 group">
            <div className={`bg-${stat.color}-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition`}>
              <stat.icon className={`text-${stat.color}-600`} size={24} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{stat.value}</h3>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Distributors Grid */}
      <section id="shops" className="container mx-auto px-6 scroll-mt-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Nearby Distributors</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">We've found the best rated gas shops in your area. Choose one to see their inventory.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition">
              <MapPin size={24} className="text-blue-600" />
            </button>
            <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-blue-200">
              {shops.length} Shops Found <ChevronRight size={20} />
            </div>
          </div>
        </div>
        
        {shops.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-24 text-center shadow-sm border border-gray-50 flex flex-col items-center">
            <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="text-gray-200" size={64} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No shops available yet</h3>
            <p className="text-gray-400 text-xl font-medium max-w-md mx-auto mb-10 leading-relaxed">We're expanding rapidly! Check back soon or join our waitlist to get notified.</p>
            <button className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200">Notify Me</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {shops.map((shop) => (
              <Link 
                key={shop._id} 
                to={`/shop/${shop._id.toString()}`}
                className="group bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col transform hover:-translate-y-3"
              >
                <div className="h-64 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-500"></div>
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black text-blue-600 flex items-center gap-2 shadow-xl">
                    <Star size={16} fill="currentColor" /> 4.9
                  </div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-3xl font-black drop-shadow-lg mb-2">{shop.name}</h3>
                    <p className="text-blue-100 flex items-center gap-2 text-sm font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                      <MapPin size={16} /> {shop.address}
                    </p>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-dot-pattern opacity-10"></div>
                </div>
                <div className="p-10 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-gray-500 font-medium line-clamp-2 mb-8 text-lg leading-relaxed italic">
                      "{shop.description || 'Fast and reliable gas delivery service right to your doorstep.'}"
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-8 border-t border-gray-50 mt-auto">
                    <div className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] ${shop.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {shop.isOpen ? 'Open Now' : 'Closed'}
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 font-black text-lg group-hover:gap-4 transition-all duration-300">
                      View Menu <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6">
        <div className="bg-gray-900 rounded-[4rem] p-16 lg:p-24 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
              Want to grow your <br /> 
              <span className="text-blue-500">Gas Business?</span>
            </h2>
            <p className="text-2xl text-gray-400 font-medium mb-12 leading-relaxed">
              Join Kenya's fastest growing LPG network and reach thousands of customers in your area.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/register" className="bg-white text-gray-900 px-12 py-6 rounded-[2.5rem] font-black text-xl hover:bg-gray-100 transition shadow-2xl flex items-center gap-4 transform hover:-translate-y-1 active:translate-y-0">
                Register as Distributor <ArrowRight size={24} />
              </Link>
              <Link to="/support" className="flex items-center gap-4 text-white font-black text-xl hover:text-blue-400 transition">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                  <PhoneCall size={24} />
                </div>
                Contact Support
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 right-24 transform -translate-y-1/2 hidden lg:block opacity-30">
            <ShoppingBag size={300} className="text-blue-600 rotate-12" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
