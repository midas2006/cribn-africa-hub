
import React from 'react';
import Navigation from './Navigation';
import Watermark from './Watermark';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Watermark />
    </div>
  );
};

export default Layout;
