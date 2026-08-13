import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { chowdeck, Chowdeck } from '../src/client.js';

describe('Merchant API Resource Group', () => {
  const apiKey = 'test_api_key';
  const baseUrl = 'https://api-mock.chowdeck.com';
  const merchantRef = 'MERCH-999';
  let client: Chowdeck;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    client = chowdeck({ apiKey, baseUrl });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Merchant Profile & Wallet', () => {
    it('should retrieve merchant profile via GET /merchant/{merchantReference}', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { name: 'Gourmet Kitchen', reference: merchantRef } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.merchant.getProfile(merchantRef);

      expect(res.data?.name).toBe('Gourmet Kitchen');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}`);
      expect(optionsArg?.method).toBe('GET');
    });

    it('should update merchant profile via PUT /merchant/{merchantReference}', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Profile updated' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { is_open: true, name: 'Gourmet Bistro' };

      const res = await client.merchant.updateProfile(merchantRef, payload);

      expect(res.message).toBe('Profile updated');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}`);
      expect(optionsArg?.method).toBe('PUT');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should get reviews via GET /merchant/{merchantReference}/reviews', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: [] }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const query = { page: 2, per_page: 15 };

      const res = await client.merchant.getReviews(merchantRef, query);

      expect(res.data).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      const parsedUrl = new URL(urlArg);
      expect(parsedUrl.pathname).toBe(`/merchant/${merchantRef}/reviews`);
      expect(parsedUrl.searchParams.get('page')).toBe('2');
      expect(parsedUrl.searchParams.get('per_page')).toBe('15');
      expect(optionsArg?.method).toBe('GET');
    });

    it('should get wallet balance via GET /merchant/{merchantReference}/wallet/balance', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { balance: 45000 } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.merchant.getWalletBalance(merchantRef);

      expect(res.data.balance).toBe(45000);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/wallet/balance`);
    });

    it('should get virtual account via GET /merchant/{merchantReference}/wallet/virtual-account', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { account_number: '9876543210' } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.merchant.getVirtualAccount(merchantRef);

      expect(res.data.account_number).toBe('9876543210');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/wallet/virtual-account`);
    });

    it('should get wallet history via GET /merchant/{merchantReference}/wallet/history', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { history: [] } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.merchant.getWalletHistory(merchantRef);

      expect(res.data.history).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/wallet/history`);
    });
  });

  describe('Merchant Orders Sub-Client', () => {
    const orderRef = 'ORD-555';

    it('should list orders via GET /merchant/{merchantReference}/orders', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: [] }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const query = { page: 1, per_page: 10 };

      const res = await client.m.orders.list(merchantRef, query);

      expect(res.data).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      const parsedUrl = new URL(urlArg);
      expect(parsedUrl.pathname).toBe(`/merchant/${merchantRef}/orders`);
      expect(parsedUrl.searchParams.get('page')).toBe('1');
      expect(parsedUrl.searchParams.get('per_page')).toBe('10');
      expect(optionsArg?.method).toBe('GET');
    });

    it('should get an order via GET /merchant/{merchantReference}/order/{orderReference}', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { reference: orderRef, total_price: 3500 } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.m.orders.get(merchantRef, orderRef);

      expect(res.data.reference).toBe(orderRef);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/order/${orderRef}`);
      expect(optionsArg?.method).toBe('GET');
    });

    it('should accept an order via PUT /merchant/{merchantReference}/order/{orderReference}/accept', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Order accepted' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.m.orders.accept(merchantRef, orderRef);

      expect(res.status).toBe('success');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/order/${orderRef}/accept`);
      expect(optionsArg?.method).toBe('PUT');
    });

    it('should reject an order via PUT /merchant/{merchantReference}/order/{orderReference}/reject', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Order rejected' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.m.orders.reject(merchantRef, orderRef);

      expect(res.status).toBe('success');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/order/${orderRef}/reject`);
      expect(optionsArg?.method).toBe('PUT');
    });

    it('should mark order ready via PUT /merchant/{merchantReference}/order/{orderReference}/ready', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Order ready' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.m.orders.markReady(merchantRef, orderRef);

      expect(res.status).toBe('success');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/order/${orderRef}/ready`);
      expect(optionsArg?.method).toBe('PUT');
    });

    it('should submit substitution via POST /merchant/{merchantReference}/order/{orderReference}/substitution', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Substitution submitted' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = {
        substitutions: [
          {
            item_reference: 'ITEM-1',
            pack_id: 1,
            order_item_type: 'item',
            quantity_unavailable: 1,
            replacements: [{ reference: 'ITEM-2', quantity: 1 }],
          },
        ],
      };

      const res = await client.m.orders.substitute(merchantRef, orderRef, payload);

      expect(res.status).toBe('success');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/order/${orderRef}/substitution`);
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });
  });

  describe('Merchant Menus Sub-Client', () => {
    it('should list categories via GET /merchant/{merchantReference}/menucategory', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: [] }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.m.menus.listCategories(merchantRef);

      expect(res.data).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/menucategory`);
      expect(optionsArg?.method).toBe('GET');
    });

    it('should create category via POST /merchant/{merchantReference}/menucategory', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { reference: 'CAT-1', id: 123 } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { reference: 'CAT-1', name: 'Drinks' };

      const res = await client.m.menus.createCategory(merchantRef, payload);

      expect(res.data.reference).toBe('CAT-1');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/menucategory`);
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should update category via PUT /merchant/{merchantReference}/menucategory/{categoryReference}', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { id: 123, name: 'Soft Drinks' } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { name: 'Soft Drinks', is_published: true };

      const res = await client.m.menus.updateCategory(merchantRef, 'CAT-1', payload);

      expect(res.data.name).toBe('Soft Drinks');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/menucategory/CAT-1`);
      expect(optionsArg?.method).toBe('PUT');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should list items via GET /merchant/{merchantReference}/menu/items', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: [] }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.m.menus.listItems(merchantRef);

      expect(res.data).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/menu/items`);
      expect(optionsArg?.method).toBe('GET');
    });

    it('should create menu item via POST /merchant/{merchantReference}/menu/items', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { reference: 'ITEM-1', name: 'Pepsi' } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { reference: 'ITEM-1', name: 'Pepsi', price: 500, menu_category_id: 123, in_stock: true };

      const res = await client.m.menus.createItem(merchantRef, payload);

      expect(res.data.name).toBe('Pepsi');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/menu/items`);
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should get specific item via GET /merchant/{merchantReference}/menu/items/{itemReference}', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: { reference: 'ITEM-1', name: 'Pepsi' } }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.m.menus.getItem(merchantRef, 'ITEM-1');

      expect(res.data.name).toBe('Pepsi');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/menu/items/ITEM-1`);
      expect(optionsArg?.method).toBe('GET');
    });

    it('should bulk create menu items via POST /merchant/{merchantReference}/menu/items/bulk', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: [] }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { items: [{ reference: 'ITEM-1', name: 'Pepsi', price: 500, in_stock: true, category: { name: 'Drinks', reference: 'CAT-1' } }] };

      const res = await client.m.menus.bulkCreateItems(merchantRef, payload);

      expect(res.data).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/menu/items/bulk`);
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should bulk update menu items via PUT /merchant/{merchantReference}/menu/items/bulk', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: [] }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { items: [{ reference: 'ITEM-1', price: 550 }] };

      const res = await client.m.menus.bulkUpdateItems(merchantRef, payload);

      expect(res.data).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/menu/items/bulk`);
      expect(optionsArg?.method).toBe('PUT');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });
  });

  describe('Merchant Discounts Sub-Client', () => {
    const discountRef = 'DISC-777';

    it('should list discounts via GET /merchant/{merchantReference}/discounts', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', data: [] }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const res = await client.m.discounts.list(merchantRef);

      expect(res.data).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/discounts`);
      expect(optionsArg?.method).toBe('GET');
    });

    it('should create discount via POST /merchant/{merchantReference}/discounts', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Discount created' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = {
        reference: discountRef,
        title: 'Midweek Special',
        description: 'Get 10% off',
        type: 'percentage_off',
        value: 10,
        category: 'price_slash_off_all_orders',
        expiry_date: '2026-12-31',
        maximum_usage_times: 100,
        vendor_references: [merchantRef],
        minimum_order_amount: 2000,
      };

      const res = await client.m.discounts.create(merchantRef, payload);

      expect(res.message).toBe('Discount created');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/discounts`);
      expect(optionsArg?.method).toBe('POST');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should update discount via PUT /merchant/{merchantReference}/discounts/{discountReference}', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Discount updated' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { value: 15 };

      const res = await client.m.discounts.update(merchantRef, discountRef, payload);

      expect(res.message).toBe('Discount updated');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/discounts/${discountRef}`);
      expect(optionsArg?.method).toBe('PUT');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should activate discounts via PATCH /merchant/{merchantReference}/discounts/activate', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Discounts activated' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { references: [discountRef] };

      const res = await client.m.discounts.activate(merchantRef, payload);

      expect(res.status).toBe('success');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/discounts/activate`);
      expect(optionsArg?.method).toBe('PATCH');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });

    it('should deactivate discounts via DELETE /merchant/{merchantReference}/discounts/deactivate', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ status: 'success', message: 'Discounts deactivated' }),
      };
      const fetchMock = vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const payload = { references: [discountRef] };

      const res = await client.m.discounts.deactivate(merchantRef, payload);

      expect(res.status).toBe('success');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [urlArg, optionsArg] = fetchMock.mock.calls[0];
      expect(urlArg).toBe(`https://api-mock.chowdeck.com/merchant/${merchantRef}/discounts/deactivate`);
      expect(optionsArg?.method).toBe('DELETE');
      expect(optionsArg?.body).toBe(JSON.stringify(payload));
    });
  });
});
