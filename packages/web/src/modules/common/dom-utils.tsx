import { createRoot } from "react-dom/client";
import type { ReactNode } from "react";
import React, { StrictMode } from "react";

export function mountReactComponent(component: ReactNode, targetElement: HTMLElement) {
  // Create container for the React component
  const container = document.createElement("div");

  // Append container to target element
  targetElement.appendChild(container);

  // Create root and render
  const root = createRoot(container);
  root.render(<StrictMode>{component}</StrictMode>);

  // Return cleanup function
  return () => {
    root.unmount();
    container.remove();
  };
}
