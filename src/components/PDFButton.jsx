// src/components/PDFButton.jsx
import html2canvas from "html2canvas";
import { PDFDocument, rgb } from "pdf-lib";

const A4 = { w: 595.28, h: 841.89 };
const EXPORT_PX = { w: 2480, h: 3508 };
const TEMPLATE_A4_PX = { w: 794, h: 1123 }; // matches invoice-wrap export width/height
const TEMPLATE_STRIP_PX = { headerH: 132, footerH: 82 }; // from CSS (pdf-template-header/footer)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function encodePublicPath(path) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function extractPitch(raw = "") {
  const match = String(raw).match(/P(\d+(?:[._]\d+)?)/i);
  if (!match) return "";
  return match[1].replace("_", ".");
}

function normalizeBrand(raw = "") {
  const value = String(raw).toLowerCase();
  if (value.includes("leyard")) return "leyard";
  if (value.includes("absen")) return "absen";
  return "lampro";
}

function buildModuleCataloguePath({ displayType, technology, pitch, moduleBrand }) {
  const brand = normalizeBrand(moduleBrand);

  if (displayType === "indoor") {
    if (brand === "leyard") {
      if (technology === "cob") {
        return "Renex Product data sheet/Module Catalogue/Indoor/Leyard/Leyard SV COB 20250812.pdf";
      }
      return "Renex Product data sheet/Module Catalogue/Indoor/Leyard/LUS Series Brochure-INDOOR MODULE SMD&GOB.pdf";
    }

    if (technology === "cob") {
      const cobMap = {
        "1.25": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/COB/LMini (COB) P1.25.pdf",
        "1.53": "Renex Product data sheet/Module Catalogue/Indoor/BAKO/BAKO COB P1.53  Specs File.pdf",
        "1.86": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/COB/(COB) LMini1.8  V1.9 20241021.pdf",
      };
      return cobMap[pitch] || "Renex Product data sheet/Module Catalogue/Indoor/Leyard/Leyard SV COB 20250812.pdf";
    }

    if (technology === "gob") {
      const gobMap = {
        "1.86": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/GOB/LC1.86P GOB specifications.pdf",
      };
      return gobMap[pitch] || "Renex Product data sheet/Module Catalogue/Indoor/Leyard/LUS Series Brochure-INDOOR MODULE SMD&GOB.pdf";
    }

    const indoorSmdMap = {
      "1.25": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/SMD/LC1.25P specifications.pdf",
      "1.86": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/SMD/LC1.86P specifications.pdf",
      "2": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/SMD/LC2P specifications.pdf",
      "2.5": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/SMD/LC2.5P specifications.pdf",
      "3": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/SMD/LC3P specifications.pdf",
      "3.076": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/SMD/LC3.076P specifications.pdf",
      "4": "Renex Product data sheet/Module Catalogue/Indoor/Lampro/SMD/LC4P specifications.pdf",
    };
    return indoorSmdMap[pitch] || "Renex Product data sheet/Module Catalogue/Indoor/Leyard/LUS Series Brochure-INDOOR MODULE SMD&GOB.pdf";
  }

  if (brand === "leyard") {
    return "Renex Product data sheet/Module Catalogue/Outdoor/Leyard/LVS Series - Outdoor Leyard.pdf";
  }

  const outdoorSmdMap = {
    "2.5": "Renex Product data sheet/Module Catalogue/Outdoor/Lampro/LC2.5PO specifications.pdf",
    "3.076": "Renex Product data sheet/Module Catalogue/Outdoor/Lampro/LC3.076PO specifications.pdf",
    "3.91": "Renex Product data sheet/Module Catalogue/Outdoor/Lampro/LR3.91O specifications.pdf",
    "4": "Renex Product data sheet/Module Catalogue/Outdoor/Lampro/LC4PO specifications.pdf",
    "5": "Renex Product data sheet/Module Catalogue/Outdoor/Lampro/LC5PO specifications.pdf",
    "6": "Renex Product data sheet/Module Catalogue/Outdoor/Lampro/LC6PO specifications.pdf",
    "6.67": "Renex Product data sheet/Module Catalogue/Outdoor/Lampro/LC6.667PO specifications.pdf",
    "10": "Renex Product data sheet/Module Catalogue/Outdoor/Lampro/LC10PO specifications.pdf",
  };
  return outdoorSmdMap[pitch] || "Renex Product data sheet/Module Catalogue/Outdoor/Leyard/LVS Series - Outdoor Leyard.pdf";
}

