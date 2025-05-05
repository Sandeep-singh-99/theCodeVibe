import axios from "axios";
import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setLoading, setPosts, setError } from "../redux/slice/postSlice";

// Base API URL
const API_URL = "http://localhost:5000/api/post";

export const useCreatePost = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(`${API_URL}/create-post`, formData, {
                withCredentials: true,
            })
            return response.data;
        },
        onError: (error) => {
            console.error(
                "Create post failed:",
                error.response?.data?.message || error.message
            );
        },
    })
}

export const useGetTotalPosts = () => {
  return useQuery({
    queryKey: ["get-total-post"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get-total-post`, {
        withCredentials: true,
      });
      return response.data;
    },
    onError: (error) => {
      console.error(
        "Get total posts failed:",
        error.response?.data?.message || error.message
      );
    },
  })
}


export const useGetAllPost = () => {
    const dispatch = useDispatch();
  
    return useInfiniteQuery({
      queryKey: ["get-all-post"],
      queryFn: async ({ pageParam = 1 }) => {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_URL}/get-all-post`, {
          params: {
            page: pageParam,
            limit: 10, 
          },
          withCredentials: true,
        });
        dispatch(setLoading(false));
        return response.data.data; 
      },
      getNextPageParam: (lastPage) => {
        const hasMore = lastPage.posts.length === 10 && lastPage.page * lastPage.limit < lastPage.total;
        return hasMore ? lastPage.page + 1 : undefined;
      },
      onSuccess: (data) => {
        const allPosts = data.pages.flatMap((page) => page.posts);
        dispatch(setPosts(allPosts));
      },
      onError: (error) => {
        dispatch(setLoading(false));
        dispatch(setError(true));
        console.error(
          "Get all post failed:",
          error.response?.data?.message || error.message
        );
      },
    });
  };