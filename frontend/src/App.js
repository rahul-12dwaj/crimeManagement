import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import ReportFIR from "./components/ReportFIR";
import CrimeStats from "./components/CrimeStats";
import Emergency from "./components/Emergency";
import FAQs from "./components/FAQs";
import Notifications from "./components/Notifications";
import Adminhomepage from "./components/Adminhomepage";
import AdminDashboard from "./adminComponents/AdminDashboard";
import ManageUsers from "./adminComponents/ManageUsers";
import ManageReports from "./adminComponents/ManageReports";
import ManageCrimeStats from "./adminComponents/ManageCrimeStats";
import ManageNotification from "./adminComponents/ManageNotification"
// Protected Route for normal users
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
};

// Protected Admin Route
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user && user.role === "admin" ? children : <Navigate to="/" />;
};


function App() {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Protected Routes for Normal Users */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="report-fir" element={<ReportFIR />} />
          <Route path="crime-stats" element={<CrimeStats />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Protected Admin Routes with Sidebar */}
        <Route
          path="/adminhomepage"
          element={
            <ProtectedAdminRoute>
              <Adminhomepage />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manageusers" element={<ManageUsers />} />
          <Route path="managereports" element={<ManageReports />} />
          <Route path="managecrimestats" element={<ManageCrimeStats />} />
          <Route path="managenotifications" element={<ManageNotification />} />
        </Route>
      </Routes>
  );
}

export default App;
