import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, ShoppingCart, Camera, Send, Loader2, Map as MapIcon, ChevronRight, Info, CheckCircle2, AlertCircle, MessageCircle, Phone as PhoneIcon, ArrowLeft, ShoppingBag } from 'lucide-react';

const containerStyle = { width: '100%', height: '450px' };

const ShopDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [cylinders, setCylinders] = useState([]);
  const [selectedCylinder, setSelectedCylinder] = useState(null);
  const [location, setLocation] = useState({ lat: -1.286389, lng: 36.817223 });
  const [area, setArea] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [directions, setDirections] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [uploading, setUploading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching shop details for ID:', id);
        const [shopRes, cylRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/shops/${id}`, { timeout: 10000 }),
          axios.get(`http://localhost:3000/api/shops/${id}/cylinders`, { timeout: 10000 }),
        ]);
        
        console.log('Shop response:', shopRes.data);
        console.log('Cylinders response:', cylRes.data);
        
        if (!shopRes.data || Object.keys(shopRes.data).length === 0) {
          console.warn('Shop data is empty');
          setShop(null);
        } else {
          setShop(shopRes.data);
        }
        
        setCylinders(Array.isArray(cylRes.data) ? cylRes.data : []);
      } catch (err) {
        console.error('Error fetching shop data:', err.response?.data || err.message);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    } else {
      setLoading(false);
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, [id]);

  const onMapClick = useCallback((e) => {
    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setImage(res.data.url);
    } catch (err) {
      console.error('Upload Error:', err.response?.data || err.message);
      alert(`Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleOrder = async () => {
    if (!user) return navigate('/login');
    if (!selectedCylinder || !image || !area || !house || !phoneNumber) {
      alert('Please complete all steps to proceed with the order.');
      return;
    }

    setOrderLoading(true);
    try {
      const description = `Area: ${area}, House: ${house}, Apartment/Floor: ${apartment || 'N/A'}, Directions: ${directions || 'N/A'}`;
      
      const orderData = {
        shopId: id,
        items: [{ cylinder: selectedCylinder._id, quantity: 1, price: selectedCylinder.price }],
        deliveryLocation: {
          coordinates: [location.lng, location.lat],
          description,
          buildingPhoto: image,
        },
        phoneNumber,
      };

      await axios.post('http://localhost:3000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/order-success');
    } catch (err) {
      alert(err.response?.data?.message || 'Payment initiation failed. Check your network.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xl font-bold text-gray-600 animate-pulse tracking-tight">Fetching inventory...</p>
    </div>
  );

  if (!shop) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
      <div className="bg-red-50 p-10 rounded-full border-8 border-white shadow-xl shadow-red-100 animate-bounce">
        <AlertCircle size={80} className="text-red-500" />
      </div>
      <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Shop Not Found</h2>
      <p className="text-gray-500 max-w-lg font-medium text-lg leading-relaxed">
        The distributor you're looking for doesn't exist or is currently offline. <br /> 
        <span className="text-gray-400 text-sm">Target ID: {id}</span>
      </p>
      <button 
        onClick={() => navigate('/')} 
        className="bg-gray-900 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-black transition shadow-2xl flex items-center gap-4 transform hover:-translate-y-2"
      >
        <ArrowLeft size={24} /> Back to Distributors
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 mt-20 px-6">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Shop and Selection */}
        <div className="lg:w-5/12 space-y-10">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform">
                <ShoppingBag className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">{shop.name}</h1>
              <div className="flex items-center gap-2 text-blue-600 font-bold mb-6 bg-blue-50 w-fit px-4 py-1.5 rounded-xl">
                <MapPin size={18} /> {shop.address}
              </div>
              <p className="text-gray-500 text-lg leading-relaxed font-medium italic mb-8">"{shop.description}"</p>
              
              <div className="flex gap-4 mb-8">
                {shop.whatsappNumber && (
                  <a 
                    href={`https://wa.me/${shop.whatsappNumber}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 bg-green-500 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-green-600 transition shadow-lg shadow-green-100"
                  >
                    <MessageCircle size={24} /> WhatsApp
                  </a>
                )}
                {shop.contactNumber && (
                  <a 
                    href={`tel:${shop.contactNumber}`} 
                    className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition shadow-lg shadow-gray-200"
                  >
                    <PhoneIcon size={24} /> Call
                  </a>
                )}
              </div>

              {/* Shop Media */}
              {shop.posts?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Shop Gallery (Expires in 7 days)</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {shop.posts?.map((post, i) => (
                      post.type === 'photo' ? (
                        <img key={i} src={post.url} className="w-40 h-40 rounded-[2rem] object-cover border-4 border-gray-50 shadow-sm" alt="Shop" />
                      ) : (
                        <div key={i} className="w-40 h-40 rounded-[2rem] bg-indigo-100 flex items-center justify-center text-indigo-600 font-black relative overflow-hidden">
                          <video src={post.url} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                          <span className="relative z-10 text-xs uppercase tracking-widest">Video</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
          </div>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                Select Cylinder
              </h2>
              <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{cylinders.length} Options</span>
            </div>
            {!Array.isArray(cylinders) || cylinders.length === 0 ? (
              <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                <ShoppingCart className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 font-bold">No gas cylinders posted yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {cylinders.map((cyl) => (
                  <div 
                    key={cyl._id} 
                    onClick={() => setSelectedCylinder(cyl)}
                    className={`cursor-pointer group p-8 rounded-[2.5rem] border-4 transition-all duration-500 flex items-center justify-between ${selectedCylinder?._id === cyl._id ? 'border-blue-600 bg-blue-50/50 shadow-2xl shadow-blue-100 translate-x-4' : 'border-gray-50 bg-white hover:border-blue-100 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black text-2xl transition-all ${selectedCylinder?._id === cyl._id ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-400'}`}>
                        {cyl.size}kg
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition tracking-tight">{cyl.brand}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${cyl.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">{cyl.stock > 0 ? `${cyl.stock} in stock` : 'Out of stock'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Price</p>
                      <p className={`text-3xl font-black tracking-tighter ${selectedCylinder?._id === cyl._id ? 'text-blue-600' : 'text-gray-900'}`}>
                        KES {cyl.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Side: Delivery Form */}
        <div className="lg:w-7/12 space-y-8">
          <div className="bg-white rounded-[4rem] shadow-2xl p-10 lg:p-16 border border-gray-100 relative overflow-hidden">
            <div className="relative z-10 space-y-12">
              <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                  <MapIcon className="text-blue-600" size={40} /> Checkout Details
                </h2>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Step 2 of 2</span>
                  <div className="flex gap-1 mt-2">
                    <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                    <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                {/* Map Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xl font-black text-gray-900 tracking-tight">Pin Your Location</label>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-lg">
                      <Info size={14} /> Tap to adjust
                    </div>
                  </div>
                  {isLoaded ? (
                    <div className="rounded-[3rem] overflow-hidden border-4 border-gray-50 shadow-inner group">
                      <GoogleMap 
                        mapContainerStyle={containerStyle} 
                        center={location} 
                        zoom={16} 
                        onClick={onMapClick}
                        options={{
                          styles: [
                            {
                              featureType: "all",
                              elementType: "geometry.fill",
                              stylers: [{ weight: "2.00" }]
                            }
                          ],
                          disableDefaultUI: true,
                          zoomControl: true,
                        }}
                      >
                        <Marker position={location} />
                      </GoogleMap>
                    </div>
                  ) : <div className="h-[450px] bg-gray-50 animate-pulse rounded-[3rem] flex items-center justify-center text-gray-400 font-bold">Loading Map Engine...</div>}
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                      Building Photo {image && <CheckCircle2 className="text-green-500" size={20} />}
                    </label>
                    <label className={`flex flex-col items-center justify-center h-64 border-4 border-dashed rounded-[3rem] cursor-pointer transition-all duration-500 relative overflow-hidden group ${image ? 'border-green-200 bg-green-50/30' : 'border-gray-100 hover:border-blue-400 hover:bg-blue-50/50'}`}>
                      {uploading ? (
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="animate-spin text-blue-600" size={48} />
                          <span className="font-black text-blue-600 uppercase tracking-widest text-xs">Uploading...</span>
                        </div>
                      ) : image ? (
                        <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Building" />
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-gray-300 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                          <div className="bg-gray-50 p-6 rounded-full group-hover:bg-white group-hover:shadow-xl transition-all">
                            <Camera size={48} />
                          </div>
                          <div className="text-center">
                            <span className="block font-black text-lg">Upload Photo</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Helps rider find you</span>
                          </div>
                        </div>
                      )}
                      <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>

                  <div className="space-y-6">
                    <label className="text-xl font-black text-gray-900 tracking-tight">Delivery Address & Directions</label>
                    <div className="grid grid-cols-1 gap-4">
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition font-bold text-lg placeholder:text-gray-300"
                        placeholder="Area/Neighborhood Name"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required
                      />
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition font-bold text-lg placeholder:text-gray-300"
                        placeholder="House Name / Building Name"
                        value={house}
                        onChange={(e) => setHouse(e.target.value)}
                        required
                      />
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition font-bold text-lg placeholder:text-gray-300"
                        placeholder="Apartment No. / Floor (Optional)"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                      />
                      <textarea 
                        className="w-full h-32 p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition resize-none font-bold text-lg placeholder:text-gray-300"
                        placeholder="Directions (e.g., opposite the mosque, blue gate...)"
                        value={directions}
                        onChange={(e) => setDirections(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* M-Pesa Input */}
                <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight">M-Pesa Number</h3>
                      <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">For STK Push payment</p>
                    </div>
                    <div className="w-full md:w-1/2 relative">
                      <input 
                        type="text" 
                        className="w-full px-8 py-5 bg-white/10 border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-black text-xl tracking-widest placeholder:text-white/20"
                        placeholder="254700000000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500 rounded-full opacity-10 blur-[80px]"></div>
                </div>

                {/* Final CTA */}
                <div className="pt-10 space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-8 bg-blue-50 rounded-[3rem] border-2 border-blue-100">
                    <div className="text-center sm:text-left">
                      <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-1">STK Push Amount (Delivery Fee Only)</p>
                      <div className="flex items-center gap-3">
                        <span className="text-5xl font-black text-blue-700 tracking-tighter">
                          KES 50
                        </span>
                        <div className="bg-white/50 px-3 py-1 rounded-xl text-[10px] font-black text-blue-600 uppercase">
                          Upfront
                        </div>
                      </div>
                      <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest">
                        Pay Gas Price (KES {selectedCylinder?.price || 0}) physically on delivery
                      </p>
                    </div>
                    <button 
                      onClick={handleOrder}
                      disabled={orderLoading || !selectedCylinder}
                      className="w-full sm:w-auto bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 transform hover:-translate-y-2 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
                    >
                      {orderLoading ? (
                        <Loader2 className="animate-spin" size={32} />
                      ) : (
                        <>
                          Pay Delivery Fee <ChevronRight size={32} />
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                      <ShieldCheck size={14} className="text-green-500" /> Secure Daraja API
                    </div>
                    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                      <AlertCircle size={14} className="text-blue-500" /> Instant Refund Policy
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-full h-full bg-dot-pattern opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default ShopDetails;
