export const IMGBB_KEY = "820a1a52d1b835874a9200fe7d3bb6b3";

/** Text inputs use 16px on phones so iOS doesn't zoom the page when a field is focused. */
export const fieldClass =
  "w-full rounded-xl border border-input bg-card px-3.5 py-3 text-base outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 md:py-2.5 md:text-sm";

export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const btnOutline =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-card px-4 text-sm font-semibold transition hover:bg-muted active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export type Notify = (message: string, kind?: "success" | "error") => void;

/** Adds https:// when missing and validates; returns null if the link is not usable. */
export function normalizeUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    return u.hostname.includes(".") ? u.toString() : null;
  } catch {
    return null;
  }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Shrinks big phone photos (max 1600px, JPEG) before upload so adding or replacing an image
 * is fast on mobile data. Falls back to the original file if anything goes wrong.
 */
export async function compressImage(file: File): Promise<Blob> {
  if (file.size < 400 * 1024 || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // PNG transparency -> white instead of black
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.85));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export async function uploadToImgbb(image: Blob, filename = "image.jpg"): Promise<string> {
  const form = new FormData();
  form.append("image", image, filename);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("فشل رفع الصورة");
  const json = await res.json();
  const url = json?.data?.display_url;
  if (!url) throw new Error("فشل رفع الصورة");
  return url as string;
}
