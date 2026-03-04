import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminToken: localStorage.getItem("adminToken") || null,
    stats: null,
    users: [],
    usersMeta: { total: 0, pages: 1 },
    products: [],
    productsMeta: { total: 0, pages: 1 },
    orders: [],
    ordersMeta: { total: 0, pages: 1 },
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminLogin: (state, action) => {
            state.adminToken = action.payload.token;
            localStorage.setItem("adminToken", action.payload.token);
        },
        adminLogout: (state) => {
            state.adminToken = null;
            state.stats = null;
            localStorage.removeItem("adminToken");
        },
        setStats: (state, action) => { state.stats = action.payload; },
        setUsers: (state, action) => {
            state.users = action.payload.users;
            state.usersMeta = { total: action.payload.total, pages: action.payload.pages };
        },
        deleteUserLocal: (state, action) => {
            state.users = state.users.filter((u) => u._id !== action.payload);
        },
        setProducts: (state, action) => {
            state.products = action.payload.products;
            state.productsMeta = { total: action.payload.total, pages: action.payload.pages };
        },
        deleteProductLocal: (state, action) => {
            state.products = state.products.filter((p) => p._id !== action.payload);
        },
        setOrders: (state, action) => {
            state.orders = action.payload.orders;
            state.ordersMeta = { total: action.payload.total, pages: action.payload.pages };
        },
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const o = state.orders.find((o) => o._id === id);
            if (o) o.status = status;
        },
        setLoading: (state, action) => { state.loading = action.payload; },
        setError: (state, action) => { state.error = action.payload; },
    },
});

export const {
    adminLogin, adminLogout,
    setStats, setUsers, deleteUserLocal,
    setProducts, deleteProductLocal,
    setOrders, updateOrderStatus,
    setLoading, setError,
} = adminSlice.actions;
export default adminSlice.reducer;
