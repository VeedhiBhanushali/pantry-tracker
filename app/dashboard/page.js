"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, firestore } from "../firebase/config";
import Navbar from "../components/Navbar";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Webcam from "react-webcam";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    category: "",
    expiryDate: ""
  });
  const [showCamera, setShowCamera] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items");
      setLoading(false);
    }
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setShowCamera(false);
  }, [webcamRef]);

  const addItem = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to add items");
      return;
    }

    try {
      // Validate the input
      if (!newItem.name || !newItem.quantity || !newItem.category) {
        toast.error("Please fill in all required fields");
        return;
      }

      let imageUrl = null;
      if (imageSrc) {
        // Upload image to Firebase Storage
        const storage = getStorage();
        const imageRef = ref(storage, `items/${user.uid}/${Date.now()}.jpg`);
        
        // Convert base64 to blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const itemData = {
        name: newItem.name,
        quantity: newItem.quantity,
        category: newItem.category,
        expiryDate: newItem.expiryDate || null,
        imageUrl: imageUrl,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(firestore, "inventory"), itemData);
      
      if (docRef.id) {
        toast.success("Item added successfully!");
        setShowAddModal(false);
        setNewItem({ name: "", quantity: "", category: "", expiryDate: "" });
        setImageSrc(null);
        fetchItems(user.uid);
      } else {
        throw new Error("Failed to get document reference");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(error.message || "Failed to add item");
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, "inventory", itemId));
      toast.success("Item deleted successfully!");
      fetchItems(user.uid);
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-mint-50 to-cream-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        {/* Dashboard Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-8 border-l-4 border-mint-400">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Your Pantry, {user?.displayName}
          </h1>
          <p className="text-gray-600">Manage your pantry items efficiently</p>
        </div>

        {/* Search and Add Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-sage-400 text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm 
                border border-gray-200 focus:border-mint-500 focus:ring-2 
                focus:ring-mint-200 transition-all duration-200 
                placeholder:text-gray-400 text-gray-700"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-mint-600 hover:bg-mint-700 text-white px-6 py-2 rounded-lg 
              flex items-center gap-2 transition duration-200 shadow-sm"
          >
            <FaPlus /> Add New Item
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-sage-100 to-mint-100">
                <tr>
                  <th className="px-6 py-4 text-mint-800">Image</th>
                  <th className="px-6 py-4 text-mint-800">Name</th>
                  <th className="px-6 py-4 text-mint-800">Category</th>
                  <th className="px-6 py-4 text-mint-800">Quantity</th>
                  <th className="px-6 py-4 text-mint-800">Expiry Date</th>
                  <th className="px-6 py-4 text-mint-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mint-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No items found. Add some items to your pantry!
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-mint-50/50">
                      <td className="px-6 py-4">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-mint-100 rounded-lg flex items-center justify-center text-mint-600">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {/* Implement edit functionality */}}
                            className="text-mint-600 hover:text-mint-700 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grid View (you can keep or remove this based on preference) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ... (previous grid items code) ... */}
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 max-w-md w-full border-t-4 border-mint-400">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Item</h2>
              <form onSubmit={addItem} className="space-y-4">
                {/* Image Capture Section */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Item Image</label>
                  {showCamera ? (
                    <div className="relative">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={captureImage}
                        className="mt-2 bg-sage-600 text-white px-4 py-2 rounded-lg"
                      >
                        Capture
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      {imageSrc ? (
                        <div className="relative">
                          <img
                            src={imageSrc}
                            alt="Captured item"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setImageSrc(null)}
                            className="mt-2 text-red-600 hover:text-red-700"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCamera(true)}
                          className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg"
                        >
                          Take Photo
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value.trim()})}
                    className="w-full p-2 border border-gray-200 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-mint-500 
                      focus:border-mint-500 transition-all duration-200"
                    required
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Quantity *</label>
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value.trim()})}
                    className="w-full p-2 border border-gray-200 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-mint-500 
                      focus:border-mint-500 transition-all duration-200"
                    required
                    placeholder="e.g., 2 kg, 3 packets"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Category *</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-mint-500 
                      focus:border-mint-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Grains">Grains</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat</option>
                    <option value="Spices">Spices</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-mint-500 
                      focus:border-mint-500 transition-all duration-200"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-mint-600 hover:bg-mint-700 text-white px-6 py-2 
                      rounded-lg transition duration-200 shadow-sm"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Dashboard;