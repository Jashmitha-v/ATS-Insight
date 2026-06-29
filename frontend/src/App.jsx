import { Route, Routes } from "react-router-dom";

import Footer from "./components/common/Footer.jsx";
import Navbar from "./components/common/Navbar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import JobDescriptionPage from "./pages/JobDescriptionPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-gray-100 font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/job-description" element={<JobDescriptionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
