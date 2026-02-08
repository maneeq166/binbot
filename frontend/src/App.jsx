import { Routes, Route } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Layout from "./helper/Layout";
import Profile from "./pages/Profile";
import Classify from "./pages/Classify";
import PublicLayout from "./helper/PublicLayout";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected / App pages (WITH NAVBAR) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/classify" element={<Classify/>}></Route>
          {/* future routes */}
          {/* <Route path="/history" element={<History />} /> */}
          {/* <Route path="/analytics" element={<Analytics />} /> */}
        </Route>
      </Routes>

      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}
