import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { favoritesAPI, Favorite } from "@/lib/api/favorites";

export interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await favoritesAPI.getFavorites();
      return favorites;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al obtener favoritos");
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (productId: string, { rejectWithValue }) => {
    try {
      const favorite = await favoritesAPI.addFavorite(productId);
      // Necesitamos obtener el producto completo, pero por ahora retornamos el favorite
      // En una implementación real, podrías hacer otra petición para obtener el producto
      return { productId, favorite };
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al agregar favorito");
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (productId: string, { rejectWithValue }) => {
    try {
      await favoritesAPI.removeFavorite(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al eliminar favorito");
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Favorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Favorite[]>) => {
        state.isLoading = false;
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add Favorite
    builder
      .addCase(addFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state) => {
        // No actualizamos el estado aquí, se recargará con fetchFavorites
        state.error = null;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Remove Favorite
    builder
      .addCase(removeFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.favorites = state.favorites.filter(
          (fav) => fav.productId !== action.payload
        );
        state.error = null;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;

