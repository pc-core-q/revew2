/** Turns "07813623682", "+964 781 362 3682" or "9647813623682" into digits-only international format. */
export function normalizeWhatsapp(raw: string, countryCode = "964"): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = countryCode + d.slice(1);
  return d.length >= 8 ? d : "";
}

/** wa.me link with an optional prefilled message; "" when the number is missing or invalid. */
export function whatsappHref(number: string, message = ""): string {
  const n = normalizeWhatsapp(number);
  if (!n) return "";
  return `https://wa.me/${n}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`;
}

export function WhatsAppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.19 1.6 6.01L4 29l8.14-1.56a12.03 12.03 0 0 0 3.9.65h.01C22.68 28.09 28 22.69 28 16.06 28 9.4 22.68 3 16.04 3Zm0 22.06h-.01c-1.2 0-2.38-.32-3.4-.93l-.24-.15-4.83.93.99-4.7-.16-.25a9.97 9.97 0 0 1-1.54-5.31c0-5.5 4.5-9.98 10.03-9.98 5.52 0 10.01 4.48 10.01 9.98 0 5.52-4.5 10.41-10.85 10.41Zm5.5-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35Z" />
    </svg>
  );
}

/** Floating button fixed to the corner of the screen. */
export function WhatsAppButton({ number, message }: { number: string; message: string }) {
  const href = whatsappHref(number, message);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 active:scale-95"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
