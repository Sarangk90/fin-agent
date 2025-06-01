// Global declarations for external variables
declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, where, serverTimestamp, setLogLevel } from 'firebase/firestore';
import { DollarSign, TrendingUp, TrendingDown, Home, CreditCard, Settings, PlusCircle, Edit3, Trash2, AlertTriangle, CheckCircle, ShoppingCart, Briefcase, Heart, Car, BookOpen, ShieldCheck, Users, Sun, Moon, BarChart3, X } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ExpensesManager from './components/ExpensesManager';
import AssetsManager from './components/AssetsManager/AssetsManager';
import LiabilitiesManager from './components/LiabilitiesManager';
import ProfileSettings from './components/ProfileSettings';
import Modal from './components/Modal/Modal';

// --- Configuration ---
const LOCAL_DEV_MODE = true;
const LOCAL_DEV_USER_ID = 'local-dev-user-001';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-financial-app-local';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// setLogLevel('debug'); // You might want to remove or conditionally set this for production

// Define a type for your Asset, matching the frontend and backend expectations
interface Asset {
  id: string;
  name: string;
  valueINR: number;
  assetClass: string;      // E.g., Cash, Equity, Debt, Real Estate, Commodities
  assetType: string;       // E.g., Savings Account, Stocks, FD, Residential Property
  fpAssetClass: string;    // E.g., Emergency Fund, Retirement, Goal-Specific
  [key: string]: string | number; // Index signature to EXACTLY match AssetsManager
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]); // Use the Asset type
  const [expenses, setExpenses] = useState<any[]>([]);
  const [liabilities, setLiabilities] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>({});

  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

  const openModalHandler = (content: React.ReactNode, title?: string) => {
    setModalTitle(title);
    setModalContent(content);
  };

  const closeModalHandler = () => {
    setModalContent(null);
    setModalTitle(undefined);
  };

  const dashboardProps = {
    netWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    totalAnnualExpenses: 0,
    totalAnnualNeeds: 0,
    totalAnnualWants: 0,
    assets: assets,
    expenses: expenses,
    darkMode: darkMode,
  };

  const commonManagerProps = {
    openModal: openModalHandler,
    darkMode: darkMode,
  };

  const assetsManagerProps = {
    ...commonManagerProps,
    assets: assets,
    saveData: async (collection: string, assetData: Omit<Asset, 'id'>, id?: string) => {
      console.log(`Attempting to save to collection: ${collection}, asset data:`, assetData, `id: ${id}`);

      // Ensure valueINR is a number, as it might come as a string from the form
      const payload = { ...assetData };
      if (typeof payload.valueINR === 'string') {
        payload.valueINR = parseFloat(payload.valueINR) || 0;
      }
      
      if (id) { // Update existing asset
        console.log("Attempting to update asset with id:", id, "Payload:", payload);
        try {
          const response = await fetch(`http://localhost:5001/api/assets/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error details (update):", errorData);
            throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
          }
          const updatedAsset = await response.json() as Asset;
          console.log('Asset updated successfully, response:', updatedAsset);
          setAssets(prevAssets => prevAssets.map(asset => asset.id === id ? updatedAsset : asset));
          closeModalHandler();
          return updatedAsset.id;
        } catch (error: any) {
          console.error("Failed to update asset:", error);
          // Optionally: openModalHandler(<div>Error updating asset: {error.message}</div>, "Error");
          closeModalHandler(); // Close modal even on error, or handle differently
          return null;
        }
      } else { // Create new asset
        console.log("Payload being sent to backend (create):", payload);
        try {
          const response = await fetch('http://localhost:5001/api/assets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error details (create):", errorData);
            throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
          }
          const newAsset = await response.json() as Asset;
          console.log('Asset saved successfully, response:', newAsset);
          setAssets(prevAssets => [...prevAssets, newAsset]);
          closeModalHandler();
          return newAsset.id;
        } catch (error: any) {
          console.error("Failed to save asset:", error);
          // Optionally: openModalHandler(<div>Error saving asset: {error.message}</div>, "Error");
          closeModalHandler();
          return null;
        }
      }
    },
    deleteData: async (collection: string, id: string) => {
      console.log(`Attempting to delete from ${collection}, id: ${id}`);
      if (collection !== 'assets') {
        console.warn(`deleteData called for unhandled collection: ${collection}`);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/assets/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          // For 204 No Content, response.ok is true, but response.json() would fail.
          // For other errors (404, 500), try to parse JSON.
          if (response.status === 404) {
             const errorData = await response.json();
             console.error("Backend error details (delete - 404):", errorData);
             throw new Error(errorData.detail || `Asset with ID ${id} not found.`);
          } else if (response.status !== 204) {
            const errorData = await response.json();
            console.error("Backend error details (delete):", errorData);
            throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
          }
        }
        // If response.ok and status is 204, deletion was successful.
        console.log(`Asset with id ${id} deleted successfully.`);
        setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
        // No need to call closeModalHandler() here as deletion is usually not done from a modal
        // that needs explicit closing for this action. If it were, DataManager would handle it.
      } catch (error: any) {
        console.error(`Failed to delete asset with id ${id}:`, error);
        // Optionally: openModalHandler(<div>Error deleting asset: {error.message}</div>, "Error");
      }
    },
  };

  const liabilitiesManagerProps = {
    ...commonManagerProps,
    liabilities: liabilities,
    saveData: async () => { console.log('Save liability'); closeModalHandler(); return null; },
    deleteData: async (id: string) => { console.log('Delete liability', id); return Promise.resolve(); },
  };

  const expensesManagerProps = {
    ...commonManagerProps,
    expenses: expenses,
    saveData: async () => { console.log('Save expense'); closeModalHandler(); return null; },
    deleteData: async (id: string) => { console.log('Delete expense', id); return Promise.resolve(); },
  };

  const profileSettingsProps = {
    userProfile: userProfile,
    saveUserProfile: async () => { console.log('Save profile'); return Promise.resolve(); },
    darkMode: darkMode,
  };

  useEffect(() => {
    // Fetch initial assets
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/assets');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedAssets = await response.json();
        setAssets(fetchedAssets);
        console.log('Assets fetched successfully:', fetchedAssets);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
        // Optionally: openModalHandler(<div>Error fetching assets: {error.message}</div>, "Error");
      }
    };

    fetchAssets();

    // Test: Apply a Tailwind class to the body
    document.body.classList.add('bg-sky-500'); // A bright Tailwind color
    // Clean up on component unmount
    return () => {
      document.body.classList.remove('bg-sky-500');
    };
  }, []);

  return (
    <Layout darkMode={darkMode}>
      <Routes>
        <Route path="/" element={<Dashboard {...dashboardProps} />} />
        <Route path="/assets" element={<AssetsManager {...assetsManagerProps} />} />
        <Route path="/liabilities" element={<LiabilitiesManager {...liabilitiesManagerProps} />} />
        <Route path="/expenses" element={<ExpensesManager {...expensesManagerProps} />} />
        <Route path="/settings" element={<ProfileSettings {...profileSettingsProps} />} />
      </Routes>
      <Modal isOpen={modalContent !== null} onClose={closeModalHandler} title={modalTitle} darkMode={darkMode}>
        {modalContent}
      </Modal>
    </Layout>
  )
}

export default App
