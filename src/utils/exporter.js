import { toBlob, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Wait for fonts and images inside an element to settle before rasterizing.
 */
async function prepareNodeForExport() {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
}

/**
 * Export a single slide DOM node as a PNG file.
 * @param {HTMLElement} node
 * @param {string} filename
 * @param {number} pixelRatio
 */
export async function exportSinglePng(node, filename = 'poster-made-slide.png', pixelRatio = 1) {
  if (!node) throw new Error('No slide element found to export.');
  await prepareNodeForExport();

  const dataUrl = await toPng(node, {
    pixelRatio,
    cacheBust: true,
    skipAutoScale: true,
  });

  saveAs(dataUrl, filename);
}

/**
 * Export all slides as a single ZIP archive of PNGs.
 * @param {HTMLElement[]} nodes
 * @param {string} baseName
 * @param {number} pixelRatio
 * @param {(progress: number) => void} onProgress
 */
export async function exportAllZip(
  nodes,
  baseName = 'poster-made-carousel',
  pixelRatio = 1,
  onProgress
) {
  if (!nodes || nodes.length === 0) throw new Error('No slides to export.');
  await prepareNodeForExport();

  const zip = new JSZip();

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (!node) continue;

    const blob = await toBlob(node, {
      pixelRatio,
      cacheBust: true,
      skipAutoScale: true,
    });

    if (blob) {
      const num = String(i + 1).padStart(2, '0');
      zip.file(`slide-${num}.png`, blob);
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / nodes.length) * 100));
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${baseName}.zip`);
}

/**
 * Export all slides as a multi-page LinkedIn-ready PDF.
 * @param {HTMLElement[]} nodes
 * @param {{ width: number, height: number }} aspectRatio
 * @param {string} filename
 * @param {number} pixelRatio
 * @param {(progress: number) => void} onProgress
 */
export async function exportMultiPagePdf(
  nodes,
  aspectRatio,
  filename = 'poster-made-carousel.pdf',
  pixelRatio = 1,
  onProgress
) {
  if (!nodes || nodes.length === 0) throw new Error('No slides to export.');
  await prepareNodeForExport();

  const { width, height } = aspectRatio;
  const orientation = width > height ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling'],
  });

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (!node) continue;

    const dataUrl = await toPng(node, {
      pixelRatio,
      cacheBust: true,
      skipAutoScale: true,
    });

    if (i > 0) {
      pdf.addPage([width, height], orientation);
    }

    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height, undefined, 'FAST');

    if (onProgress) {
      onProgress(Math.round(((i + 1) / nodes.length) * 100));
    }
  }

  pdf.save(filename);
}
