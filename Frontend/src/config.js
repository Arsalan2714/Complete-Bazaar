// This reads from Vite env variable (set in .env)
// For local dev: VITE_API_URL=http://localhost:3001
// For production: set VITE_API_URL to your Railway backend URL in Vercel dashboard

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3001" : "");

if (typeof window !== "undefined") {
  if (!API_URL && !import.meta.env.DEV) {
    console.error("CRITICAL: VITE_API_URL is missing in production environment!");
  } else {
    console.log(`Connected to Backend at: ${API_URL || "Local fallback"}`);
  }
}

export default API_URL;
