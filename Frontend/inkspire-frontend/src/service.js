import api from "./api";

export const userService = {
  getUsers: () => api.get("/api/auth/register"),
};