function buildControllerCataloguePath({ displayType, controllerBrand, controllerId }) {
  if (!controllerId) return null;

  if (controllerBrand === "Novastar") {
    const novastarMap = {
      NS_TB1: null,
      NS_TB2: "Renex Product data sheet/Processor and Controller/Novastar/TB2-4G Multimedia Player .pdf",
      NS_TB40: "Renex Product data sheet/Processor and Controller/Novastar/Tb-40.pdf",
      NS_DSP400: "Renex Product data sheet/Processor and Controller/Novastar/dsp-400-pro.pdf",
      NS_DSP600: "Renex Product data sheet/Processor and Controller/Novastar/DSP600-Pro-All-in-One-Controller-Specifications-V1.0.0.pdf",
      NS_DSP1000: "Renex Product data sheet/Processor and Controller/Novastar/DSP1000 Pro.pdf",
      NS_DSP2000: "Renex Product data sheet/Processor and Controller/Novastar/VX2000 Pro Specification.pdf",
    };
    return novastarMap[controllerId] || null;
  }

  const indoorMap = {
    VP210H: "Renex Product data sheet/Processor and Controller/Indoor/HD-VP210H Specification.pdf",
    VP410H: "Renex Product data sheet/Processor and Controller/Indoor/HD-VP410H Specification.pdf",
    VP630: "Renex Product data sheet/Processor and Controller/Indoor/HD-VP630 Specification.pdf",
    VP830: "Renex Product data sheet/Processor and Controller/Indoor/HD-VP830 Specification v2.1.pdf",
    VP1240A: "Renex Product data sheet/Processor and Controller/Indoor/HD-VP1240A Specification v1.2.pdf",
    VP1620S: "Renex Product data sheet/Processor and Controller/Indoor/HD-VP1620S Specification V1.0 (1).pdf",
    VP1640A: "Renex Product data sheet/Processor and Controller/Indoor/HD-VP1640 Specification v3.1.pdf",
    C16L: "Renex Product data sheet/Processor and Controller/Outdoor/hd-c16l-specification-v1.0.pdf",
  };
  const outdoorMap = {
    A3L: "Renex Product data sheet/Processor and Controller/Outdoor/HD-A3L Specification V1.1.pdf",
    A5L: "Renex Product data sheet/Processor and Controller/Outdoor/HD-A5L Specification V1.1.pdf",
    A6L: "Renex Product data sheet/Processor and Controller/Outdoor/HD-A6L Specification V1.4.pdf",
    C16L: "Renex Product data sheet/Processor and Controller/Outdoor/hd-c16l-specification-v1.0.pdf",
  };

  return (displayType === "outdoor" ? outdoorMap : indoorMap)[controllerId] || indoorMap[controllerId] || null;
}

function buildReceivingCardCataloguePath(receivingCardId = "") {
  const map = {
    R712: "Renex Product data sheet/Recieving Card, PSu and structure/HD-R712 Specification V2.1.pdf",
    R732: "Renex Product data sheet/Recieving Card, PSu and structure/HD-R732 Specification V0.1.pdf",
    NS_A5S_16: "Renex Product data sheet/Recieving Card, PSu and structure/Novastar A5s Plus.pdf",
    NS_A5S_26: "Renex Product data sheet/Recieving Card, PSu and structure/Novastar A5s Plus.pdf",
  };
  return map[receivingCardId] || null;
}

function getCataloguePaths(exportData) {
  if (!exportData?.items) return [];

  const displayType = exportData.items.dispType || "indoor";
  const technology = exportData.items.technology || "smd";
  const moduleBrand = exportData.items?.brands?.module || "";
  const controllerBrand = exportData.items?.brands?.controller || "";
  const controllerId = exportData.items.controllerId || "";
  const receivingCardId = exportData.items?.receivingPicked?.id || "";
  const pitch = extractPitch(exportData.model?.id || exportData.model?.name || "");

  const paths = [buildModuleCataloguePath({ displayType, technology, pitch, moduleBrand })];

  if (exportData.items.cabinetEnabled) {
    paths.push("Renex Product data sheet/Cabinet 640 X 480.pdf");
  }

  paths.push(
    buildControllerCataloguePath({ displayType, controllerBrand, controllerId }),
    buildReceivingCardCataloguePath(receivingCardId),
    "Renex Product data sheet/Recieving Card, PSu and structure/power supply.pdf",
    "Renex Product data sheet/Recieving Card, PSu and structure/Frame.pdf"
  );

  return [...new Set(paths.filter(Boolean))];
}

async function appendPdfFromPublic(pdf, relativePath) {
  const response = await fetch("/" + encodePublicPath(relativePath));
  if (!response.ok) {
    throw new Error(`Failed to load catalogue PDF: ${relativePath}`);
  }

  const sourceBytes = await response.arrayBuffer();
  return sourceBytes;
}

