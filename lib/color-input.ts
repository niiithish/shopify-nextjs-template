const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  if (!HEX_COLOR.test(trimmed)) {
    return null;
  }

  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return trimmed.toLowerCase();
}

export function hexForColorInput(value: string, fallback = "#111111"): string {
  if (value.trim().toLowerCase() === "transparent") {
    return fallback;
  }

  return normalizeHexColor(value) ?? fallback;
}
