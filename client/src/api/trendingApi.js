import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

const API_URL = `${import.meta.env.VITE_API_URL}/api/post`;

export const useGetTrendingPosts = ({ days = 7 } = {}) => {
  return useInfiniteQuery({
    queryKey: ["trending-posts", days], 
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`${API_URL}/trending-post`, {
        params: {
          page: pageParam,
          limit: 10, 
          days, 
        },
      });
      return response.data.data; 
    },
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage;
      return page * limit < total ? page + 1 : undefined;
    },
    initialPageParam: 1, 
  });
};