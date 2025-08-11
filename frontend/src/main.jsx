
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";
import { UIProvider } from "./context/UIContext";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <UIProvider>
      <App />
    </UIProvider>
  </Provider>
);
