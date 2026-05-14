import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Nav.jsx';
import { Routes, Route } from "react-router-dom";
import AppRoutes from './Route.jsx';
import Footer from './assets/Home/footer.jsx';
import { ThemeProvider } from './context/ThemeContext';

function App() {

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-4 z-50 px-4 md:px-6 max-w-7xl mx-auto w-full">

          <Navbar />
        </header>
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
