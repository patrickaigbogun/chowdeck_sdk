import { describe, it, expect } from 'vitest';
import { nairaToKobo, koboToNaira } from '../src/utils/currency.js';

describe('Currency Helpers', () => {
  describe('nairaToKobo', () => {
    it('should correctly convert round Naira amounts to Kobo', () => {
      expect(nairaToKobo(1)).toBe(100);
      expect(nairaToKobo(100)).toBe(10000);
      expect(nairaToKobo(0)).toBe(0);
    });

    it('should correctly convert fractional Naira amounts to Kobo', () => {
      expect(nairaToKobo(150.50)).toBe(15050);
      expect(nairaToKobo(10.25)).toBe(1025);
      expect(nairaToKobo(0.99)).toBe(99);
    });

    it('should handle floating-point precision issues correctly', () => {
      // 20.99 * 100 in JS can be 2098.9999999999995
      expect(nairaToKobo(20.99)).toBe(2099);
      // 0.29 * 100 in JS can be 28.999999999999996
      expect(nairaToKobo(0.29)).toBe(29);
    });

    it('should throw TypeError when input is not a number or is NaN', () => {
      expect(() => nairaToKobo(NaN)).toThrow(TypeError);
      // @ts-expect-error - testing invalid type runtime check
      expect(() => nairaToKobo('100')).toThrow(TypeError);
      // @ts-expect-error
      expect(() => nairaToKobo(null)).toThrow(TypeError);
      // @ts-expect-error
      expect(() => nairaToKobo(undefined)).toThrow(TypeError);
    });
  });

  describe('koboToNaira', () => {
    it('should correctly convert Kobo amounts to Naira', () => {
      expect(koboToNaira(100)).toBe(1);
      expect(koboToNaira(15050)).toBe(150.5);
      expect(koboToNaira(1025)).toBe(10.25);
      expect(koboToNaira(0)).toBe(0);
    });

    it('should throw TypeError when input is not a number or is NaN', () => {
      expect(() => koboToNaira(NaN)).toThrow(TypeError);
      // @ts-expect-error - testing invalid type runtime check
      expect(() => koboToNaira('100')).toThrow(TypeError);
      // @ts-expect-error
      expect(() => koboToNaira(null)).toThrow(TypeError);
      // @ts-expect-error
      expect(() => koboToNaira(undefined)).toThrow(TypeError);
    });
  });
});
