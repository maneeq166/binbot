import axios from "axios";
import { toast } from "react-toastify";
export const register = async ({ username, password, email }) => {
  try {
    const res = await axios.post("http://localhost:3000/api/auth/register", {
      username,
      email,
      password,
    });

    toast.success(res.data.message);

    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    // toast.error(msg);

    return { success: false, message: msg };
  }
};
export const login = async ({ email, password }) => {
  try {
    const res = await axios.post(`http://localhost:3000/api/auth/login`, {
      email,
      password,
    });

    const token = res.data.data;

    localStorage.setItem("token", token);

    toast.success(`Logged in`);

    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    // toast.error(msg);
    return { success: false, message: msg };
  }
};

export const me = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const res = await axios.get("http://localhost:3000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    toast.error(msg);
    return { success: false, message: msg };
  }
};
