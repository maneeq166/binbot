import { Routes, Route } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/register" element={<Register />} ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  )
}
