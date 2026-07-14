import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Services from "./pages/Services";
import About from "./pages/About";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Bookings from './pages/Bookings';
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App(){
  return(
    <BrowserRouter>
    <ScrollToTop />
    <Navbar />
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/booking" element={<Bookings />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
       </Routes>
    <Footer />
    </BrowserRouter>
  )
}

export default App;