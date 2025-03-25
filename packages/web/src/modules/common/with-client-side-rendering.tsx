import React, { type ComponentType, useEffect, useState } from "react";

/**
 * Higher Order Component that prevents hydration errors by only rendering
 * the wrapped component on the client side. Shows a loading component
 * during server-side rendering and initial client load.
 *
 * @template P - The props type of the wrapped component
 * @template R - The ref type of the wrapped component
 * @param {ComponentType<P>} WrappedComponent - The component to wrap
 * @param {ComponentType} [LoadingComponent] - Optional loading component to show during SSR
 * @returns {ComponentType<P>} A new component that only renders on the client
 *
 * @example
 * const ClientSideComponent = withClientSideRendering(MyComponent);
 * // With custom loading component:
 * const ClientSideComponent = withClientSideRendering(MyComponent, LoadingSpinner);
 */
export default function withClientSideRendering<P extends object>(
  WrappedComponent: ComponentType<P>,
  LoadingComponent: ComponentType = () => <div>Loading...</div>,
) {
  const WithClientSideRenderingComponent = (props: P) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return <LoadingComponent />;
    }

    return <WrappedComponent {...props} />;
  };

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithClientSideRenderingComponent.displayName = `WithClientSideRendering(${wrappedComponentName})`;

  return WithClientSideRenderingComponent;
}
