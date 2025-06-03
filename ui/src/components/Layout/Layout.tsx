import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, TrendingDown, ShoppingCart, Flag, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/assets', label: 'Assets', icon: Briefcase },
  { path: '/liabilities', label: 'Liabilities', icon: TrendingDown },
  { path: '/expenses', label: 'Expenses', icon: ShoppingCart },
  { path: '/goals', label: 'Goals', icon: Flag },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

const Layout: React.FC<LayoutProps> = ({ children, darkMode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const currentPage = navItems.find(item => item.path === location.pathname)?.label || 'Page';

  return (
    <div className={`${styles.layout} ${darkMode ? styles.dark : styles.light}`}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>Financial Agent</h1>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`${styles.navLink} ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Icon className={styles.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* <header className={styles.header}>
          <h2 className={styles.pageTitle}>{currentPage}</h2>
        </header> */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;