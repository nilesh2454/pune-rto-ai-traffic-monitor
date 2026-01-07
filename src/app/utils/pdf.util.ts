import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('Element not found');
  }

  // Clone the element to capture off-screen with controlled width
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.padding = '16px';
  clone.style.boxSizing = 'border-box';
  clone.style.width = '800px'; // fixed width for consistent layout
  clone.style.maxWidth = '800px';
  clone.style.background = '#ffffff';
  document.body.appendChild(clone);

  await new Promise(resolve => setTimeout(resolve, 150));

  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowHeight: clone.scrollHeight,
    height: clone.scrollHeight,
    scrollY: 0,
    scrollX: 0,
  });

  document.body.removeChild(clone);

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const imgData = canvas.toDataURL('image/png');

  let position = margin;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  // Add additional pages by shifting the image up so sections appear on new pages
  while (heightLeft > 0) {
    pdf.addPage();
    position = margin - (imgHeight - heightLeft);
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(filename);
};

export const generateChallanFilename = (plateNumber: string): string => {
  const sanitizedPlate = plateNumber.replace(/\s+/g, '_');
  return `Pune_RTO_Challan_${sanitizedPlate}.pdf`;
};
