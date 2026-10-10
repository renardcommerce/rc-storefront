// Linkkleur op de accountpagina's (witte achtergrond). Minimaal 4,5:1 contrast (WCAG AA, normale tekst).
export const ACCOUNT_LINK_COLOR = "#2563eb"

function luminance(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16)
  const channel = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}

/** WCAG-contrastverhouding tussen twee hexkleuren (#rrggbb). */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
