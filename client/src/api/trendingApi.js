// import axios from "axios";
// import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";

// const API_URL = "http://localhost:5000/api/post";

// export const useGetTrendingPosts = () => {
//     return useInfiniteQuery({
//         queryKey: ["trending-post"],
//         queryFn: async ({ pageParam = 1 }) => {
//         const response = await axios.get(`${API_URL}/trending-post?page=${pageParam}`, {
//             withCredentials: true,
//         });
//         return response.data;
//         },
//         getNextPageParam: (lastPage) => {
//         if (lastPage.length === 0) return undefined;
//         return lastPage.length + 1;
//         },
//     });
// }



import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:5000/api/post";

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