import { useState, useCallback } from "react";
import { toPng, toJpeg, toSvg, toBlob, toCanvas, toPixelData } from "html-to-image";

type ImageType = "png" | "jpeg" | "svg" | "blob" | "canvas" | "pixelData";
type ScaleOption = number;
type QualityOption = number;
type BackgroundColorOption = string;
type WidthOption = number;
type HeightOption = number;
type StyleOption = object;
type FilterOption = (domNode: HTMLElement) => boolean;
type CacheOption = boolean;

export interface ScreenshotOptions {
  type?: ImageType;
  scale?: ScaleOption;
  quality?: QualityOption;
  backgroundColor?: BackgroundColorOption;
  width?: WidthOption;
  height?: HeightOption;
  style?: StyleOption;
  filter?: FilterOption;
  cacheBust?: CacheOption;
  includeQueryParams?: boolean;
  filename?: string;
}

export interface ScreenshotResult {
  dataUrl: string | null;
  blob: Blob | null;
  canvas: HTMLCanvasElement | null;
  pixelData: Uint8ClampedArray | null;
  error: Error | null;
}

export interface UseScreenshotReturn {
  capture: (element: HTMLElement | null, options?: ScreenshotOptions) => Promise<ScreenshotResult>;
  captureByRef: <T extends HTMLElement>(
    ref: React.RefObject<T>,
    options?: ScreenshotOptions,
  ) => Promise<ScreenshotResult>;
  isCapturing: boolean;
  lastCapture: ScreenshotResult | null;
  download: (capture?: ScreenshotResult, filename?: string) => void;
}

const defaultOptions: ScreenshotOptions = {
  type: "png",
  scale: 1,
  quality: 0.92,
  backgroundColor: "white",
  includeQueryParams: false,
  cacheBust: true,
};

/**
 * React hook for capturing screenshots of DOM elements with high quality
 *
 * @returns {UseScreenshotReturn} Screenshot controls and latest capture
 *
 * @example
 * ```tsx
 * const { capture, captureByRef, isCapturing, lastCapture, download } = useScreenshot();
 * const elementRef = useRef<HTMLDivElement>(null);
 *
 * const handleCapture = async () => {
 *   const result = await captureByRef(elementRef);
 *   if (!result.error) {
 *     download(result, 'my-screenshot.png');
 *   }
 * };
 *
 * return (
 *   <>
 *     <div ref={elementRef}>Content to capture</div>
 *     <button onClick={handleCapture} disabled={isCapturing}>
 *       {isCapturing ? 'Capturing...' : 'Capture Screenshot'}
 *     </button>
 *   </>
 * );
 * ```
 */
export const useScreenshot = (): UseScreenshotReturn => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [lastCapture, setLastCapture] = useState<ScreenshotResult | null>(null);

  // Create a default error result
  const createErrorResult = useCallback(
    (error: Error): ScreenshotResult => ({
      dataUrl: null,
      blob: null,
      canvas: null,
      pixelData: null,
      error,
    }),
    [],
  );

  // Create a success result
  const createSuccessResult = useCallback(
    (data: {
      dataUrl?: string;
      blob?: Blob;
      canvas?: HTMLCanvasElement;
      pixelData?: Uint8ClampedArray;
    }): ScreenshotResult => ({
      dataUrl: data.dataUrl || null,
      blob: data.blob || null,
      canvas: data.canvas || null,
      pixelData: data.pixelData || null,
      error: null,
    }),
    [],
  );

  // Get the appropriate conversion function based on the type
  const getConverterByType = useCallback((type: ImageType) => {
    switch (type) {
      case "png":
        return toPng;
      case "jpeg":
        return toJpeg;
      case "svg":
        return toSvg;
      case "blob":
        return toBlob;
      case "canvas":
        return toCanvas;
      case "pixelData":
        return toPixelData;
      default:
        return toPng;
    }
  }, []);

  // Capture function that handles different types of captures
  const capture = useCallback(
    async (
      element: HTMLElement | null,
      userOptions?: ScreenshotOptions,
    ): Promise<ScreenshotResult> => {
      if (!element) {
        const error = new Error("Element to capture is not provided or is null");
        return createErrorResult(error);
      }

      try {
        setIsCapturing(true);
        const options = { ...defaultOptions, ...userOptions };
        const { type = "png" } = options;
        const converter = getConverterByType(type);

        // Convert html-to-image options to the expected format
        const converterOptions = {
          quality: options.quality,
          backgroundColor: options.backgroundColor,
          width: options.width,
          height: options.height,
          style: options.style,
          filter: options.filter,
          pixelRatio: options.scale,
          cacheBust: options.cacheBust,
        };

        let result: ScreenshotResult;

        if (type === "blob") {
          const blob = await toBlob(element, converterOptions);
          if (!blob) throw new Error("Failed to convert element to blob");

          const dataUrl = URL.createObjectURL(blob);
          result = createSuccessResult({ dataUrl, blob });
        } else if (type === "canvas") {
          const canvas = await toCanvas(element, converterOptions);
          if (!canvas) throw new Error("Failed to convert element to canvas");

          // Use a separate variable to determine the image type for toDataURL
          // This avoids the unintentional type comparison lint error
          const mimeType = options.type === "jpeg" ? "image/jpeg" : "image/png";
          const dataUrl = canvas.toDataURL(mimeType, options.quality);
          result = createSuccessResult({ dataUrl, canvas });
        } else if (type === "pixelData") {
          const pixelData = await toPixelData(element, converterOptions);
          result = createSuccessResult({ pixelData });
        } else {
          // For regular data URLs (png, jpeg, svg)
          const dataUrl = (await converter(element, converterOptions)) as string;
          result = createSuccessResult({ dataUrl });
        }

        setLastCapture(result);
        return result;
      } catch (error) {
        const errorResult = createErrorResult(
          error instanceof Error ? error : new Error(String(error)),
        );
        setLastCapture(errorResult);
        return errorResult;
      } finally {
        setIsCapturing(false);
      }
    },
    [createErrorResult, createSuccessResult, getConverterByType],
  );

  // Capture by ref convenience method
  const captureByRef = useCallback(
    <T extends HTMLElement>(
      ref: React.RefObject<T>,
      options?: ScreenshotOptions,
    ): Promise<ScreenshotResult> => {
      return capture(ref.current, options);
    },
    [capture],
  );

  // Download the captured image
  const download = useCallback(
    (capture?: ScreenshotResult | null, filename?: string): void => {
      const captureToUse = capture || lastCapture;
      if (!captureToUse || captureToUse.error || !captureToUse.dataUrl) {
        console.error("No valid capture to download", captureToUse?.error);
        return;
      }

      const link = document.createElement("a");
      link.download = filename || "screenshot.png";
      link.href = captureToUse.dataUrl;
      link.click();
    },
    [lastCapture],
  );

  return {
    capture,
    captureByRef,
    isCapturing,
    lastCapture,
    download,
  };
};

export default useScreenshot;
