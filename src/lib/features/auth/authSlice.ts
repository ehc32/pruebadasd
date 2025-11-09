import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authAPI, RegisterRequest, LoginRequest, User } from "@/lib/api/auth";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Get initial state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    };
  }

  const token = localStorage.getItem("auth_token");
  return {
    user: null,
    token,
    isLoading: false,
    error: null,
    isAuthenticated: !!token,
  };
};

const initialState: AuthState = getInitialState();

// Async thunks
export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data);
      authAPI.setToken(response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al registrarse");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(data);
      authAPI.setToken(response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al iniciar sesión");
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authAPI.getMe();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al obtener usuario");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  authAPI.removeToken();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Token is already saved in localStorage by authAPI
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Token is already saved in localStorage by authAPI
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
      });

    // Get Me
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        authAPI.removeToken();
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        // Token is already removed from localStorage by authAPI
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

