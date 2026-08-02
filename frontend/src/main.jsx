import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './index.css';
import "react-phone-number-input/style.css";
import { CurrencyProvider } from "./context/CurrencyContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CurrencyProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#161616",
                  color: "#F7F5F0",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: { primary: "#2D6A4F", secondary: "#F7F5F0" },
                },
                error: {
                  iconTheme: { primary: "#A6303C", secondary: "#F7F5F0" },
                },
              }}
            />
          </CurrencyProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
