import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { nairaToKobo, koboToNaira } from '../src/utils/currency.js';
import { verifySignature } from '../src/utils/signature.js';
import { ChowdeckAPIError } from '../src/errors.js';

describe('Currency Utilities', () => {
  it('should convert Naira to Kobo accurately', () => {
    expect(nairaToKobo(100)).toBe(10000);
    expect(nairaToKobo(19.99)).toBe(1999);
    expect(nairaToKobo(0.15)).toBe(15);
  });

  it('should convert Kobo to Naira accurately', () => {
    expect(koboToNaira(10000)).toBe(100);
    expect(koboToNaira(1999)).toBe(19.99);
    expect(koboToNaira(15)).toBe(0.15);
  });

  it('should throw TypeError if non-number is provided', () => {
    expect(() => nairaToKobo('100' as any)).toThrow(TypeError);
    expect(() => koboToNaira(NaN)).toThrow(TypeError);
  });
});

describe('Signature Verification Utility', () => {
  const secret = 'test-signing-secret';
  const payload = JSON.stringify({ event: 'order.created', data: { id: 123 } });

  it('should verify valid signatures with and without sha256 prefix', () => {
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    expect(verifySignature(payload, signature, secret)).toBe(true);
    expect(verifySignature(payload, `sha256=${signature}`, secret)).toBe(true);
  });

  it('should fail for invalid signatures or invalid secret', () => {
    expect(verifySignature(payload, 'wrong-signature', secret)).toBe(false);
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    expect(verifySignature(payload, signature, 'wrong-secret')).toBe(false);
  });
});

describe('ChowdeckAPIError', () => {
  it('should parse error message from responseData message property', () => {
    const error = new ChowdeckAPIError('Generic Error', 400, { message: 'Specific API Error' });
    expect(error.message).toBe('Specific API Error');
  });

  it('should parse error message from responseData error property', () => {
    const error = new ChowdeckAPIError('Generic Error', 400, { error: 'Other API Error' });
    expect(error.message).toBe('Other API Error');
  });

  it('should fallback to default message if responseData does not contain message/error', () => {
    const error = new ChowdeckAPIError('Generic Error', 400, { foo: 'bar' });
    expect(error.message).toBe('Generic Error');
  });
});
