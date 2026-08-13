import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { verifySignature } from '../src/utils/signature.js';

describe('Signature Verification', () => {
  const secret = 'chowdeck_webhook_secret_key_123';
  const payload = JSON.stringify({ event: 'order.created', data: { id: '12345' } });

  // Generate a valid signature dynamically for comparison
  const validHash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  it('should return true for a valid signature', () => {
    const isValid = verifySignature(payload, validHash, secret);
    expect(isValid).toBe(true);
  });

  it('should support signatures with the "sha256=" prefix', () => {
    const signatureWithPrefix = `sha256=${validHash}`;
    const isValid = verifySignature(payload, signatureWithPrefix, secret);
    expect(isValid).toBe(true);
  });

  it('should return true when payload is a Buffer', () => {
    const payloadBuffer = Buffer.from(payload, 'utf8');
    const isValid = verifySignature(payloadBuffer, validHash, secret);
    expect(isValid).toBe(true);
  });

  it('should return false for an incorrect signature', () => {
    const incorrectHash = validHash.replace(/./, 'x'); // corrupt one char
    const isValid = verifySignature(payload, incorrectHash, secret);
    expect(isValid).toBe(false);
  });

  it('should return false if the payload was tampered with', () => {
    const tamperedPayload = payload + ' ';
    const isValid = verifySignature(tamperedPayload, validHash, secret);
    expect(isValid).toBe(false);
  });

  it('should return false if the secret does not match', () => {
    const wrongSecret = 'wrong_secret';
    const isValid = verifySignature(payload, validHash, wrongSecret);
    expect(isValid).toBe(false);
  });

  it('should return false if any required parameter is missing or empty', () => {
    expect(verifySignature('', validHash, secret)).toBe(false);
    expect(verifySignature(payload, '', secret)).toBe(false);
    expect(verifySignature(payload, validHash, '')).toBe(false);
    // @ts-expect-error
    expect(verifySignature(null, validHash, secret)).toBe(false);
    // @ts-expect-error
    expect(verifySignature(payload, null, secret)).toBe(false);
    // @ts-expect-error
    expect(verifySignature(payload, validHash, null)).toBe(false);
  });

  it('should return false if signature is not valid hex', () => {
    const malformedSignature = 'not-a-hex-string';
    const isValid = verifySignature(payload, malformedSignature, secret);
    expect(isValid).toBe(false);
  });

  it('should return false if signature is of incorrect length', () => {
    const shortSignature = 'abc';
    const isValid = verifySignature(payload, shortSignature, secret);
    expect(isValid).toBe(false);
  });
});
