import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, TrendingDown, ShoppingCart, Settings as SettingsIcon, Sun, Moon } from 'lucide-react'; // Assuming Settings is an icon component

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean; // Add darkMode prop
  // toggleDarkMode?: () => void; // For future use
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/assets', label: 'Assets', icon: Briefcase },
  { path: '/liabilities', label: 'Liabilities', icon: TrendingDown },
  { path: '/expenses', label: 'Expenses', icon: ShoppingCart },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

const Layout: React.FC<LayoutProps> = ({ children, darkMode /*, toggleDarkMode */ }) => {
  const location = useLocation();
  // const darkMode = false; // Remove hardcoded value, use prop

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'} bg-pink-500`}>
      {/* Sidebar Navigation */}
      <aside className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex flex-col bg-yellow-300`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>Financial Agent</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                            ${isActive 
                              ? (darkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700') 
                              : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}
                          `}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {/* Optional: Dark mode toggle can be placed here or in ProfileSettings */}
        {/* <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />} 
            <span className="ml-2">Toggle Theme</span>
          </button>
        </div> */}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col bg-green-300">
        <header className={`${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white shadow'} p-4 bg-blue-300`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {navItems.find(item => item.path === location.pathname)?.label || 'Page'}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-purple-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;