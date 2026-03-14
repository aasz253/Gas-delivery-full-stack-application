import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Store, Plus, Package, MapPin, CheckCircle, Clock, Loader2, BarChart3, Settings, ExternalLink, Phone, Info, LayoutDashboard, ShoppingCart, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const DistributorDashboard = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cylinders, setCylinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCylinder, setNewCylinder] = useState({ brand: '', size: 6, price: '', stock: '' });
  const [shopForm, setShopForm] = useState({ 
    name: '', 
    address: '', 
    description: '', 
    whatsappNumber: '', 
    contactNumber: '',
    coordinates: [36.817223, -1.286389],
    photos: [],
    videos: []
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [shopRes, orderRes, cylRes] = await Promise.all([
          axios.get('http://localhost:3000/api/shops/my-shop', config),
          axios.get('http://localhost:3000/api/orders/my-shop', config),
          axios.get('http://localhost:3000/api/shops/cylinders', config),
        ]);
        
        // Check for new orders
        if (orders.length > 0 && orderRes.data.length > orders.length) {
          const newOrder = orderRes.data[0];
          new Notification('New Order Received!', {
            body: `Order from ${newOrder.customer.name} for ${newOrder.totalPrice} KES`,
            icon: '/favicon.svg'
          });
          // Play a sound if possible
          try { new Audio('/notification.mp3').play(); } catch (e) {}
        }
        
        setShop(shopRes.data);
        if (shopRes.data) {
          setShopForm({
            name: shopRes.data.name,
            address: shopRes.data.address,
            description: shopRes.data.description,
            whatsappNumber: shopRes.data.whatsappNumber || '',
            contactNumber: shopRes.data.contactNumber || '',
            coordinates: shopRes.data.location.coordinates,
            photos: shopRes.data.photos || [],
            videos: shopRes.data.videos || []
          });
        }
        setOrders(orderRes.data);
        setCylinders(cylRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    
    // Request notification permissions
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => clearInterval(interval);
  }, [user.token, orders.length]);

  const handleMediaUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file); // Backend uses 'image' field for uploads

      try {
        const res = await axios.post('http://localhost:3000/api/upload', formData, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        uploadedUrls.push(res.data.url);
      } catch (err) {
        console.error('Upload Error:', err.response?.data || err.message);
        alert(`Failed to upload ${file.name}: ${err.response?.data?.message || err.message}`);
      }
    }

    if (type === 'photo') {
      setShopForm(prev => ({ ...prev, photos: [...prev.photos, ...uploadedUrls] }));
    } else {
      setShopForm(prev => ({ ...prev, videos: [...prev.videos, ...uploadedUrls] }));
    }
    setUploading(false);
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3000/api/shops/my-shop', shopForm, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setShop(res.data);
      // Clear newly uploaded photos/videos from form after success
      setShopForm(prev => ({ ...prev, photos: [], videos: [] }));
      setShowSettings(false);
      alert('Shop details updated successfully! New media will expire in 7 days.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update shop');
    }
  };

  const handleCreateShop = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/shops', shopForm, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setShop(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create shop');
    }
  };

  const handleAddCylinder = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/shops/cylinders', newCylinder, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCylinders([...cylinders, res.data]);
      setNewCylinder({ brand: '', size: 6, price: '', stock: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add cylinder');
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xl font-bold text-gray-600 animate-pulse tracking-tight">Syncing your dashboard...</p>
    </div>
  );

  if (!shop) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6">
        <div className="bg-white rounded-[4rem] shadow-2xl p-12 lg:p-20 border border-gray-100 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-blue-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-200 animate-float">
              <Store className="text-white" size={48} />
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Ready to Launch?</h1>
            <p className="text-gray-400 text-xl mb-12 max-w-sm mx-auto font-medium leading-relaxed">Fill in your distribution center details to start receiving orders instantly.</p>
            
            <form onSubmit={handleCreateShop} className="space-y-8 text-left max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Shop Name</label>
                  <input 
                    type="text" 
                    className="w-full p-6 bg-gray-50 border-4 border-gray-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold text-lg" 
                    placeholder="e.g. Nairobi Gas Hub"
                    value={shopForm.name}
                    onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                  <input 
                    type="text" 
                    className="w-full p-6 bg-gray-50 border-4 border-gray-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold text-lg" 
                    placeholder="e.g. Ngong Road, Nairobi"
                    value={shopForm.address}
                    onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                  <input 
                    type="text" 
                    className="w-full p-6 bg-gray-50 border-4 border-gray-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold text-lg" 
                    placeholder="e.g. 254700000000"
                    value={shopForm.whatsappNumber}
                    onChange={(e) => setShopForm({ ...shopForm, whatsappNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <input 
                    type="text" 
                    className="w-full p-6 bg-gray-50 border-4 border-gray-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold text-lg" 
                    placeholder="e.g. 0712345678"
                    value={shopForm.contactNumber}
                    onChange={(e) => setShopForm({ ...shopForm, contactNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Shop Description</label>
                <textarea 
                  className="w-full p-6 bg-gray-50 border-4 border-gray-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold text-lg" 
                  placeholder="Tell customers about your services..."
                  value={shopForm.description}
                  onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Shop Photos</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleMediaUpload(e, 'photo')} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="cursor-pointer flex items-center justify-center gap-2 p-6 bg-blue-50 text-blue-600 border-2 border-dashed border-blue-200 rounded-3xl font-black hover:bg-blue-100 transition">
                    <Plus size={20} /> Add Photos
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {shopForm.photos.map((url, i) => (
                      <img key={i} src={url} className="w-16 h-16 rounded-xl object-cover" alt="" />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Shop Videos</label>
                  <input type="file" multiple accept="video/*" onChange={(e) => handleMediaUpload(e, 'video')} className="hidden" id="video-upload" />
                  <label htmlFor="video-upload" className="cursor-pointer flex items-center justify-center gap-2 p-6 bg-indigo-50 text-indigo-600 border-2 border-dashed border-indigo-200 rounded-3xl font-black hover:bg-indigo-100 transition">
                    <Plus size={20} /> Add Videos
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {shopForm.videos.map((url, i) => (
                      <div key={i} className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-[10px] font-black">VIDEO</div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 transform hover:-translate-y-2 active:translate-y-0">
                {uploading ? <Loader2 className="animate-spin" /> : <>Create My Shop <CheckCircle size={28} /></>}
              </button>
            </form>
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-dot-pattern opacity-[0.05] pointer-events-none"></div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: `KES ${orders.filter(o => o.orderStatus === 'completed').reduce((acc, o) => acc + o.totalPrice, 0)}`, icon: TrendingUp, color: 'green' },
    { label: 'Active Orders', value: orders.filter(o => o.orderStatus !== 'completed').length, icon: ShoppingCart, color: 'blue' },
    { label: 'Customers', value: [...new Set(orders.map(o => o.customer._id))].length, icon: Users, color: 'indigo' },
    { label: 'Stock Levels', value: cylinders.reduce((acc, c) => acc + c.stock, 0), icon: Package, color: 'orange' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 mt-20 px-6">
      {/* Header */}
      <header className="bg-gray-900 rounded-[3rem] p-10 lg:p-16 shadow-2xl overflow-hidden relative text-white">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="bg-blue-600 w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-white/10">
              <Store size={48} />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">{shop.name}</h1>
                <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/30">Live</span>
              </div>
              <p className="text-gray-400 flex items-center gap-2 text-lg font-medium">
                <MapPin size={20} className="text-blue-500" /> {shop.address}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black hover:bg-white/20 transition border border-white/10 flex items-center gap-3"
            >
              <Settings size={20} /> Shop Settings
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20 flex items-center gap-3"
            >
              <Plus size={20} /> New Cylinder
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-dot-pattern opacity-[0.05] pointer-events-none"></div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 lg:p-16 relative shadow-2xl">
            <button onClick={() => setShowSettings(false)} className="absolute top-10 right-10 text-gray-400 hover:text-gray-900 transition">
              <Plus className="rotate-45" size={40} />
            </button>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-10 flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                <Settings className="text-white" size={32} />
              </div>
              Shop Settings
            </h2>
            <form onSubmit={handleUpdateShop} className="space-y-8 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Shop Name</label>
                  <input 
                    type="text" 
                    className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold" 
                    value={shopForm.name}
                    onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                  <input 
                    type="text" 
                    className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold" 
                    value={shopForm.address}
                    onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                  <input 
                    type="text" 
                    className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold" 
                    value={shopForm.whatsappNumber}
                    onChange={(e) => setShopForm({ ...shopForm, whatsappNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <input 
                    type="text" 
                    className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold" 
                    value={shopForm.contactNumber}
                    onChange={(e) => setShopForm({ ...shopForm, contactNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Shop Description</label>
                <textarea 
                  className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold" 
                  value={shopForm.description}
                  onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                />
              </div>

              {shop.posts?.length > 0 && (
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Media Gallery (Expiring)</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {shop.posts?.map((post, i) => (
                      post.type === 'photo' ? (
                        <img key={i} src={post.url} className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100" alt="" />
                      ) : (
                        <div key={i} className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center text-[8px] font-black text-indigo-400 border-2 border-indigo-100">VIDEO</div>
                      )
                    ))}
                  </div>
                </div>
              )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Post New Photos (Lasts 7 Days)</label>
                    <input type="file" multiple accept="image/*" onChange={(e) => handleMediaUpload(e, 'photo')} className="hidden" id="photo-upload-settings" />
                    <label htmlFor="photo-upload-settings" className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-600 border-2 border-dashed border-blue-200 rounded-2xl font-black hover:bg-blue-100 transition">
                      <Plus size={20} /> Add Photos
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {shopForm.photos.map((url, i) => (
                        <div key={i} className="relative group/photo shrink-0">
                          <img src={url} className="w-16 h-16 rounded-xl object-cover" alt="" />
                          <button 
                            type="button"
                            onClick={() => setShopForm(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/photo:opacity-100 transition"
                          >
                            <Plus className="rotate-45" size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Post New Videos (Lasts 7 Days)</label>
                    <input type="file" multiple accept="video/*" onChange={(e) => handleMediaUpload(e, 'video')} className="hidden" id="video-upload-settings" />
                    <label htmlFor="video-upload-settings" className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-indigo-50 text-indigo-600 border-2 border-dashed border-indigo-200 rounded-2xl font-black hover:bg-indigo-100 transition">
                      <Plus size={20} /> Add Videos
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {shopForm.videos.map((url, i) => (
                        <div key={i} className="relative group/video shrink-0">
                          <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-[8px] font-black">VIDEO</div>
                          <button 
                            type="button"
                            onClick={() => setShopForm(prev => ({ ...prev, videos: prev.videos.filter((_, idx) => idx !== i) }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/video:opacity-100 transition"
                          >
                            <Plus className="rotate-45" size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              <button className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 transform hover:-translate-y-2 active:translate-y-0">
                {uploading ? <Loader2 className="animate-spin" /> : <>Save Changes <CheckCircle size={28} /></>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`bg-${stat.color}-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition`}>
                <stat.icon className={`text-${stat.color}-600`} size={28} />
              </div>
              <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <div>
              <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-4">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: 'Manage Orders', icon: Package },
            { id: 'inventory', label: 'Inventory', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-8 py-6 rounded-[2rem] font-black text-lg transition-all transform hover:scale-102 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-white text-gray-400 hover:text-gray-600 hover:shadow-lg border border-gray-50'}`}
            >
              <tab.icon size={24} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {activeTab === 'overview' || activeTab === 'orders' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                  {activeTab === 'overview' ? 'Recent Activity' : 'All Orders'}
                </h2>
                <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm font-black text-sm text-gray-500 uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                  Real-time Updates
                </div>
              </div>
              
              {orders.length === 0 ? (
                <div className="bg-white rounded-[4rem] p-24 text-center shadow-sm border border-gray-50 flex flex-col items-center">
                  <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mb-8">
                    <Package className="text-gray-200" size={64} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No orders yet</h3>
                  <p className="text-gray-400 text-xl font-medium max-w-md mx-auto leading-relaxed">Your business is ready! Share your shop link with customers to start receiving orders.</p>
                </div>
              ) : (
                <div className="grid gap-10">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 overflow-hidden group">
                      <div className="p-10 lg:p-12 flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-2/5">
                          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-full min-h-[300px]">
                            <img src={order.deliveryLocation.buildingPhoto} alt="Building" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8 space-y-4">
                              <a 
                                href={`https://www.google.com/maps?q=${order.deliveryLocation.coordinates[1]},${order.deliveryLocation.coordinates[0]}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-2xl"
                              >
                                <ExternalLink size={18} /> View Location
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="lg:w-3/5 flex flex-col justify-between space-y-8">
                          <div>
                            <div className="flex justify-between items-start mb-8">
                              <div>
                                <div className="flex items-center gap-3 mb-4">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${order.orderStatus === 'pending' ? 'bg-orange-100 text-orange-600' : order.orderStatus === 'delivering' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {order.orderStatus}
                                  </span>
                                  <span className="text-gray-300 font-bold">•</span>
                                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">{order.customer.name}</h3>
                                <div className="flex items-center gap-4 text-gray-500 font-bold">
                                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                    <Phone size={14} className="text-blue-500" /> {order.customer.phone}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Payout</p>
                                <p className="text-4xl font-black text-blue-600 tracking-tighter">KES {order.totalPrice}</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 space-y-4">
                              <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Info size={14} className="text-blue-500" /> Delivery Notes
                              </div>
                              <p className="text-gray-700 font-bold text-lg leading-relaxed italic">"{order.deliveryLocation.description}"</p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            {order.orderStatus === 'pending' && (
                              <button 
                                onClick={() => updateStatus(order._id, 'delivering')}
                                className="flex-grow bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 transform hover:-translate-y-1 active:translate-y-0"
                              >
                                Accept & Dispatch <ArrowUpRight size={24} />
                              </button>
                            )}
                            {order.orderStatus === 'delivering' && (
                              <button 
                                onClick={() => updateStatus(order._id, 'completed')}
                                className="flex-grow bg-green-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-green-700 transition shadow-2xl shadow-green-200 flex items-center justify-center gap-4 transform hover:-translate-y-1 active:translate-y-0"
                              >
                                Confirm Delivery <CheckCircle size={24} />
                              </button>
                            )}
                            {order.orderStatus === 'completed' && (
                              <div className="w-full bg-green-50 text-green-600 py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 border-2 border-green-100">
                                <CheckCircle size={24} /> Order Completed
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Add Cylinder Form */}
              <div className="bg-white rounded-[4rem] shadow-sm p-12 border border-gray-50 relative overflow-hidden">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-10 flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                    <Plus className="text-white" size={32} />
                  </div>
                  Add Inventory
                </h2>
                <form onSubmit={handleAddCylinder} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Brand Name</label>
                    <input 
                      type="text" 
                      className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold" 
                      placeholder="e.g. K-Gas"
                      value={newCylinder.brand}
                      onChange={(e) => setNewCylinder({ ...newCylinder, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Size (kg)</label>
                    <select 
                      className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold appearance-none"
                      value={newCylinder.size}
                      onChange={(e) => setNewCylinder({ ...newCylinder, size: parseInt(e.target.value) })}
                    >
                      {[6, 13, 22, 35, 45, 50].map(s => <option key={s} value={s}>{s}kg</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Price (KES)</label>
                    <input 
                      type="number" 
                      className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold" 
                      placeholder="0.00"
                      value={newCylinder.price}
                      onChange={(e) => setNewCylinder({ ...newCylinder, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Stock Count</label>
                    <input 
                      type="number" 
                      className="w-full p-5 bg-gray-50 border-4 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 focus:bg-white transition-all font-bold" 
                      placeholder="Available Units"
                      value={newCylinder.stock}
                      onChange={(e) => setNewCylinder({ ...newCylinder, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95">
                      <Plus size={24} /> Save Cylinder
                    </button>
                  </div>
                </form>
              </div>

              {/* Inventory List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cylinders.map((cyl) => (
                  <div key={cyl._id} className="bg-white rounded-[3rem] shadow-sm p-10 border border-gray-50 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition tracking-tighter">{cyl.brand}</h3>
                        <p className="text-gray-400 font-bold text-lg">{cyl.size}kg Cylinder</p>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-5 py-3 rounded-2xl font-black text-2xl shadow-inner border border-blue-100">
                        KES {cyl.price}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-gray-50 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${cyl.stock > 10 ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`}></div>
                        <span className="font-black text-gray-600 text-lg">{cyl.stock} <span className="text-sm text-gray-400 uppercase tracking-widest">Units Left</span></span>
                      </div>
                      <button className="text-red-400 font-black text-xs hover:text-red-600 transition tracking-[0.2em] uppercase">Remove</button>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-dot-pattern opacity-[0.02] pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;
