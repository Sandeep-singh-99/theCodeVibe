import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

// Base API URL
const API_URL = "http://localhost:5000/api/auth";

// Sign up
export const useSignUp = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${API_URL}/signup`, formData, {
        withCredentials: true,
      });
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Sign up failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};

// Login
export const useLogin = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${API_URL}/login`, formData, {
        withCredentials: true,
      });
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useUpdatedProfile = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(`${API_URL}/update-profile`, formData, {
        withCredentials: true,
      });
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Update profile failed:",
        error.response?.data?.message || error.message
      );
    },
  })
}

// Check authentication status
export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["checkAuth"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/check-auth`, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Check auth failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};

// Logout
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};


export const useFollowOrUnfollow = () => {
  return useMutation({
    mutationFn: async (userId) => {
      const response = await axios.put(
        `${API_URL}/follow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Follow/Unfollow failed:",
        error.response?.data?.message || error.message
      );
    },
  });
}


export const useGetFollowerOrFollowing = () => {
  return useQuery({
    queryKey: ["follow-or-following"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/follow-or-following`, {
        withCredentials: true,
      });
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Get followers/following failed:",
        error.response?.data?.message || error.message
      );
    },
  });
}
