import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, UserPlus, Loader2, Store, UserCircle, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/users', formData);
      login(res.data);
      navigate(formData.role === 'distributor' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe', icon: UserCircle },
    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'name@example.com', icon: Mail },
    { label: 'Phone Number', name: 'phone', type: 'text', placeholder: '254700000000', icon: Phone },
    { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', icon: Lock },
  ];

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100 transform transition-all duration-300">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Join GasLink</h1>
          <p className="text-gray-500 font-medium">Create your account to get started</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1.5 bg-gray-50 rounded-2xl mb-8 border border-gray-200">
            <button 
              type="button"
              className={`flex items-center justify-center gap-3 py-3 rounded-xl font-bold transition-all ${formData.role === 'customer' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setFormData({...formData, role: 'customer'})}
            >
              <User size={18} /> Customer
            </button>
            <button 
              type="button"
              className={`flex items-center justify-center gap-3 py-3 rounded-xl font-bold transition-all ${formData.role === 'distributor' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setFormData({...formData, role: 'distributor'})}
            >
              <Store size={18} /> Distributor
            </button>
            <button 
              type="button"
              className={`flex items-center justify-center gap-3 py-3 rounded-xl font-bold transition-all ${formData.role === 'admin' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setFormData({...formData, role: 'admin'})}
            >
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">{field.label}</label>
                <div className="relative group">
                  <field.icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
                  <input 
                    type={field.type}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition font-medium"
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold decoration-2 hover:underline underline-offset-4">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
