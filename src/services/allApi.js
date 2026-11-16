
import axios from "axios";

const API = axios.create({
  baseURL: "https://bismiserver.onrender.com/api",
});

// Register
export const registerUserAPI = (data) => {
  return API.post("/auth/register", data);
};

// Login
export const loginUserAPI = (data) => {
  return API.post("/auth/login", data);
};

// Get all bookings (Admin)
export const getAdminBookingsAPI = (token) => {
  return API.get("/admin/bookings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all operators (Admin)
export const getOperatorsAPI = (token) => {
  return API.get("/admin/operators", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Approve or reject booking (Admin)
export const updateBookingDecisionAPI = (id, data, token) => {
  return API.patch(`/admin/bookings/${id}/decision`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get completed bookings for feedback
export const getCompletedBookingsAPI = () => {
  return API.get("/feedback/my-bookings", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Submit user feedback
export const addFeedbackAPI = (data) => {
  return API.post("/feedback/add", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Get my feedback history
export const getMyFeedbackAPI = () => {
  return API.get("/feedback/my-feedback", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Admin get all feedback
export const getAllFeedbackAPI = (token) => {
  return API.get("/feedback/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Get logged-in user profile
export const getProfileAPI = () => {
  return API.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Update logged-in user profile
export const updateProfileAPI = (data) => {
  return API.put("/auth/profile", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Change password
export const changePasswordAPI = (data) => {
  return API.put("/auth/change-password", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
// Get User Dashboard
export const getUserDashboardAPI = () => {
  return API.get("/bookings/my-dashboard", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getAllUsersAPI = (token) => {
  return API.get("/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default API;
