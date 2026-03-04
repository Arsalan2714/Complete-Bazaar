import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
  products: [],
  cart: [],
  wishlist: [],
  orders: [],
  isLoading: false,
  errorMessage: [],
};

const fetchCustomerData = createAsyncThunk(
  "customer/fetchCustomerData",
  async () => {
    const token = localStorage.getItem("token");

    // If not logged in, fetch only products from public API
    if (!token) {
      const response = await fetch("http://localhost:3001/api/products");
      const body = await response.json();
      if (response.status === 200) {
        return { products: body.products, cart: [], wishlist: [], orders: [] };
      } else {
        throw new Error("Failed to load products");
      }
    }

    // If logged in, fetch full customer data
    const response = await fetch("http://localhost:3001/api/customer/data", {
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

export const addToCart = createAsyncThunk(
  "customer/addToCart",
  async (productId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/customer/cart/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

export const removeFromCart = createAsyncThunk(
  "customer/removeFromCart",
  async (productId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/customer/cart/${productId}`, {
      method: "DELETE",
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

export const placeOrder = createAsyncThunk(
  "customer/placeOrder",
  async ({ paymentMethod, shippingAddress }, { dispatch }) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/api/customer/order", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentMethod, shippingAddress }),
    });
    const body = await response.json();
    if (response.status === 200) {
      await dispatch(fetchCustomerData());
      return body;
    } else {
      throw new Error(body.error);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "customer/cancelOrder",
  async (orderId, { dispatch }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/customer/order/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await response.json();
    if (response.status === 200) {
      await dispatch(fetchCustomerData());
      return body;
    } else {
      throw new Error(body.error);
    }
  }
);

export const removeOrder = createAsyncThunk(
  "customer/removeOrder",
  async (orderId, { dispatch }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/customer/order/${orderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await response.json();
    if (response.status === 200) {
      await dispatch(fetchCustomerData());
      return body;
    } else {
      throw new Error(body.error);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "customer/toggleWishlist",
  async (productId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/customer/wishlist/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCustomerData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCustomerData.fulfilled, (state, action) => {
      state.isLoading = false;
      const { products, cart, wishlist, orders, firstName } = action.payload;
      state.products = products;
      state.cart = cart;
      state.wishlist = wishlist || [];
      state.orders = orders;
      // Persist firstName so navbar/profile can use it
      if (firstName) {
        localStorage.setItem("firstName", firstName);
      }
    });
    builder.addCase(fetchCustomerData.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = [action.error.message];
    });
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cart = action.payload;
      state.cartError = "";
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.cartError = action.error.message;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.cart = action.payload;
    });
    builder.addCase(removeFromCart.rejected, (state) => {
      // silently fail - don't show full-page error for cart actions
    });
    builder.addCase(placeOrder.rejected, (state, action) => {
      state.errorMessage = [action.error.message];
    });
    builder.addCase(toggleWishlist.fulfilled, (state, action) => {
      state.wishlist = action.payload;
    });
    builder.addCase(toggleWishlist.rejected, (state) => {
      // silently fail - don't show full-page error for wishlist actions
    });
  },
});

export { fetchCustomerData };
export default customerSlice.reducer;
