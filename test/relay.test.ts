import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { chowdeck, Chowdeck } from '../src/client.js';

describe('Relay API Resource Group', () => {
  const apiKey = 'test_api_key';
  const baseUrl = 'https://api-mock.chowdeck.com';
  let client: Chowdeck;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    client = chowdeck({ apiKey, baseUrl });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Deliveries Sub-Client', () => {
    it('should request a delivery fee quote via POST /relay/delivery/fee', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { id: 1, total_amount: 1500 } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const payload = {
        source_address: { latitude: 6.5244, longitude: 3.3792 },
        destination_address: { latitude: 6.6018, longitude: 3.3515 },
        estimated_order_amount: 5000,
      };

      const res = await client.relay.deliveries.quote(payload);

      expect(res.data.total_amount).toBe(1500);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/delivery/fee');
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should create a delivery via POST /relay/delivery', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { reference: 'REF-123', id: 10 } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const payload = {
        destination_contact: { name: 'Alice', phone: '1234567890', country_code: 'NG' },
        source_contact: { name: 'Bob', phone: '0987654321', country_code: 'NG' },
        fee_id: 1,
        item_type: 'food',
        user_action: 'sending',
      };

      const res = await client.relay.deliveries.create(payload);

      expect(res.data.reference).toBe('REF-123');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/delivery');
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should get a delivery details via GET /relay/delivery/{reference}', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { id: 10, reference: 'REF-123', total_price: 1500 } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.relay.deliveries.get('REF-123');

      expect(res.data.id).toBe(10);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/delivery/REF-123');
      expect(optionsArg?.method).toBe('GET');
    });

    it('should cancel a delivery via POST /relay/delivery/{reference}/cancel', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Delivery cancelled successfully' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const payload = { reason: 'Customer changed mind' };
      const res = await client.relay.deliveries.cancel('REF-123', payload);

      expect(res.status).toBe('success');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/delivery/REF-123/cancel');
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });
  });

  describe('Wallet Sub-Client', () => {
    it('should get wallet balance via GET /relay/wallet/balance', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { balance: 500000 } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.relay.wallet.getBalance();

      expect(res.data.balance).toBe(500000);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/wallet/balance');
      expect(optionsArg?.method).toBe('GET');
    });

    it('should get virtual account details via GET /relay/wallet/virtual-account', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { account_number: '1234567890', bank_name: 'Wema Bank' } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.relay.wallet.getAccount();

      expect(res.data.account_number).toBe('1234567890');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/wallet/virtual-account');
      expect(optionsArg?.method).toBe('GET');
    });

    it('should get wallet history via GET /relay/wallet/history', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { history: [] } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.relay.wallet.getHistory();

      expect(res.data.history).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/wallet/history');
      expect(optionsArg?.method).toBe('GET');
    });
  });

  describe('Redelivery Operations', () => {
    it('should quote redelivery via POST /relay/redelivery/fee', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { id: 2, amount: 1000 } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const payload = { reference: 'REF-123' };
      const res = await client.relay.quoteRedelivery(payload);

      expect(res.data.amount).toBe(1000);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/redelivery/fee');
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should request redelivery via POST /relay/redelivery', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { id: 3, reference: 'REF-456' } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const payload = { reference: 'REF-123', fee_id: 2 };
      const res = await client.relay.requestRedelivery(payload);

      expect(res.data.reference).toBe('REF-456');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe('https://api-mock.chowdeck.com/relay/redelivery');
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });
  });
});
