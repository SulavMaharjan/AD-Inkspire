import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "https://localhost:7039", // Change to your .NET Core API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for handling errors or auth tokens
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
