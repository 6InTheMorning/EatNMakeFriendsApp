import {createSlice} from '@reduxjs/toolkit';
import {logIn} from '../api/userApi';

const initialState = {
  name: '',
  email: '',
  isLoggedIn: false,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: builder => {},
  // builder
  //   .addCase(logIn.pending, (state, action) => {
  //     state.isLoggedIn = false;
  //     state.email = '';
  //     state.name = '';
  //   })
  //   .addCase(logIn.fulfilled, (state, action) => {
  //     state.isLoggedIn = true;
  //     state.email = action.payload.email;
  //     state.name = action.payload.name;
  //   })
  //   .addCase(logIn.rejected, (state, action) => {
  //     state.isLoggedIn = false;
  //     state.email = '';
  //     state.name = '';
  //   })

  //   // .addMatcher(
  //   // 	//한 요청에 여러번 사용되어야 하는 경우 -> switch문에서 break를 적지 않고 처리하는 경우와 같음
  //   // 	action => {},
  //   // 	(state, action) => {}
  //   // )
  //   .addDefaultCase((state, action) => {}),
});

export default userSlice;
