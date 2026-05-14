import { Routes, Route } from "react-router-dom";
import Home from "./assets/Home/home.jsx";
import GalleryPage from "./assets/GalleryPage.jsx";
import AdminDashboard from "./assets/admin/AdminDashboard.jsx";
import ClientGallery from "./assets/client/ClientGallery.jsx";
import Login from "./assets/admin/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weddings" element={<GalleryPage title="Weddings" category="wedding" bannerCategory="banner_wedding" />} />
      <Route path="/baby-photography" element={<GalleryPage title="Baby Photography" category="baby" bannerCategory="banner_baby" />} />
      <Route path="/model-shoot" element={<GalleryPage title="Model Shoot" category="model" bannerCategory="banner_model" />} />
      <Route path="/about-us" element={<GalleryPage title="About Us" category="about" bannerCategory="banner_about" />} />
      <Route path="/contact-us" element={<GalleryPage title="Contact Us" category="contact" bannerCategory="banner_contact" />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/client/:clientName" element={<ClientGallery />} />
    </Routes>
  );
};


export default AppRoutes;
