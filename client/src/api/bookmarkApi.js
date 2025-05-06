import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:5000/api/bookmark";

export const useBookmarkPost = () => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(
        `${API_URL}/add-bookmark/${id}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
  });
};

export const useGetAllBookmark = () => {
  return useQuery({
    queryKey: ["get-all-bookmark"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get-bookmark`, {
        withCredentials: true,
      });
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Get all bookmarks failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};
