
import React from "react";
import ReactDOM from "react-dom/client";

// استيراد المكوّن الجذر للتطبيق
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);