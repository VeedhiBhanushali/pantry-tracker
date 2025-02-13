"use client";
// app/analysis/page.js

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, firestore } from "../firebase/config";
import Navbar from "../components/Navbar";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { 
  FaChartPie, 
  FaExclamationTriangle, 
  FaRegClock, 
  FaShoppingCart,
  FaRegCalendarAlt
} from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

const Analysis = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    expiringItems: 0,
    categories: {},
    lowStock: 0
  });

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchItems(user.uid);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchItems = async (userId) => {
    try {
      const q = query(
        collection(firestore, "inventory"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
      calculateStats(itemsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load inventory data");
      setLoading(false);
    }
  };

  const calculateStats = (items) => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const stats = {
      totalItems: items.length,
      expiringItems: 0,
      categories: {},
      lowStock: 0
    };

    items.forEach(item => {
      // Count categories
      stats.categories[item.category] = (stats.categories[item.category] || 0) + 1;

      // Check expiring items
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        if (expiryDate <= sevenDaysFromNow) {
          stats.expiringItems++;
        }
      }

      // Check low stock items (assuming quantity is stored as a number)
      if (item.quantity && parseFloat(item.quantity) <= 2) {
        stats.lowStock++;
      }
    });

    setStats(stats);
  };

  // Register ChartJS components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );

  // Update the CategoryChart component with new colors
  const CategoryChart = ({ categories }) => {
    const data = {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            'rgba(86, 102, 86, 0.8)',    // sage
            'rgba(147, 167, 164, 0.8)',  // muted teal
            'rgba(171, 159, 157, 0.8)',  // warm gray
            'rgba(149, 164, 155, 0.8)',  // sage green
            'rgba(176, 172, 164, 0.8)',  // light taupe
            'rgba(157, 172, 159, 0.8)',  // moss green
            'rgba(169, 166, 160, 0.8)',  // stone
            'rgba(144, 158, 145, 0.8)',  // forest sage
          ],
          borderColor: [
            'rgba(86, 102, 86, 1)',      // sage
            'rgba(147, 167, 164, 1)',    // muted teal
            'rgba(171, 159, 157, 1)',    // warm gray
            'rgba(149, 164, 155, 1)',    // sage green
            'rgba(176, 172, 164, 1)',    // light taupe
            'rgba(157, 172, 159, 1)',    // moss green
            'rgba(169, 166, 160, 1)',    // stone
            'rgba(144, 158, 145, 1)',    // forest sage
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              family: "'Inter', sans-serif",
            },
            padding: 20,
          },
        },
        title: {
          display: true,
          text: 'Category Distribution',
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: '600',
          },
          color: '#1f2937', // text-gray-800
          padding: 20,
        },
      },
    };

    return <Doughnut data={data} options={options} />;
  };

  // Update the ExpiryChart component with new colors
  const ExpiryChart = ({ items }) => {
    const monthlyExpiry = items.reduce((acc, item) => {
      if (item.expiryDate) {
        const month = new Date(item.expiryDate).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});

    const data = {
      labels: Object.keys(monthlyExpiry),
      datasets: [
        {
          label: 'Items Expiring',
          data: Object.values(monthlyExpiry),
          backgroundColor: 'rgba(147, 167, 164, 0.3)',  // muted teal with low opacity
          borderColor: 'rgba(147, 167, 164, 1)',        // muted teal
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(147, 167, 164, 0.5)',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: "'Inter', sans-serif",
            },
            padding: 20,
          },
        },
        title: {
          display: true,
          text: 'Expiry Timeline',
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: '600',
          },
          color: '#1f2937', // text-gray-800
          padding: 20,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: {
              family: "'Inter', sans-serif",
            },
          },
          grid: {
            color: 'rgba(86, 102, 86, 0.1)',
          },
        },
        x: {
          ticks: {
            font: {
              family: "'Inter', sans-serif",
            },
          },
          grid: {
            color: 'rgba(86, 102, 86, 0.1)',
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-mint-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Pantry Analysis
          </h1>
          <p className="text-gray-600">
            Get insights about your pantry inventory and manage your items effectively.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sage-100 rounded-lg">
                    <FaChartPie className="text-sage-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-600">Total Items</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalItems}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-600">Expiring Soon</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.expiringItems}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FaShoppingCart className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-600">Low Stock</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.lowStock}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaRegCalendarAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-600">Categories</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {Object.keys(stats.categories).length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.categories).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{category}</span>
                    <span className="px-3 py-1 bg-sage-100 text-sage-600 rounded-full">
                      {count} items
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Distribution</h2>
                <div className="aspect-square">
                  <CategoryChart categories={stats.categories} />
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Expiry Timeline</h2>
                <div className="aspect-square">
                  <ExpiryChart items={items} />
                </div>
              </div>
            </div>

            {/* Expiring Items */}
            {stats.expiringItems > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Items Expiring Soon</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items
                    .filter(item => {
                      if (!item.expiryDate) return false;
                      const expiryDate = new Date(item.expiryDate);
                      const sevenDaysFromNow = new Date();
                      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
                      return expiryDate <= sevenDaysFromNow;
                    })
                    .map(item => (
                      <div key={item.id} className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-red-600 text-sm">
                          Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
        </div>
      </div>
            )}
          </>
        )}
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Analysis;
