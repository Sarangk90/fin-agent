// Global declarations for external variables
declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// Define a type for Expense, matching frontend (ExpensesManager) and backend (expense_models)
interface Expense {
  id: string;
  category: string;
  details?: string; // Optional
  amount: number;
  frequency: string; // "One-Time", "Monthly", etc.
  needWant: 'Need' | 'Want';
  date: string; // YYYY-MM-DD
  [key: string]: string | number | undefined; // Index signature from ExpensesManager
}

// Define a type for Liability, matching frontend (LiabilitiesManager) and backend (liability_models)
interface Liability {
  id: string;
  name: string;
  type: string;
  outstandingAmountINR: number;
  interestRate?: number; // Optional
  dueDate?: string;      // Optional, YYYY-MM-DD
  // termYears is not currently in UI forms, so excluded for now
  [key: string]: string | number | undefined; // Index signature from LiabilitiesManager
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]); // Use Liability type
  const [userProfile, setUserProfile] = useState<any>({});

  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

  // Calculate totalAssets using useMemo
  const totalAssetsValue = useMemo(() => {
    return assets.reduce((sum, asset) => sum + (asset.valueINR || 0), 0);
  }, [assets]);

  // Calculate totalLiabilities using useMemo
  const totalLiabilitiesValue = useMemo(() => {
    return liabilities.reduce((sum, liability) => sum + (liability.outstandingAmountINR || 0), 0);
  }, [liabilities]);

  // Helper function logic for annual expense calculation (adapted from ExpensesManager)
  const calculateAnnualExpense = (amount: number, frequency: string): number => {
    amount = parseFloat(amount.toString()) || 0;
    switch (frequency) {
      case "Monthly": return amount * 12;
      case "Quarterly": return amount * 4;
      case "Semi-Annually": return amount * 2;
      case "Annually": return amount;
      case "One-Time": return amount; // Or decide if one-time expenses count towards *annual* total
      default: return 0;
    }
  };

  // Calculate totalAnnualExpenses using useMemo
  const totalAnnualExpensesValue = useMemo(() => {
    return expenses.reduce((sum, expense) => {
      return sum + calculateAnnualExpense(expense.amount, expense.frequency);
    }, 0);
  }, [expenses]);

  // Calculate netWorth using useMemo
  const netWorthValue = useMemo(() => {
    return totalAssetsValue - totalLiabilitiesValue;
  }, [totalAssetsValue, totalLiabilitiesValue]);

  const openModalHandler = (content: React.ReactNode, title?: string) => {
    setModalTitle(title);
    setModalContent(content);
  };

  const closeModalHandler = () => {
    setModalContent(null);
    setModalTitle(undefined);
  };

  const dashboardProps = {
    netWorth: netWorthValue,
    totalAssets: totalAssetsValue,
    totalLiabilities: totalLiabilitiesValue,
    totalAnnualExpenses: totalAnnualExpensesValue,
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
        console.warn(`deleteData called for unhandled collection: ${collection} in assetsManagerProps`);
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
    saveData: async (collection: string, liabilityData: Omit<Liability, 'id'>, id?: string) => {
      console.log(`Attempting to save to collection: ${collection}, liability data:`, liabilityData, `id: ${id}`);
      if (collection !== 'liabilities') {
        console.warn(`saveData called for unhandled collection: ${collection}`);
        return null;
      }

      const payload = { ...liabilityData };
      // Ensure numeric fields are numbers
      if (typeof payload.outstandingAmountINR === 'string') {
        payload.outstandingAmountINR = parseFloat(payload.outstandingAmountINR) || 0;
      }
      if (payload.interestRate && typeof payload.interestRate === 'string') {
        payload.interestRate = parseFloat(payload.interestRate);
        if (isNaN(payload.interestRate)) payload.interestRate = undefined; // or handle as error
      } else if (payload.interestRate === '') { // Handle empty string from form for optional number
        payload.interestRate = undefined;
      }
      // dueDate from HTML date input is already "YYYY-MM-DD" or empty string for optional
      if (payload.dueDate === '') {
        payload.dueDate = undefined;
      }

      if (id) { // Update existing liability
        console.log("Attempting to update liability with id:", id, "Payload:", payload);
        try {
          const response = await fetch(`http://localhost:5001/api/liabilities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error details (update liability):", errorData);
            throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
          }
          const updatedLiability = await response.json() as Liability;
          console.log('Liability updated successfully:', updatedLiability);
          setLiabilities(prevLiabilities => prevLiabilities.map(lib => lib.id === id ? updatedLiability : lib));
          closeModalHandler();
          return updatedLiability.id;
        } catch (error: any) {
          console.error("Failed to update liability:", error);
          closeModalHandler();
          return null;
        }
      } else { // Create new liability
        console.log("Payload for new liability:", payload);
        try {
          const response = await fetch('http://localhost:5001/api/liabilities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error details (create liability):", errorData);
            throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
          }
          const newLiability = await response.json() as Liability;
          console.log('Liability created successfully:', newLiability);
          setLiabilities(prevLiabilities => [...prevLiabilities, newLiability]);
          closeModalHandler();
          return newLiability.id;
        } catch (error: any) {
          console.error("Failed to create liability:", error);
          closeModalHandler();
          return null;
        }
      }
    },
    deleteData: async (collection: string, id: string) => {
      console.log(`Attempting to delete from ${collection}, id: ${id}`);
      if (collection !== 'liabilities') {
        console.warn(`deleteData called for unhandled collection: ${collection}`);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5001/api/liabilities/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok && response.status !== 204) {
          const errorData = await response.json().catch(() => ({ detail: "Failed to parse error from delete response"}));
          console.error("Backend error details (delete liability):", errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        console.log(`Liability with id ${id} deleted successfully.`);
        setLiabilities(prevLiabilities => prevLiabilities.filter(lib => lib.id !== id));
      } catch (error: any) {
        console.error(`Failed to delete liability with id ${id}:`, error);
      }
    },
  };

  const expensesManagerProps = {
    ...commonManagerProps,
    expenses: expenses,
    saveData: async (collection: string, expenseData: Omit<Expense, 'id'>, id?: string) => {
      console.log(`Attempting to save to collection: ${collection}, expense data:`, expenseData, `id: ${id}`);
      if (collection !== 'expenses') {
        console.warn(`saveData called for unhandled collection: ${collection}`);
        return null;
      }

      // Ensure amount is a number
      const payload = { ...expenseData };
      if (typeof payload.amount === 'string') {
        payload.amount = parseFloat(payload.amount) || 0;
      }
      // Dates from HTML date inputs are already in "YYYY-MM-DD" string format.

      if (id) { // Update existing expense
        console.log("Attempting to update expense with id:", id, "Payload:", payload);
        try {
          const response = await fetch(`http://localhost:5001/api/expenses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error details (update expense):", errorData);
            throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
          }
          const updatedExpense = await response.json() as Expense;
          console.log('Expense updated successfully:', updatedExpense);
          setExpenses(prevExpenses => prevExpenses.map(exp => exp.id === id ? updatedExpense : exp));
          closeModalHandler();
          return updatedExpense.id;
        } catch (error: any) {
          console.error("Failed to update expense:", error);
          closeModalHandler();
          return null;
        }
      } else { // Create new expense
        console.log("Payload for new expense:", payload);
        try {
          const response = await fetch('http://localhost:5001/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error details (create expense):", errorData);
            throw new Error(errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
          }
          const newExpense = await response.json() as Expense;
          console.log('Expense created successfully:', newExpense);
          setExpenses(prevExpenses => [...prevExpenses, newExpense]);
          closeModalHandler();
          return newExpense.id;
        } catch (error: any) {
          console.error("Failed to create expense:", error);
          closeModalHandler();
          return null;
        }
      }
    },
    deleteData: async (collection: string, id: string) => {
      console.log(`Attempting to delete from ${collection}, id: ${id}`);
      if (collection !== 'expenses') {
        console.warn(`deleteData called for unhandled collection: ${collection}`);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5001/api/expenses/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok && response.status !== 204) {
          const errorData = await response.json().catch(() => ({ detail: "Failed to parse error from delete response" }));
          console.error("Backend error details (delete expense):", errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        console.log(`Expense with id ${id} deleted successfully.`);
        setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== id));
      } catch (error: any) {
        console.error(`Failed to delete expense with id ${id}:`, error);
      }
    },
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

    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/expenses');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedExpenses = await response.json() as Expense[];
        setExpenses(fetchedExpenses);
        console.log('Expenses fetched successfully:', fetchedExpenses);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };

    fetchExpenses();

    const fetchLiabilities = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/liabilities');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedLiabilities = await response.json() as Liability[];
        setLiabilities(fetchedLiabilities);
        console.log('Liabilities fetched successfully:', fetchedLiabilities);
      } catch (error) {
        console.error("Failed to fetch liabilities:", error);
      }
    };

    fetchLiabilities();

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
