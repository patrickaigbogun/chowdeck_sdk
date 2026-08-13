import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { chowdeck, Chowdeck } from '../src/client.js';
import { ChowdeckAPIError, ChowdeckConnectionError } from '../src/errors.js';

describe('Chowdeck Client & Base Resource HTTP Layer', () => {
  const apiKey = 'test_api_key';
  const baseUrl = 'https://api-mock.chowdeck.com';

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Instantiation', () => {
    it('should initialize successfully with an apiKey', () => {
      const client = new Chowdeck({ apiKey });
      expect(client.apiKey).toBe(apiKey);
      expect(client.baseUrl).toBe('https://api.chowdeck.com'); // default
      expect(client.m).toBe(client.merchant);
      expect(client.r).toBe(client.relay);
    });

    it('should respect the baseUrl override', () => {
      const client = new Chowdeck({ apiKey, baseUrl });
      expect(client.baseUrl).toBe(baseUrl);
    });

    it('should throw an error if apiKey is not provided', () => {
      // @ts-expect-error
      expect(() => new Chowdeck({})).toThrow('Chowdeck API key is required');
      // @ts-expect-error
      expect(() => chowdeck({ apiKey: '' })).toThrow('Chowdeck API key is required');
    });

    it('should create client via the factory function', () => {
      const client = chowdeck({ apiKey, baseUrl });
      expect(client).toBeInstanceOf(Chowdeck);
      expect(client.apiKey).toBe(apiKey);
    });
  });

  describe('HTTP Layer (via BaseResource subclass)', () => {
    // We can instantiate MerchantResource as a concrete subclass of BaseResource for testing the HTTP layer
    let client: Chowdeck;

    beforeEach(() => {
      client = new Chowdeck({ apiKey, baseUrl });
    });

    it('should send correct Authorization and content-type headers', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      };
      
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      // Using the protected request method via a subclass call
      // Since merchant has no methods, we can access protected request via prototype call or direct cast
      const response = await (client.m as any).request('GET', '/test-path');

      expect(response).toEqual({ success: true });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/test-path');
      
      const headers = optionsArg?.headers as Headers;
      expect(headers.get('Authorization')).toBe(`Bearer ${apiKey}`);
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Accept')).toBe('application/json');
    });

    it('should append query parameters correctly', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: [] }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      await (client.m as any).request('GET', '/test-path', undefined, {
        query: { page: 1, limit: 10, filter: 'active', empty: undefined },
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const urlArg = fetchMock.mock.calls[0][0] as string;
      const parsedUrl = new URL(urlArg);
      expect(parsedUrl.searchParams.get('page')).toBe('1');
      expect(parsedUrl.searchParams.get('limit')).toBe('10');
      expect(parsedUrl.searchParams.get('filter')).toBe('active');
      expect(parsedUrl.searchParams.has('empty')).toBe(false);
    });

    it('should serialize request body to JSON', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: 'new_id' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const body = { name: 'Test Object', value: 123 };

      await (client.m as any).request('POST', '/create', body);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [, optionsArg] = fetchMock.mock.calls[0];
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(body));
    });

    it('should handle non-JSON responses', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: async () => 'raw plain text response',
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const response = await (client.m as any).request('GET', '/raw');
      expect(response).toBe('raw plain text response');
    });

    it('should throw ChowdeckAPIError on non-2xx status code', async () => {
      const errorBody = { message: 'The requested resource was not found', error: 'not_found' };
      const mockResponse = {
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => errorBody,
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      await expect(
        (client.m as any).request('GET', '/not-existing')
      ).rejects.toThrow(ChowdeckAPIError);

      try {
        await (client.m as any).request('GET', '/not-existing');
      } catch (error) {
        expect(error).toBeInstanceOf(ChowdeckAPIError);
        const apiError = error as ChowdeckAPIError;
        expect(apiError.statusCode).toBe(404);
        expect(apiError.message).toBe('The requested resource was not found');
        expect(apiError.responseData).toEqual(errorBody);
        expect(apiError.requestDetails).toEqual({
          url: 'https://api-mock.chowdeck.com/not-existing',
          method: 'GET',
        });
      }
    });

    it('should throw ChowdeckConnectionError on network failure', async () => {
      const networkError = new Error('DNS resolution failed');
      vi.mocked(fetch).mockRejectedValue(networkError);

      await expect(
        (client.m as any).request('GET', '/endpoint')
      ).rejects.toThrow(ChowdeckConnectionError);

      try {
        await (client.m as any).request('GET', '/endpoint');
      } catch (error) {
        expect(error).toBeInstanceOf(ChowdeckConnectionError);
        const connError = error as ChowdeckConnectionError;
        expect(connError.message).toContain('Failed to establish connection to Chowdeck API');
        expect(connError.originalError).toBe(networkError);
      }
    });
  });
});

describe.todo('Merchant & Relay API Endpoints (Pending Developer Implementation)', () => {
  it('should support client.m.orders.accept');
  it('should support client.m.orders.reject');
  it('should support client.r.deliveries.create');
});
