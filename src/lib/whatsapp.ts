export function buildWhatsAppMessage(params: {
  orderId: string;
  bottleName: string;
  total: number;
  currency?: string;
  recipeLines: { name: string; grams: number }[];
}) {
  const cur = params.currency ?? "TND";
  const recipe = params.recipeLines
    .map((l) => `• ${l.name}: ${l.grams}g`)
    .join("\n");
  return `Hello 👋
Order ID: #${params.orderId.slice(0, 8)}
Bottle: ${params.bottleName}
Total: ${params.total.toFixed(2)} ${cur}

Recipe:
${recipe}`;
}

export function whatsappHref(phoneDigits: string, text: string) {
  const n = phoneDigits.replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}
