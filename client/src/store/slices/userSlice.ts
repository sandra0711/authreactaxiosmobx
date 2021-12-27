import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
  'user/register',
  async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      console.log('я здесь');

    } catch (e: any) {
      throw new Error('это ошибка из функции регистрации');
    }
  });

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;

    },

    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },

    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
  // extraReducers: {
  //   [fetchLogin.fulfilled]: (state: UserState, action: PayloadAction<IUser>) => {
  //     state.isLoading = false;
  //     state.user = action.payload;
  //   },
  //   [fetchLogin.pending]: (state: UserState) => {
  //     state.isLoading = true;

  //   },
  //   [fetchLogin.rejected]: (state: UserState, action: PayloadAction<string>) => {
  //     console.log(action.payload);

  //   },
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
      console.log(action);
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
      console.log(action.payload);
    });
  },

});

export const { setUser, setAuth, setIsLoading } = userSlice.actions;
export default userSlice.reducer;


//

//   async register(email: string, password: string) {
//     try {
//       const response = await AuthService.register(email, password);
//       localStorage.setItem('token', response.data.accessToken);
//       this.setAuth(true);
//       this.setUser(response.data.user);
//     } catch (e: any) {
//       console.log(e.response?.data?.message);
//     }
//   };

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

//   async logout() {
//     try {
//       await AuthService.logout();
//       localStorage.removeItem('token');
//       this.setAuth(false);
//       this.setUser({} as IUser);
//     } catch (e: any) {
//       console.log(e.response?.data?.message);
//     }
//   };
// }
