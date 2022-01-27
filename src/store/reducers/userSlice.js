import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    userLogin: (state, action) => {
      const bearerToken = `Bearer ${action.payload.token}`
      axios.defaults.headers.common['authorization'] = bearerToken;
      localStorage.setItem('user', JSON.stringify(action.payload));
      console.log('set localStorage user to:', action.payload);
      return action.payload;
    },
    userLogout: (state) => {
      // remove token from axios
      axios.defaults.headers.common['authorization'] = '';
      localStorage.removeItem('user');

      // notify backend
      axios.post('logout', { token: state.token });
      // update state
      return {}
    }
  }
});

export const { userLogin, userLogout } = userSlice.actions;

export default userSlice.reducer;
