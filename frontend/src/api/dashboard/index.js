import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config.js";

export const getDashboardSummary = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const res = await axios.get(`${API_BASE_URL}/api/dashboard/summary`, {
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

export const getDashboardAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const res = await axios.get(`${API_BASE_URL}/api/dashboard/analytics`, {
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
