import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    userLogin: (state, action) => action.payload,
    userLogout: () => ({}),
  }
});

export const { userLogin, userLogout } = userSlice.actions;

export default userSlice.reducer;
