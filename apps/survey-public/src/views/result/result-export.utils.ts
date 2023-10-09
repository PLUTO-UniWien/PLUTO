import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

export async function generatePDFExport(content: HTMLElement) {
  const scale = 4;
  const fileName = 'pluto-results.pdf';
  try {
    // Ensure web fonts are loaded
    if ('fonts' in document) {
      await document.fonts.ready;
    }

    const canvas = await domtoimage.toCanvas(content, { scale });

    // Initialize a new PDF file
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
    const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);

    // Adjust the dimensions for the scaled canvas
    const adjustedWidth = pdfWidth;
    const adjustedHeight = (canvas.height / canvas.width) * adjustedWidth;

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, adjustedWidth, adjustedHeight);

    // Save the generated PDF to the user's computer
    pdf.save(fileName);
  } catch (error) {
    console.error(error);
  }
}
