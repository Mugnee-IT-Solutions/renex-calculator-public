export async function makeTransparentWatermarkDataUrl({
  src = "/renex_watermark.png",
  whiteThreshold = 248,
  alphaForInk = 28,
} = {}) {
  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return src;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Drop near-white background pixels
    if (r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold) {
      data[i + 3] = 0;
      continue;
    }

    // Keep ink pixels at low alpha for watermarking
    data[i + 3] = alphaForInk;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

