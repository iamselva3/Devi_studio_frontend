import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, SuperAuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Public Pages
import Home from "./pages/public/Home";
import Gallery from "./pages/public/Gallery";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Pricing from "./pages/public/Pricing";
import Blog from "./pages/public/Blog";

// Client
import ClientGallery from "./pages/client/ClientGallery";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Super Admin
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";

function Layout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/superadmin');

  return (
    <div className="app-container">
      {!isAdminPath && <Navbar />}
      
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/weddings" element={<Gallery category="wedding" />} />
          <Route path="/baby-photography" element={<Gallery category="baby" />} />
          <Route path="/model-shoot" element={<Gallery category="model" />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />

          {/* Client Gallery */}
          <Route path="/client/:clientName" element={<ClientGallery />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Super Admin */}
          <Route path="/superadmin/login" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SuperAuthProvider>
        <AuthProvider>
          <SettingsProvider>
            <Layout />
          </SettingsProvider>
        </AuthProvider>
      </SuperAuthProvider>
    </Router>
  );
}
