import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config.js";

export const createWasteRecord = async ({ wastename }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/waste/create`, {
      wastename,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    toast.success(res.data.message);

    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    toast.error(msg);
    return { success: false, message: msg };
  }
};

export const getWasteHistory = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/waste/history?page=${page}&limit=${limit}`, {
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

export const classifyText = async (wastename) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/waste/classify-text`, {
      wastename,
    }, {
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

export const classifyImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(`${API_BASE_URL}/api/waste/classify-image`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    toast.error(msg);
    return { success: false, message: msg };
  }
};
