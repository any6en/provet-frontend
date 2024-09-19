import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../../utils/User';

interface UserState {
  globalUser: User;
}

const initialState: UserState = {
  //@ts-ignore
  globalUser: {},
};

export const globalUserSlice = createSlice({
  name: 'globalUser',
  initialState,
  reducers: {
    setGlobalUser(state, action: PayloadAction<User>) {
      state.globalUser = action.payload;
    },
  },
});

export default globalUserSlice.reducer;
