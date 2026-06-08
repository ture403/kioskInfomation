import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/font.css";
import "./assets/styles/variable.css";
import "./assets/styles/public.css";
import "./assets/styles/admin.css";
import "./index.css";
import App from "./App.jsx";
import "./utils/ghc_whGlobal.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
