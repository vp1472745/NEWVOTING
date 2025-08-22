import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "../src/components/Navbar.jsx";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Organization from "./pages/Organization.jsx";
import CandidateDashboard from "../src/pages/CandidateDashboard.jsx";
import VoterDashboard from "../src/pages/VoterDashboard.jsx";
// import CandidateApplyPage from "./pages/CandidateApplyPage";
import PublicElectionPage from "./pages/PublicElectionPage.jsx"; // ya jis naam se aapne page banaya hai
import PublicVoterPage from "./pages/PublicVoterRegisterPage.jsx"
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/organization/dashboard" element={<Organization />} />
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
              <Route path="/voter/dashboard" element={<VoterDashboard />} />
              <Route path="/election/:id" element={<PublicElectionPage />} />
              <Route path="/voter/:id" element={<PublicVoterPage/>}/>
              {/* Add other routes here */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
