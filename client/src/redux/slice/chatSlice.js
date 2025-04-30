import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
       onlineUsers: [],
       messages: [],
       users: [],
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },

        setMessages: (state, action) => {
            state.messages = action.payload
        },
        setUsers: (state, action) => {
            state.users = action.payload
        }
    }
})

export const { setOnlineUsers, setMessages, setUsers } = chatSlice.actions

export default chatSlice.reducer