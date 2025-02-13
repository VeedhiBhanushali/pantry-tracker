/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "./firebase/config";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import Image from 'next/image';
import { FaShoppingBasket, FaBell, FaChartPie, FaMobileAlt, FaUtensils, FaClipboardList } from 'react-icons/fa';

const Home = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        router.push("/dashboard");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-mint-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center max-w-4xl mx-auto">
            <div className="relative mb-70">
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-sage-100 to-mint-100 opacity-40 transform rotate-3"></div>
              </div>
              <h2 className="text-7xl font-bold text-gray-800 mb-8 animate-fade-in">
                Welcome to <span className="text-mint-700">Pantry</span> Tracker
              </h2>
              <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
                Your smart solution for effortless pantry management
              </p>
              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => router.push('/signup')}
                  className="bg-sage-600 hover:bg-sage-700 text-white font-semibold 
                    py-5 px-10 rounded-lg text-lg transform transition duration-200 
                    hover:scale-105 shadow-lg min-w-[200px]"
                >
                  Get Started Free
                </button>
                <button 
                  onClick={() => router.push('/demo')}
                  className="bg-cream-50 hover:bg-cream-100 text-sage-700 font-semibold 
                    py-5 px-10 rounded-lg text-lg transform transition duration-200 
                    hover:scale-105 shadow-lg border border-sage-200 min-w-[200px]"
                >
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl 
                transition-all duration-300 transform hover:-translate-y-1 border border-sage-100"
            >
              <div className="text-sage-600 mb-4 text-3xl">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-12 mb-20 
          transform hover:scale-[1.02] transition-transform duration-300 border border-sage-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 border-r last:border-r-0 border-sage-200">
                <div className="text-4xl font-bold text-sage-700 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-sage-600 to-mint-700 
          text-white rounded-2xl p-16 mb-20 shadow-xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to organize your pantry?
          </h2>
          <p className="text-xl mb-8 text-cream-50">
            Join our community of organized home chefs
          </p>
          <button 
            onClick={() => router.push('/signup')}
            className="bg-cream-50 text-sage-700 font-semibold py-5 px-10 rounded-lg text-lg
              hover:bg-white transition duration-200 transform hover:scale-105 min-w-[200px]"
          >
            Start Free Today
          </button>
        </div>

        {/* Footer */}
        <footer className="bg-sage-800 text-sage-400 py-16 rounded-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <h3 className=" text-emerald text-lg font-semibold text-emerald mb-4">About Us</h3>
                <p className="text-gray-400 leading-relaxed">
                  Pantry Tracker helps you manage your kitchen inventory efficiently and reduce food waste
                </p>
              </div>
              <div>
                <h3 className=" text-emerald text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className=" text-emerald text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li className="text-gray-400">support@pantrytracker.com</li>
                  <li className="text-gray-400">1-800-PANTRY</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
                <div className="flex space-x-4">
                  {/* Add social media icons here */}
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>© 2023 Pantry Tracker by <a li="https://veedhibhanushali.com">Veedhi Bhanushali</a> </p>
            </div>
          </div>
        </footer>
      </main>
      <ToastContainer />
    </div>
  );
};

// Features data with React Icons
const features = [
  {
    title: "Smart Inventory Tracking",
    description: "Automatically track and manage your pantry items with real-time updates and expiration alerts",
    icon: <FaShoppingBasket className="inline-block" />
  },
  {
    title: "Smart Notifications",
    description: "Get timely alerts about expiring items and low stock to maintain your pantry efficiently",
    icon: <FaBell className="inline-block" />
  },
  {
    title: "Data Analytics",
    description: "Visualize your pantry data with comprehensive charts and make informed decisions",
    icon: <FaChartPie className="inline-block" />
  },
  {
    title: "Mobile Access",
    description: "Access your pantry inventory anywhere, anytime with our mobile-friendly interface",
    icon: <FaMobileAlt className="inline-block" />
  },
  {
    title: "Recipe Suggestions",
    description: "Get personalized recipe suggestions based on your available ingredients",
    icon: <FaUtensils className="inline-block" />
  },
  {
    title: "Shopping Lists",
    description: "Generate smart shopping lists based on your inventory levels and meal plans",
    icon: <FaClipboardList className="inline-block" />
  }
];

// Statistics data
const stats = [
  {
    value: "10+",
    label: "Active Users"
  },
  {
    value: "100+",
    label: "Items Tracked"
  },
  {
    value: "90%",
    label: "Satisfaction Rate"
  }
];

export default Home;
