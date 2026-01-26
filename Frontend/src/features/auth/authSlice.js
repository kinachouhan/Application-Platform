import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;


export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Login failed");
      }

      return data;
    } catch {
      return thunkAPI.rejectWithValue("Server error");
    }
  }
);


export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Registration failed"
        );
      }

      return data;
    } catch {
      return thunkAPI.rejectWithValue("Server error");
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      return true;
    } catch {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);


export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue({
          status: res.status,
          message: data.message,
        });
      }

      return data;
    } catch {
      return thunkAPI.rejectWithValue({
        status: 500,
        message: "Server error",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    isAuthenticated: false,
    isBlocked: false,

    authLoading: false,
    actionLoading: false,

    isError: false,
    message: "",
  },

  reducers: {
    resetAuthState: (state) => {
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.actionLoading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        const user = action.payload?.user || action.payload;

        if (user?.isBlocked) {
          state.user = null;
          state.isAuthenticated = false;
          state.isBlocked = true;
        } else {
          state.user = user;
          state.isAuthenticated = true;
          state.isBlocked = false;
        }

        state.actionLoading = false;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.actionLoading = true;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        const user = action.payload?.user || action.payload;

        state.user = user;
        state.isAuthenticated = true;
        state.isBlocked = false;
        state.actionLoading = false;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

     
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isBlocked = false;
      })

      .addCase(fetchMe.pending, (state) => {
        state.authLoading = true;
      })

      .addCase(fetchMe.fulfilled, (state, action) => {
        const user = action.payload?.user || action.payload;

        if (user?.isBlocked) {
          state.user = null;
          state.isAuthenticated = false;
          state.isBlocked = true;
        } else {
          state.user = user;
          state.isAuthenticated = true;
          state.isBlocked = false;
        }

        state.authLoading = false;
      })

      .addCase(fetchMe.rejected, (state, action) => {
        if (action.payload?.status === 403) {
          state.isBlocked = true;
        }

        state.user = null;
        state.isAuthenticated = false;
        state.authLoading = false;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
