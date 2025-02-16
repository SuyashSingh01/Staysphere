import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { ListingsProvider } from "./context/ListingsContext";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ListingsProvider>
          <BrowserRouter>
            <App />
            <ToastContainer autoClose={2000} transition={Slide} />
          </BrowserRouter>
        </ListingsProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
