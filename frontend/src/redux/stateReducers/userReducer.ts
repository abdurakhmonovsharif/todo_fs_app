import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: { id: null, username: null },
    reducers: {
        setUser: (state, action) => {
            const { id, username } = action.payload;
            return { ...state, id, username };
        },
        clearUser: (state) => {
            return { id: null, username: null };
        }
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
