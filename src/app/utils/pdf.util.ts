import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('Element not found');
  }

  // Clone the element to capture off-screen
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = element.offsetWidth + 'px';
  clone.style.height = 'auto';
  clone.style.overflow = 'visible';
  clone.style.maxHeight = 'none';
  document.body.appendChild(clone);

  await new Promise(resolve => setTimeout(resolve, 100));

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

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
};

export const generateChallanFilename = (plateNumber: string): string => {
  const sanitizedPlate = plateNumber.replace(/\s+/g, '_');
  return `Pune_RTO_Challan_${sanitizedPlate}.pdf`;
};
