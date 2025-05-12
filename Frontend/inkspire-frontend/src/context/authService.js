import axios from "axios";

const API_URL = "https://localhost:7039";

//axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    console.log("API response:", response);
    return response.data;
  },
  (error) => {
    console.error("API error:", error.response?.data);
    return Promise.reject({
      message: error.response?.data?.message || "An error occurred",
      status: error.response?.status,
    });
  }
);

//attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//methods
const authService = {
  //register new user
  register: async (name, email, username, password, confirmPassword) => {
    const registerData = {
      name,
      email,
      userName: username,
      password,
      confirmPassword,
      role: "member",
    };

    const response = await api.post("/api/auth/register", registerData);

    if (response.isSuccess && response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  },

  //login user
  login: async (emailOrUsername, password, requestedRole) => {
    const loginData = {
      EmailOrUsername: emailOrUsername,
      Password: password,
    };

    const config = {
      headers: {
        "X-Requested-Role": requestedRole,
      },
    };

    try {
      const response = await api.post("/api/auth/login", loginData, config);

      if (response.isSuccess && response.token) {
        if (
          requestedRole &&
          response.role.toLowerCase() !== requestedRole.toLowerCase()
        ) {
          throw new Error(
            `You don't have the requested role: ${requestedRole}`
          );
        }

        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error("Login error details:", error);
      throw error;
    }
  },

  //logout user
  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  //get current user role
  getCurrentRole: () => {
    return localStorage.getItem("role");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  //refresh the token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    try {
      const response = await api.post("/api/auth/refresh-token", {
        refreshToken,
      });

      if (response.isSuccess && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  },
};

const reviewService = {
  checkReviewEligibility: async (bookId) => {
    return await api.get(`/api/reviews/eligibility/${bookId}`);
  },

  createReview: async (bookId, rating, comment) => {
    return await api.post("/api/reviews", {
      bookId,
      rating,
      comment,
    });
  },

  getBookReviews: async (bookId) => {
    return await api.get(`/api/reviews/book/${bookId}`);
  },

  getUserReviews: async () => {
    return await api.get("/api/reviews/user");
  },
};


export { authService, reviewService };

export default authService;
