import axios from "axios";
import { toast } from "react-toastify";

export const createWasteRecord = async ({ wastename }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const res = await axios.post("http://localhost:3000/api/waste/create", {
      wastename,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const res = await axios.get(`http://localhost:3000/api/waste/history?page=${page}&limit=${limit}`, {
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

export const classifyImage = async (file) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post("http://localhost:3000/api/waste/classify-image", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    return { success: false, message: msg };
  }
};
