import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import Config from 'react-native-config';

export const logIn = createAsyncThunk('user/logIn', async (data, thunkAPI) => {
  // createAsyncThunk에서는 try catch로 감싸지 않는게 좋음 그래야 에러를 확인할 수 있음
  // pending, fufilled, rejected

  const response = await axios.post(`${Config.API_URL}/login`, {
    email: data.email,
    password: data.password,
  });

  return response.data;
});
