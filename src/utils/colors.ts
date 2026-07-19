export function hexWithOpacity(hex: string, opacity: number) {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

  return `${hex}${alpha}`;
}