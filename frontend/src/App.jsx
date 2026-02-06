import { Routes, Route } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  )
}
