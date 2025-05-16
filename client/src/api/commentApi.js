import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

const API_URL = `${import.meta.env.VITE_API_URL}/api/comment`;

export const useAddComment = (id) => {
  return useMutation({
    mutationFn: async (commentData) => {
      const response = await axios.post(
        `${API_URL}/add-comment/${id}`,
        {content: commentData.text},
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });
};

export const useGetComment = (id) => {
  return useQuery({
    queryKey: ["getComment", id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get-comment/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
};
