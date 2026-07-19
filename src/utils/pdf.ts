import { PDFDocument } from "pdf-lib";

export async function generatePdfFromImages(
  imageUrls: string[],
  fileName: string = "images.pdf"
) {
  const pdfDoc = await PDFDocument.create();

  const PAGE_WIDTH = 595; // A4
  const PAGE_HEIGHT = 842;

  for (const url of imageUrls) {
    const response = await fetch(url);

    if (!response.ok) continue;

    const bytes = await response.arrayBuffer();

    let image;

    if (url.toLowerCase().includes(".png")) {
      image = await pdfDoc.embedPng(bytes);
    } else {
      image = await pdfDoc.embedJpg(bytes);
    }

    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    const { width, height } = image.scale(1);

    const maxWidth = PAGE_WIDTH - 40;
    const maxHeight = PAGE_HEIGHT - 40;

    const scale = Math.min(
      maxWidth / width,
      maxHeight / height
    );

    page.drawImage(image, {
      x: (PAGE_WIDTH - width * scale) / 2,
      y: (PAGE_HEIGHT - height * scale) / 2,
      width: width * scale,
      height: height * scale,
    });
  }

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], {
    type: "application/pdf",
  });

  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(blobUrl);
}