import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DistributorDashboard from './pages/DistributorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ShopDetails from './pages/ShopDetails';
import OrderSuccess from './pages/OrderSuccess';
import Support from './pages/Support';
import HowItWorks from './pages/HowItWorks';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop/:id" element={<ShopDetails />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/support" element={<Support />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute role="distributor">
                    <DistributorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
