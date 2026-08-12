/**
 * Design tokens are stored as bare HSL triplets ("23 90% 54%") so Tailwind can
 * apply alpha. Swatches render the live CSS variable, but designers need the
 * hex — derive it rather than hand-maintaining a second copy that can drift.
 */
export function hslTripletToHex(triplet: string): string {
  const match = triplet
    .trim()
    .match(/^(-?[\d.]+)\s+(-?[\d.]+)%\s+(-?[\d.]+)%$/);
  if (!match) return "";

  const hue = Number(match[1]);
  const saturation = Number(match[2]) / 100;
  const lightness = Number(match[3]) / 100;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = (((hue % 360) + 360) % 360) / 60;
  const second = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const lightnessMatch = lightness - chroma / 2;

  const [red, green, blue] = (
    [
      [chroma, second, 0],
      [second, chroma, 0],
      [0, chroma, second],
      [0, second, chroma],
      [second, 0, chroma],
      [chroma, 0, second],
    ] as const
  )[Math.min(5, Math.floor(huePrime))];

  const toChannel = (value: number) =>
    Math.round((value + lightnessMatch) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toChannel(red)}${toChannel(green)}${toChannel(blue)}`.toUpperCase();
}
