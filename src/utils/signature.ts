import crypto from 'node:crypto';

/**
 * Verifies the HMAC SHA-256 signature of a Chowdeck webhook payload.
 *
 * @param rawBody - The raw, unparsed request body string or Buffer.
 * @param signature - The signature sent in the request headers (typically 'x-chowdeck-signature').
 * @param secret - The webhook signing secret.
 * @returns True if the signature is valid, false otherwise.
 */
export function verifySignature(
  rawBody: string | Buffer,
  signature: string,
  secret: string,
): boolean {
  if (!rawBody || !signature || !secret) {
    return false;
  }

  // Support stripping 'sha256=' prefix if present
  let cleanSignature = signature;
  if (signature.startsWith('sha256=')) {
    cleanSignature = signature.substring(7);
  }

  const payload =
    typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  try {
    const signatureBuffer = Buffer.from(cleanSignature, 'hex');
    const computedBuffer = Buffer.from(computedSignature, 'hex');

    if (signatureBuffer.length !== computedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, computedBuffer);
  } catch {
    return false;
  }
}
