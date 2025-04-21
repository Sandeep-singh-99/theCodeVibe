import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const isCheckAuth = createAsyncThunk("auth/checkAuth", async (_, thunkApi) => {
    try {
        const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
            withCredentials: true,
        })
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
})

export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/logout", {
            method: 'POST'
        })

        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
})

const authSlice = new createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
    },

    extraReducers: (builder) => {
        builder.addCase(isCheckAuth.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        builder.addCase(isCheckAuth.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        })

        builder.addCase(isCheckAuth.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        })

        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;

        })

        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        })

        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },

    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },

        // checkAuth: (state, action) => {
        //     state.isAuthenticated = true;
        //     state.user = action.payload;
        // },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { login, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;