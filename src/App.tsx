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
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpensesManager from './components/ExpensesManager';
import AssetsManager from './components/AssetsManager';
import LiabilitiesManager from './components/LiabilitiesManager';
import ProfileSettings from './components/ProfileSettings';
import Modal from './components/Modal';

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
setLogLevel('debug');

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
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
    saveData: async () => { console.log('Save asset'); closeModalHandler(); return null; },
    deleteData: async (id: string) => { console.log('Delete asset', id); return Promise.resolve(); },
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
