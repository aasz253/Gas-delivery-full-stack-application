import React from 'react';
import { 
  ShoppingBag, Truck, CheckCircle, ShieldCheck, 
  TrendingUp, Users, ArrowRight, ArrowLeft, 
  MapPin, Clock, CreditCard, MessageCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

  const userSteps = [
    {
      title: "Choose Your Cylinder",
      description: "Browse nearby distributors and select your preferred gas brand and size.",
      icon: ShoppingBag,
      color: "blue"
    },
    {
      title: "Pin Your Location",
      description: "Use our precise Google Maps integration to show exactly where you want your gas delivered.",
      icon: MapPin,
      color: "indigo"
    },
    {
      title: "Pay Delivery Fee",
      description: "Pay a small delivery fee upfront via M-Pesa STK push to confirm your order.",
      icon: CreditCard,
      color: "green"
    },
    {
      title: "Instant Delivery",
      description: "The distributor receives your details immediately and delivers to your doorstep. Pay for the gas in cash!",
      icon: Truck,
      color: "orange"
    }
  ];

  const distributorBenefits = [
    {
      title: "Reach More Customers",
      description: "Get discovered by thousands of households in your area looking for reliable gas delivery.",
      icon: Users,
    },
    {
      title: "Secure Payments",
      description: "Receive confirmed delivery fees upfront, ensuring you only move for serious customers.",
      icon: ShieldCheck,
    },
    {
      title: "Business Growth",
      description: "Track your sales, manage inventory, and grow your brand with our professional dashboard.",
      icon: TrendingUp,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 mt-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header & Back Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 font-black uppercase tracking-widest hover:text-blue-600 transition group"
          >
            <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition">
              <ArrowLeft size={20} />
            </div>
            Go Back
          </button>
          <div className="text-right hidden md:block">
            <p className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">Platform Overview</p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">How GasLink Works</h1>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          <div className="lg:w-1/2 relative min-h-[400px]">
            <img 
              src="/Gas distributor and colorful LPG cylinders.png" 
              alt="Gas Distributor"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          </div>
          <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-8">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter">
              Connecting <span className="text-blue-600">Trust</span> with <span className="text-blue-600">Efficiency.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              GasLink is not just an app; it's a revolutionary ecosystem designed to solve the daily struggle of LPG procurement. We bring transparency to customers and massive growth to local distributors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-200">
                Join the Network
              </Link>
              <Link to="/support" className="bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl font-black hover:bg-gray-100 transition flex items-center gap-2">
                <MessageCircle size={20} /> Talk to Us
              </Link>
            </div>
          </div>
        </section>

        {/* For Customers */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter">For Our Customers</h3>
            <p className="text-gray-500 font-medium text-lg">Seamless ordering experience from your phone to your kitchen.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userSteps.map((step, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all group">
                <div className={`bg-${step.color}-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition`}>
                  <step.icon className={`text-${step.color}-600`} size={32} />
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{step.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For Distributors */}
        <section className="bg-gray-900 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden text-white">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-5xl font-black tracking-tighter leading-tight">
                Scale Your Business <br /> 
                <span className="text-blue-500">Beyond the Counter.</span>
              </h3>
              <p className="text-xl text-gray-400 font-medium leading-relaxed">
                Local shops often struggle to reach new neighborhoods. GasLink digitizes your storefront, handles the logistics of location pinning, and secures your revenue through upfront delivery payments.
              </p>
              <div className="space-y-6">
                {distributorBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                      <benefit.icon className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h5 className="text-xl font-black mb-1">{benefit.title}</h5>
                      <p className="text-gray-500 font-medium">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20 transform hover:-translate-y-1">
                Register Your Shop Today <ArrowRight size={24} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                  <h6 className="text-4xl font-black mb-2">450+</h6>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Active Shops</p>
                </div>
                <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/20">
                  <h6 className="text-4xl font-black mb-2">99%</h6>
                  <p className="text-blue-200 font-bold uppercase tracking-widest text-xs">Uptime</p>
                </div>
              </div>
              <div className="space-y-6 mt-12">
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                  <h6 className="text-4xl font-black mb-2">25m</h6>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Avg. Delivery</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                  <h6 className="text-4xl font-black mb-2">12K+</h6>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Deliveries</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-dot-pattern opacity-[0.05] pointer-events-none"></div>
        </section>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-12 py-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-3 font-black text-gray-400 uppercase tracking-widest text-sm">
            <ShieldCheck size={32} className="text-blue-600" /> Secure Daraja API
          </div>
          <div className="flex items-center gap-3 font-black text-gray-400 uppercase tracking-widest text-sm">
            <CheckCircle size={32} className="text-green-500" /> Verified Distributors
          </div>
          <div className="flex items-center gap-3 font-black text-gray-400 uppercase tracking-widest text-sm">
            <Clock size={32} className="text-orange-500" /> Real-time Tracking
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
