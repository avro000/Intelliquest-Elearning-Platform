// Central API Configuration
// Defaults to the live Render deployment if VITE_BACKEND_URL is not set
export const API_BASE_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string) || "https://intelliquest-elearning-platform.onrender.com";

export const CHATBOT_BASE_URL: string =
  (import.meta.env.VITE_CHATBOT_URL as string) || "https://intelliquest-chatbot.onrender.com";
