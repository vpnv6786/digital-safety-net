
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showBottomNav?: boolean;
}

const Layout = ({ 
  children, 
  showHeader = true, 
  showFooter = true, 
  showBottomNav = true 
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className={`flex-1 ${showBottomNav ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>
      {showFooter && <Footer />}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
