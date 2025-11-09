import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { productsAPI, Product, ProductsResponse } from "@/lib/api/products";

export interface ProductsApiState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  meta: {
    page: number;
    pageSize: number;
    total: number;
  } | null;
}

const initialState: ProductsApiState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  meta: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "productsApi/fetchProducts",
  async ({ page = 1, pageSize = 12 }: { page?: number; pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProducts(page, pageSize);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al obtener productos");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "productsApi/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const product = await productsAPI.getProductById(id);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al obtener producto");
    }
  }
);

const productsApiSlice = createSlice({
  name: "productsApi",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductsResponse>) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.meta = action.payload.meta;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Product By ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentProduct } = productsApiSlice.actions;
export default productsApiSlice.reducer;

