import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        selectedUser: null,
    },

    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        checkAuth: (state, action) => {
            state.isAuthenticated = true
            state.user = action.payload
        },

        setUpdateProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        }
    }
})

export const { login, setLoading, setError, checkAuth, logout, setUpdateProfile, setSelectedUser } = authSlice.actions;

export default authSlice.reducer;

