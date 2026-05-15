/**
 * React entry: mounts the Vintage Press app into `#root`.
 * Included from `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/vintage-press/VintagePressApp";
import "./index.css";

const elem = document.getElementById("root");
if (!elem) throw new Error("Missing #root");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.hot) {
  let root = import.meta.hot.data.root as ReturnType<typeof createRoot> | undefined;
  if (!root) {
    root = createRoot(elem);
    import.meta.hot.data.root = root;
  }
  root.render(app);
} else {
  createRoot(elem).render(app);
}
