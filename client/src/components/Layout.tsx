import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import MenuIcon from './MenuIcon';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-base-100" data-theme="modern-neutral">
      <motion.main
        animate={{ marginRight: isSidebarOpen ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className="p-4"
      >
        <Outlet />
      </motion.main>

      <motion.button
        onClick={toggleSidebar}
        animate={{ x: isSidebarOpen ? -256 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 right-4 z-50"
        aria-label="Toggle Sidebar"
      >
        <MenuIcon isOpen={isSidebarOpen} />
      </motion.button>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isSidebarOpen ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-64 bg-base-200 shadow-lg"
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </motion.div>
    </div>
  );
};

export default Layout;
