import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Transactions from "./pages/dashboard/Transactions";
import AddTransaction from "./pages/dashboard/AddTransaction";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import NoticeManagement from "./pages/admin/NoticeManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import BlogDetails from "./pages/BlogDetails";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import PublicNoticeBoard from "./pages/PublicNoticeBoard";

import ProtectedRoute from "./components/routes/ProtectedRoute";
import RoleRoute from "./components/routes/RoleRoute";
import Home from "./pages/Home";
import FundManagement from "./pages/admin/FundManagement";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/notices" element={<PublicNoticeBoard />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Member Dashboard */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/add" element={<AddTransaction />} />
          </Route>

          {/* Admin / Owner / Kosadhokko */}
          <Route
            element={<RoleRoute roles={["admin", "owner", "kosadhokko"]} />}
          >
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="notices" element={<NoticeManagement />} />
              <Route path="blogs" element={<BlogManagement />} />
              {/* 🟢 FIXED: Changed path from "fund" to "funds" for consistency */}
              <Route path="funds" element={<FundManagement />} />
              <Route path="transactions" element={<Transactions />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
