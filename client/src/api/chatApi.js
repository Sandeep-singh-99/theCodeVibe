import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

// Base API URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/message`;

export const useChatMessage = (chatId) => {
    return useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(`${API_URL}/send/${chatId}`, formData, {
                withCredentials: true,
            })
            return response.data;
        }
    })
}

export const useGetChatMessages = (chatId) => {
    return useQuery({
        queryKey: ["chatMessages", chatId],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/chat-message/${chatId}`, {
                withCredentials: true,
            })
            return response.data;
        },
        refetchInterval: 1000,
    })
}
