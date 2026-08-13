/**
 * Converts a Naira amount (major currency unit) to Kobo (minor currency unit).
 * Handles floating-point precision issues by rounding to the nearest integer.
 *
 * @param naira - The amount in Naira (e.g., 150.50)
 * @returns The amount in Kobo (e.g., 15050)
 */
export function nairaToKobo(naira: number): number {
  if (typeof naira !== 'number' || Number.isNaN(naira)) {
    throw new TypeError('Naira amount must be a number');
  }
  return Math.round(naira * 100);
}

/**
 * Converts a Kobo amount (minor currency unit) to Naira (major currency unit).
 *
 * @param kobo - The amount in Kobo (e.g., 15050)
 * @returns The amount in Naira (e.g., 150.50)
 */
export function koboToNaira(kobo: number): number {
  if (typeof kobo !== 'number' || Number.isNaN(kobo)) {
    throw new TypeError('Kobo amount must be a number');
  }
  return kobo / 100;
}
