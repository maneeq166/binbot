import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config.js";
export const register = async ({ username, password, email }) => {
  try {
    
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
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
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("token",res.data.data)

    console.log(res);
    
    // No need to store token, cookies handle it

    // toast.success(`Logged in`);

    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    // toast.error(msg);
    console.log(error);
    
    return { success: false, message: msg };
  }
};

export const me = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    toast.error(msg);
    return { success: false, message: msg };
  }
};
