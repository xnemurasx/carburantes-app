// Punto de entrada de la aplicación React.
// Monta el componente raíz en #root. En desarrollo, StrictMode ayuda a detectar efectos secundarios y patrones antipáticos.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Renderizamos el componente principal de la app */}
    <App />
  </React.StrictMode>
);
