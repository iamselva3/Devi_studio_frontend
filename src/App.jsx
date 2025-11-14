import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Nav.jsx';
import { Routes, Route } from "react-router-dom";
import AppRoutes from './Route.jsx';

function App() {

  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
    
  )
}

export default App
