import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "../../models/IUser";
import AuthService from "../../service/AuthService";


interface UserState {
  user: IUser
  isAuth: boolean
  isLoading: boolean
};

const initialState: UserState = {
  user: {
    email: '',
    isActivated: false,
    id: '',
  },
  isAuth: false,
  isLoading: false,
}

export const fetchLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }: any) => {
    try {
      const response = await AuthService.login({ email, password });
      localStorage.setItem('token', response.data.accessToken);
      return response.data.user;
    } catch (e: any) {
      throw new Error('это ошибка из функции логин');
    }
  });

export const fetchRegister = createAsyncThunk(
  'user/register',
  async ({ email, password }: any) => {
    try {
      const response = await AuthService.register({ email, password });
      localStorage.setItem('token', response.data.accessToken);
      return response.data.user;
    } catch (e: any) {
      throw new Error('это ошибка из функции регистрации');
    }
  });

export const fetchLogout = createAsyncThunk(
  'user/logout',
  async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
    } catch (e: any) {
      throw new Error('это ошибка из функции регистрации');
    }
  });

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  },

  extraReducers: (builder) => {
    builder.addCase(fetchLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchLogin.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error.message);
    });

    builder.addCase(fetchRegister.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchRegister.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error.message);
    });

    builder.addCase(fetchLogout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLogout.fulfilled, (state) => {
      state.user = {
        email: '',
        isActivated: false,
        id: '',
      };
      state.isLoading = false;
    });
    builder.addCase(fetchLogout.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error.message);
    });
  },

});

export default userSlice.reducer;


//   async checkAuth() {
//     this.setIsLoading(true);
//     try {
//       const response = await axios.get<AuthResponse>(`${API_URL}/user/refresh`);
//       localStorage.setItem('token', response.data.accessToken);
//       this.setAuth(true);
//       this.setUser(response.data.user);
//     } catch (e: any) {
//       console.log(e.response?.data?.message);
//     } finally {
//       this.setIsLoading(false);
//     }
//   };

