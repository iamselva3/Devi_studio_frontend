import { Routes, Route } from "react-router-dom";
import Home from "./assets/Home/home.jsx";
import Traditional from "./assets/Traditionalwedding/traditional.jsx";
// import Weddings from "./pages/Weddings";
// import BabyPhotography from "./pages/BabyPhotography";
// import Gallery from "./pages/Gallery";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weddings" element={<Traditional />} />
      {/* <Route path="/baby" element={<BabyPhotography />} /> */}
      {/* <Route path="/gallery" element={<Gallery />} /> */}
    </Routes>
  );
};

export default AppRoutes;
