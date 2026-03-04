import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
  products: [],
  isLoading: false,
  errorMessage: [],
};

const fetchSellerProdusts = createAsyncThunk(
  "seller/fetchSellerProdusts",
  async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/api/seller/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await response.json();
    if (response.status === 200) {
      return body;
    } else {
      throw new Error(body.error);
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
    },
    updateProduct: (state, action) => {
      state.products = state.products.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSellerProdusts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSellerProdusts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchSellerProdusts.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = [action.error.message];
    });
  },
});

export { fetchSellerProdusts };
export const { setProducts, deleteProduct } = sellerSlice.actions;
export default sellerSlice.reducer;