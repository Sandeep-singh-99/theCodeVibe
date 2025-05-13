import { createSlice } from '@reduxjs/toolkit'

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comments: [],
        loading: false,
        error: null,
    },

    reducers: {
        getComments: (state, action) => {
            state.comments = action.payload
        },

        clearComments: (state) => {
            state.comments = []
        },

        setComment: (state, action) => {
            state.comments = action.payload
        }
    }
})

export const { getComments, clearComments, setComment } = commentSlice.actions

export default commentSlice.reducer