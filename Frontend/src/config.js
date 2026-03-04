// This reads from Vite env variable (set in .env)
// For local dev: VITE_API_URL=http://localhost:3001
// For production: set VITE_API_URL to your Railway backend URL in Vercel dashboard
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default API_URL;
