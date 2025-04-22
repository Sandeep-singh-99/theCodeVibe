import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

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

export const useGetAllPost = () => {
    return useQuery({
        queryKey: ["get-all-post"],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/get-all-post`, {
                withCredentials: true,
            })
            return response.data;
        },
        onError: (error) => {
            console.error(
                "Get all post failed:",
                error.response?.data?.message || error.message
            );
        },
    })       
}