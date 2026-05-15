import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Nav.jsx';
import { Routes, Route, useLocation } from "react-router-dom";
import AppRoutes from './Route.jsx';
import Footer from './assets/Home/footer.jsx';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        {!isAdminPath && (
          <header className="sticky top-4 z-50 px-[1px] md:px-6 max-w-7xl mx-auto w-full">
            <Navbar />
          </header>
        )}
        <main className="flex-grow">
          <AppRoutes />
        </main>
        {!isAdminPath && <Footer />}
      </div>
    </ThemeProvider>
  );
}


export default App;
