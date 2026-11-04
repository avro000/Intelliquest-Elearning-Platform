import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/Sidebar/theme-provider.tsx'
import { AuthProvider } from './AuthContext'
import axios from 'axios'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Production URL routing
const PROD_BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || "https://intelliquest-elearning-platform.onrender.com";
const PROD_CHATBOT_URL = (import.meta.env.VITE_CHATBOT_URL as string) || "https://intelliquest-chatbot.onrender.com";

// Monkey-patch window.fetch to route localhost to production server when deployed
const originalFetch = window.fetch;
window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let resolvedInput = input;
  if (typeof input === 'string') {
    if (input.includes('http://localhost:9092')) {
      resolvedInput = input.replace('http://localhost:9092', PROD_BACKEND_URL);
    } else if (input.includes('http://localhost:5000')) {
      resolvedInput = input.replace('http://localhost:5000', PROD_CHATBOT_URL);
    }
  }
  return originalFetch.call(this, resolvedInput, init);
};

// Configure axios interceptor for production URLs and bearer auth
axios.interceptors.request.use((config) => {
  if (config.url) {
    if (config.url.includes('http://localhost:9092')) {
      config.url = config.url.replace('http://localhost:9092', PROD_BACKEND_URL);
    } else if (config.url.includes('http://localhost:5000')) {
      config.url = config.url.replace('http://localhost:5000', PROD_CHATBOT_URL);
    }
  }
  if (config.baseURL) {
    if (config.baseURL.includes('http://localhost:9092')) {
      config.baseURL = config.baseURL.replace('http://localhost:9092', PROD_BACKEND_URL);
    }
  }

  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </ThemeProvider>
)
