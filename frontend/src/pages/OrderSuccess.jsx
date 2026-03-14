import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white rounded-[3rem] shadow-2xl p-16 max-w-lg w-full text-center border border-gray-100 transform transition-all duration-500 hover:scale-105">
        <div className="relative mb-12">
          <div className="bg-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <CheckCircle className="text-green-600" size={64} />
          </div>
          <div className="absolute top-0 right-1/4 bg-blue-500 w-6 h-6 rounded-full border-4 border-white animate-bounce"></div>
          <div className="absolute bottom-4 left-1/4 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white animate-ping"></div>
        </div>
        
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Success!</h1>
        <p className="text-gray-500 text-xl font-medium leading-relaxed mb-10 max-w-sm mx-auto">
          Your delivery fee has been paid. The distributor has been notified and is on their way! 🚀
          <br /><br />
          <span className="text-blue-600 font-black uppercase text-sm">Reminder: Pay for the gas cylinder in cash on delivery.</span>
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 transform hover:-translate-y-1 active:translate-y-0"
          >
            <Home size={24} /> Back to Home
          </Link>
          
          <button className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition flex items-center justify-center gap-3 border border-gray-100 group">
            <ShoppingBag size={20} className="group-hover:text-blue-600 transition" /> 
            View Order Status <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-50">
          <p className="text-gray-400 text-sm font-medium">Estimated arrival: <span className="text-blue-600 font-bold">15 - 30 minutes</span></p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
