import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Store, ShoppingBag, TrendingUp, 
  Search, ShieldCheck, AlertCircle, CheckCircle, 
  Clock, ArrowUpRight, BarChart3, LayoutDashboard,
  Filter, Download, MoreVertical, Mail, Phone, Camera, MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [statsRes, usersRes, shopsRes, ordersRes, postsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/stats', config),
          axios.get('http://localhost:3000/api/admin/users', config),
          axios.get('http://localhost:3000/api/admin/shops', config),
          axios.get('http://localhost:3000/api/admin/orders', config),
          axios.get('http://localhost:3000/api/admin/posts', config)
        ]);
        
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setShops(shopsRes.data);
        setOrders(ordersRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Admin Data Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user.token]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xl font-bold text-gray-600 animate-pulse tracking-tight">Loading Administrative Console...</p>
    </div>
  );

  const summaryStats = [
    { label: 'Total Revenue', value: `KES ${stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'green', trend: '+12.5%' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'blue', trend: '+8.2%' },
    { label: 'Active Shops', value: stats?.totalShops || 0, icon: Store, color: 'indigo', trend: '+3 new' },
    { label: 'Live Media', value: stats?.totalMedia || 0, icon: Camera, color: 'orange', trend: '7-day TTL' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 mt-20 px-6">
      {/* Admin Header */}
      <header className="bg-gray-900 rounded-[3rem] p-10 lg:p-16 shadow-2xl overflow-hidden relative text-white">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="bg-blue-600 w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-white/10">
              <ShieldCheck size={48} />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Admin Console</h1>
                <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/30">System Admin</span>
              </div>
              <p className="text-gray-400 flex items-center gap-2 text-lg font-medium">
                <LayoutDashboard size={20} className="text-blue-500" /> System-wide Activity Overview
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black hover:bg-white/20 transition border border-white/10 flex items-center gap-3">
              <Download size={20} /> Export Report
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-dot-pattern opacity-[0.05] pointer-events-none"></div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {summaryStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`bg-${stat.color}-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition`}>
                <stat.icon className={`text-${stat.color}-600`} size={28} />
              </div>
              <div className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1">
                <ArrowUpRight size={12} /> {stat.trend}
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
        {/* Admin Navigation */}
        <div className="lg:col-span-3 space-y-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'shops', label: 'Gas Shops', icon: Store },
            { id: 'orders', label: 'All Orders', icon: ShoppingBag },
            { id: 'media', label: 'Media Feed', icon: Camera },
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

        {/* Admin Main Content */}
        <div className="lg:col-span-9 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter capitalize">{activeTab} List</h2>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-16 pr-6 py-4 bg-white border-4 border-gray-50 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/20 transition-all font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-50 overflow-hidden">
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">User</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Contact</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Role</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                      <tr key={u._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                              {u.name.charAt(0)}
                            </div>
                            <span className="font-black text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-sm font-bold text-gray-500"><Mail size={14} /> {u.email}</p>
                            <p className="flex items-center gap-2 text-sm font-bold text-gray-500"><Phone size={14} /> {u.phone}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : u.role === 'distributor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <button className="text-gray-400 hover:text-gray-600 transition p-2 bg-gray-50 rounded-xl"><MoreVertical size={20} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shops' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Shop Name</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Owner</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Location</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {shops.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                      <tr key={s._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                              <Store size={24} />
                            </div>
                            <span className="font-black text-gray-900">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-sm font-bold text-gray-500">
                          {s.owner?.name}
                        </td>
                        <td className="px-10 py-6">
                          <p className="flex items-center gap-2 text-sm font-bold text-gray-500 max-w-xs truncate"><MapPin size={14} className="text-blue-500" /> {s.address}</p>
                        </td>
                        <td className="px-10 py-6">
                          <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {(activeTab === 'overview' || activeTab === 'orders') && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Customer</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Shop</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                      <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.filter(o => o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(o => (
                      <tr key={o._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-10 py-6">
                          <p className="font-black text-gray-900">{o.customer?.name}</p>
                          <p className="text-xs font-bold text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-10 py-6 font-bold text-gray-500">
                          {o.shop?.name}
                        </td>
                        <td className="px-10 py-6 font-black text-blue-600">
                          KES {o.totalPrice}
                        </td>
                        <td className="px-10 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${o.orderStatus === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="p-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {posts.filter(p => p.shop?.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                    <div key={p._id} className="relative group rounded-3xl overflow-hidden border-4 border-gray-50 shadow-sm hover:shadow-xl transition-all aspect-square">
                      {p.type === 'photo' ? (
                        <img src={p.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      ) : (
                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center relative">
                          <video src={p.url} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                          <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-full text-white font-black text-xs uppercase tracking-widest">Video</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                        <p className="text-white font-black text-lg truncate">{p.shop?.name}</p>
                        <p className="text-gray-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <Clock size={12} /> Expires: {new Date(new Date(p.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {posts.length === 0 && (
                  <div className="py-20 text-center">
                    <Camera className="mx-auto text-gray-200 mb-6" size={64} />
                    <p className="text-gray-400 font-bold text-xl">No active media posts in the system.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