export default function PDFButton({
  targetId = "invoice-root",
  targetIds = null,
  filename = "Renex_Quotation.pdf",
  exportData = null,
}) {
  const applyPdfClasses = (el) => {
    el.classList.add("invoice--pdf-scale");
    el.classList.remove("preview-mode");
  };

  const revertPdfClasses = (el) => {
    el.classList.remove("invoice--pdf-scale");
    el.classList.add("preview-mode");
  };

  const renderElementToPngBytes = async (el) => {
    const baseW = el.scrollWidth || el.clientWidth || 794;
    const targetScale = Math.max(1, EXPORT_PX.w / baseW);

    const canvas = await html2canvas(el, {
      scale: targetScale,
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });

    const png = canvas.toDataURL("image/png");
    const bytes = await (await fetch(png)).arrayBuffer();
    return bytes;
  };

  const cropTemplateStrips = async () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/Renex_Invoice.png";

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const { naturalWidth: w, naturalHeight: h } = img;
    const headerCropH = Math.round((h * TEMPLATE_STRIP_PX.headerH) / TEMPLATE_A4_PX.h);
    const footerCropH = Math.round((h * TEMPLATE_STRIP_PX.footerH) / TEMPLATE_A4_PX.h);

    const toPngBytes = async (sx, sy, sw, sh) => {
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      const dataUrl = canvas.toDataURL("image/png");
      return await (await fetch(dataUrl)).arrayBuffer();
    };

    const headerBytes = await toPngBytes(0, 0, w, headerCropH);
    const footerBytes = await toPngBytes(0, h - footerCropH, w, footerCropH);

    return { headerBytes, footerBytes };
  };

  const isFramePdfPath = (relativePath = "") => /(^|[\\/])frame\.pdf$/i.test(String(relativePath));

  const getAppendLayoutMode = (relativePath = "") => {
    // Some vendor/spec PDFs already include their own header/footer near the edges.
    // For those, we crop away the edge areas before fitting, then overlay our strips.
    const p = String(relativePath).toLowerCase();
    if (
      p.includes("module catalogue") ||
      p.includes("processor and controller") ||
      p.includes("recieving card") ||
      p.includes("specifications") ||
      p.includes("cabinet") ||
      p.includes("brochure")
    ) {
      return "crop"; // remove edge headers/footers, then overlay our strips
    }
    return "safe"; // keep content below header/footer
  };

  const appendPlainPdfPages = async (pdf, sourceBytes) => {
    // For PDFs that already include the company header/footer (e.g. Frame.pdf),
    // we keep them as-is but normalize page size to A4.
    const src = await PDFDocument.load(sourceBytes);
    const pageCount = src.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const [embedded] = await pdf.embedPdf(sourceBytes, [i]);
      const { width: pw, height: ph } = embedded.size();

      const scale = Math.min(A4.w / pw, A4.h / ph);
      const drawW = pw * scale;
      const drawH = ph * scale;
      const x = (A4.w - drawW) / 2;
      const y = (A4.h - drawH) / 2;

      const page = pdf.addPage([A4.w, A4.h]);
      page.drawPage(embedded, { x, y, width: drawW, height: drawH });
    }
  };

  const getCropFractions = (relativePath = "") => {
    // Default crop removes typical baked header/footer areas.
    // Some PDFs can have taller bands, but keep behaviour consistent across files.
    const p = String(relativePath).toLowerCase();
    if (p.includes("power supply")) {
      return { top: 0.20, bottom: 0.14 };
    }
    if (p.includes("recieving card")) {
      return { top: 0.18, bottom: 0.12 };
    }
    return { top: 0.14, bottom: 0.10 };
  };

  const appendFramedPdfPages = async (
    pdf,
    sourceBytes,
    { headerImg, footerImg, headerH, footerH, mode = "safe", relativePath = "" }
  ) => {
    const src = await PDFDocument.load(sourceBytes);
    const pageCount = src.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      let embedded;
      let pw; // embedded width
      let ph; // embedded height

      // In crop mode, remove some edge area (where many PDFs put their own headers/footers)
      // so our own header/footer can be overlaid without doubles or content overlap.
      if (mode === "crop") {
        const srcPage = src.getPage(i);
        const srcW = srcPage.getWidth();
        const srcH = srcPage.getHeight();

        const { top: topFrac, bottom: bottomFrac } = getCropFractions(relativePath);
        const cropTop = srcH * topFrac;
        const cropBottom = srcH * bottomFrac;

        try {
          [embedded] = await pdf.embedPdf(sourceBytes, [i], {
            // pdf-lib bounding box uses PDF points with origin at bottom-left
            boundingBox: {
              left: 0,
              bottom: cropBottom,
              right: srcW,
              top: srcH - cropTop,
            },
          });
          // IMPORTANT: after cropping, the embedded page has a NEW size.
          // Use that size for fitting, otherwise we may “shrink” and reveal the baked header/footer again.
          const size = embedded.size();
          pw = size.width;
          ph = size.height;
        } catch {
          // Fallback: if boundingBox is not supported in runtime, embed full page.
          [embedded] = await pdf.embedPdf(sourceBytes, [i]);
          const size = embedded.size();
          pw = size.width;
          ph = size.height;
        }
      } else {
        [embedded] = await pdf.embedPdf(sourceBytes, [i]);
        const size = embedded.size();
        pw = size.width;
        ph = size.height;
      }

      let drawW, drawH, x, y;
      if (mode === "safe") {
        // Keep a safe content area so nothing is hidden under our header/footer strips.
        const safeTop = 14; // pt (extra cushion)
        const safeBottom = 10; // pt
        const availableH = A4.h - headerH - footerH - safeTop - safeBottom;
        const scale = Math.min(A4.w / pw, availableH / ph);
        drawW = pw * scale;
        drawH = ph * scale;
        x = (A4.w - drawW) / 2;
        y = footerH + safeBottom + (availableH - drawH) / 2;
      } else {
        // crop mode: fit into the same safe area, but the embedded page is already cropped
        // so doubles won't show even when we overlay strips.
        const safeTop = 8; // pt
        const safeBottom = 6; // pt
        const availableH = A4.h - headerH - footerH - safeTop - safeBottom;
        const scale = Math.min(A4.w / pw, availableH / ph);
        drawW = pw * scale;
        drawH = ph * scale;
        x = (A4.w - drawW) / 2;
        y = footerH + safeBottom + (availableH - drawH) / 2;
      }

      const page = pdf.addPage([A4.w, A4.h]);

      // content first
      page.drawPage(embedded, { x, y, width: drawW, height: drawH });

      // Extra safety: in crop mode, cover a slightly larger band so any baked
      // header/footer that extends below strips never peeks through (Frame.pdf issue).
      if (mode === "crop") {
        const extraTop = 22; // pt
        const extraBottom = 16; // pt
        page.drawRectangle({
          x: 0,
          y: A4.h - (headerH + extraTop),
          width: A4.w,
          height: headerH + extraTop,
          color: rgb(1, 1, 1),
          opacity: 1,
        });
        page.drawRectangle({
          x: 0,
          y: 0,
          width: A4.w,
          height: footerH + extraBottom,
          color: rgb(1, 1, 1),
          opacity: 1,
        });
      }

      // header/footer on top (cover any source header/footer)
      page.drawImage(headerImg, { x: 0, y: A4.h - headerH, width: A4.w, height: headerH });
      page.drawImage(footerImg, { x: 0, y: 0, width: A4.w, height: footerH });
    }
  };

  const handleDownload = async () => {
    const ids = Array.isArray(targetIds) && targetIds.length ? targetIds : [targetId];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (!els.length) return alert("Invoice root পাওয়া যায়নি!");

    els.forEach(applyPdfClasses);
    await sleep(60);

    try {
      const pdf = await PDFDocument.create();

      for (const el of els) {
        const bytes = await renderElementToPngBytes(el);
        const page = pdf.addPage([A4.w, A4.h]);
        const img = await pdf.embedPng(bytes);
        page.drawImage(img, { x: 0, y: 0, width: A4.w, height: A4.h });
      }

      // Template header/footer for EVERY appended page (catalogue/spec PDFs)
      const { headerBytes, footerBytes } = await cropTemplateStrips();
      const headerImg = await pdf.embedPng(headerBytes);
      const footerImg = await pdf.embedPng(footerBytes);
      const headerH = A4.w * (TEMPLATE_STRIP_PX.headerH / TEMPLATE_A4_PX.w);
      const footerH = A4.w * (TEMPLATE_STRIP_PX.footerH / TEMPLATE_A4_PX.w);

      const cataloguePaths = getCataloguePaths(exportData);
      for (const relativePath of cataloguePaths) {
        try {
          const sourceBytes = await appendPdfFromPublic(pdf, relativePath);
          // ONLY special-case: Frame.pdf already has header/footer baked in.
          // We should NOT overlay our strips, otherwise it becomes double.
          if (isFramePdfPath(relativePath)) {
            await appendPlainPdfPages(pdf, sourceBytes);
          } else {
            // Everything else stays unchanged.
            const mode = getAppendLayoutMode(relativePath);
            await appendFramedPdfPages(pdf, sourceBytes, { headerImg, footerImg, headerH, footerH, mode, relativePath });
          }
        } catch (catalogueError) {
          console.warn(catalogueError);
        }
      }

      const out = await pdf.save();
      const blob = new Blob([out], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error(err);
      alert("PDF তৈরি হয়নি। Console এ error দেখুন।");
    } finally {
      els.forEach(revertPdfClasses);
    }
  };

  return (
    <button onClick={handleDownload} className="btn btn-primary">
      Download Quotation (PDF)
    </button>
  );
}
