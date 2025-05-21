import { useRef, useState } from "react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import useScreenshot from "@/modules/common/use-screenshot";
import { trackPdfExport } from "@/modules/analytics/umami/service";

type PdfExportOptions = {
  /**
   * Custom filename (optional)
   */
  filename?: string;
  /**
   * Minimum export duration in milliseconds to prevent UI flashing
   */
  minDuration?: number;
};

/**
 * Hook for exporting HTML content to PDF with optimized file size
 */
export function usePdfExport(options: PdfExportOptions = {}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { capture, isCapturing } = useScreenshot();
  const [isExporting, setIsExporting] = useState(false);
  const minDuration = options.minDuration ?? 500; // Default to 500ms minimum duration

  /**
   * Export the captured content to PDF
   */
  const exportToPdf = async (submissionId: number) => {
    const startTime = Date.now();
    setIsExporting(true);

    try {
      // Check if content ref is available
      if (!contentRef.current) {
        toast.error("Failed to capture content", {
          description: "The content to export could not be found",
        });
        return;
      }

      // Display loading toast and store its ID
      const loadingToastId = toast.loading("Generating PDF document...");

      // Capture the content with balanced settings for quality and filesize
      const result = await capture(contentRef.current, {
        scale: 3,
        quality: 1.0,
        backgroundColor: "#ffffff",
        type: "jpeg",
        skipFonts: true,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (!result.dataUrl) {
        throw new Error("Failed to generate image data");
      }

      // Get image from data URL
      const img = new Image();
      img.src = result.dataUrl;

      // Generate default filename with date in case it's needed later
      const date = new Date().toISOString().split("T")[0];
      let filename = options.filename || `assessment-results-${date}.pdf`;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            // Calculate dimensions
            const imgWidth = img.width;
            const imgHeight = img.height;
            const ratio = imgWidth / imgHeight;

            // Create PDF with default compression
            const pdf = new jsPDF({
              orientation: ratio < 0.7 ? "portrait" : "landscape",
              unit: "pt",
              format: "a4",
            });

            // Calculate dimensions to fit the image properly on the page
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Leave some margins
            const margin = 10;
            const maxWidth = pageWidth - margin * 2;
            const maxHeight = pageHeight - margin * 2;

            // Calculate the dimensions to maintain aspect ratio
            let finalWidth: number;
            let finalHeight: number;

            if (imgWidth / imgHeight > pageWidth / pageHeight) {
              // Image is wider than the page ratio
              finalWidth = maxWidth;
              finalHeight = finalWidth / ratio;
            } else {
              // Image is taller than the page ratio
              finalHeight = maxHeight;
              finalWidth = finalHeight * ratio;
            }

            // Center the image on the page
            const xPos = (pageWidth - finalWidth) / 2;
            const yPos = (pageHeight - finalHeight) / 2;

            // Add image with proper scaling and positioning
            pdf.addImage(result.dataUrl as string, "JPEG", xPos, yPos, finalWidth, finalHeight);

            // Update filename if needed
            filename = options.filename || `assessment-results-${date}.pdf`;

            // Save PDF
            pdf.save(filename);

            resolve();
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      // Track successful PDF export event to analytics
      await trackPdfExport(submissionId, "success");

      // Ensure minimum duration for better UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Show success message after minimum duration
      toast.success(`PDF saved as ${filename}`);
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        toast.error(`Failed to export PDF: ${error.message}`);
      } else {
        toast.error("Failed to export PDF");
      }

      // Track failed PDF export event to analytics
      await trackPdfExport(submissionId, "failure");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    contentRef,
    isExporting: isExporting || isCapturing,
    exportToPdf,
  };
}

export default usePdfExport;
