import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/message`;

export const useSideBarUser = () => {
    return useQuery({
        queryKey: ["side-bar-user"],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/users`, {
                withCredentials: true,
            })
            return response.data;
        }
    })
}