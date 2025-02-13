/* eslint-disable @next/next/no-img-element */
// Navbar.js
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { app } from "../firebase/config";
import { firestore } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import ProfileModal from "./ProfileModal";
import { exportToPDF } from "../utils/exportPdf";
import Link from "next/link";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = ({ user }) => {
  const router = useRouter();
  const auth = getAuth(app);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async () => {
    try {
      const q = query(
        collection(firestore, "inventory"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData); // Update state with fetched items
    } catch (error) {
      console.error("Failed to fetch items:", error.message);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user, fetchItems]);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast.success("Successfully signed in!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-sage-100 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="h-10 w-auto cursor-pointer"
              onClick={() => router.push("/")}
            />
            
            <div className={`nav-links ${showMenu ? "show" : ""} flex items-center gap-6`}>
              {user ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-gray-600 hover:text-sage-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/analysis"
                    className="text-gray-600 hover:text-sage-600 transition-colors"
                  >
                    Analysis
                  </Link>
                  <Link 
                    href="/generate-recipes"
                    className="text-gray-600 hover:text-sage-600 transition-colors"
                  >
                    Generate Recipes
                  </Link>
                  <button
                    onClick={() => exportToPDF(items)}
                    className="px-4 py-2 text-sage-600 hover:text-sage-700 
                      transition-colors border border-sage-200 rounded-lg 
                      hover:bg-sage-50"
                  >
                    Export to PDF
                  </button>
                  <img
                    src={user.photoURL || "/assets/default-avatar.png"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full cursor-pointer"
                    onClick={() => setShowModal(true)}
                  />
                  <button 
                    onClick={signOutUser}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="bg-sage-600 hover:bg-sage-700 text-white font-semibold 
                    py-2 px-4 rounded-lg transform transition duration-200 
                    hover:scale-105 shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {showModal && (
        <ProfileModal user={user} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Navbar;
