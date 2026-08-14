# Chowdeck SDK for TypeScript & JavaScript

A type-safe, fluent SDK for integrating the **Chowdeck Merchant** and **Chowdeck Relay** APIs. Built for Node.js (>=18.0.0) with native ESM support and dual CommonJS building.

## Features

- **Fluent Chaining API**: Clean namespaces (`.m` or `.merchant` for merchant operations, `.r` or `.relay` for logistics).
- **TypeScript First**: 100% type-safe payloads and responses compiled from the official OpenAPI definitions.
- **Robust Exception Model**: Transparent HTTP details exposed via `ChowdeckAPIError` and connection issues via `ChowdeckConnectionError`.
- **Timing-Safe Webhook Verification**: Utility to authenticate incoming webhooks against timing attacks.
- **Floating-Point Safe Currency Conversions**: Accurate Naira-Kobo converters.

---

## Installation

```bash
bun add @chwdck/sdk
# or
npm install @chwdck/sdk
# or
yarn add @chwdck/sdk
# or
pnpm add @chwdck/sdk
```

---

## Quick Start

Initialize the client with your secret API Key from the Chowdeck Developer Dashboard.

```typescript
import { chowdeck } from '@chwdck/sdk';

const client = chowdeck({
  apiKey: 'YOUR_CHOWDECK_API_KEY',
  // Defaults to https://api.chowdeck.com. Override for sandbox testing:
  baseUrl: 'https://api.chowdeck.com', 
});
```

---

## Usage Guide

### 1. Merchant APIs (`client.m` or `client.merchant`)

The Merchant API allows vendor integrations to manage orders, synchronize menu items, toggle discounts, and check wallets.

#### Order Management
Manage order states from preparation to pickup:

```typescript
const merchantRef = 'merchant_abc123';

// 1. List active/past orders
const orders = await client.m.orders.list(merchantRef, { status: 'preparing' });

// 2. Retrieve detailed information for a single order
const order = await client.m.orders.get(merchantRef, 'order_ref_xyz');

// 3. Accept an order (transitions state to 'preparing')
await client.m.orders.accept(merchantRef, 'order_ref_xyz');

// 4. Reject an order
await client.m.orders.reject(merchantRef, 'order_ref_xyz');

// 5. Mark an order as ready for dispatch
await client.m.orders.markReady(merchantRef, 'order_ref_xyz');

// 6. Suggest item substitutions if out of stock
await client.m.orders.substitute(merchantRef, 'order_ref_xyz', {
  items: [
    {
      original_item_id: 'item_old',
      substituted_item_id: 'item_new',
      quantity: 1
    }
  ]
});
```

#### Menu Management
Programmatically manage menu items, categories, and bulk updates:

```typescript
// Create a new menu category
const category = await client.m.menus.createCategory(merchantRef, {
  name: 'Breakfast Options',
  rank: 1,
});

// List menu items
const items = await client.m.menus.listItems(merchantRef);

// Create a single menu item
const newItem = await client.m.menus.createItem(merchantRef, {
  name: 'Waffles & Syrup',
  price: 250000, // price in Kobo (Naira * 100)
  category_id: category.data.id,
});

// Perform bulk updates or creations
await client.m.menus.bulkCreateItems(merchantRef, {
  items: [ /* array of items */ ]
});
```

#### Discounts & Promotions
Toggle marketing campaigns programmatically:

```typescript
// Create a price slash discount
const promotion = await client.m.discounts.create(merchantRef, {
  reference: 'PROMO_SUMMER_2026',
  title: 'Summer Slash',
  description: '10% off all meals',
  type: 'percentage_off',
  value: 10,
  category: 'price_slash_off_all_orders',
  expiry_date: '2026-12-31',
  maximum_usage_times: 500,
  vendor_references: [merchantRef],
  minimum_order_amount: 150000 // In Kobo
});

// Activate or deactivate discounts in bulk
await client.m.discounts.activate(merchantRef, { references: ['PROMO_SUMMER_2026'] });
await client.m.discounts.deactivate(merchantRef, { references: ['PROMO_SUMMER_2026'] });
```

#### Financials & Virtual Accounts
Retrieve balance logs or account details to top up your account:

```typescript
// Get profile details
const profile = await client.m.getProfile(merchantRef);

// Retrieve virtual account for bank transfers
const bankAccount = await client.m.getVirtualAccount(merchantRef);
console.log(`Bank: ${bankAccount.data.bank_name}, Account: ${bankAccount.data.account_number}`);

// Check wallet balance
const balance = await client.m.getWalletBalance(merchantRef);
```

---

### 2. Relay Logistics APIs (`client.r` or `client.relay`)

Relay allows on-demand package logistics, delivery pricing estimation, scheduling, and wallet management.

#### Deliveries & Quotes
Estimate prices and dispatch riders:

```typescript
// 1. Calculate a delivery fee quote
const quote = await client.r.deliveries.quote({
  pickup: {
    address: '12 Herbert Macaulay Way, Yaba, Lagos',
    latitude: 6.5022,
    longitude: 3.3768,
    contact: { name: 'Sender', phone: '+2348000000001' }
  },
  dropoff: {
    address: '90 Allen Avenue, Ikeja, Lagos',
    latitude: 6.5986,
    longitude: 3.3542,
    contact: { name: 'Recipient', phone: '+2348000000002' }
  }
});

// 2. Dispatch the delivery using the fee_id from the quote
const delivery = await client.r.deliveries.create({
  fee_id: quote.data.fee_id,
  description: 'Medical supplies package',
});

// 3. Track delivery status
const status = await client.r.deliveries.get(delivery.data.reference);
console.log(`Delivery is current: ${status.data.status}`);

// 4. Cancel delivery (requires a reason)
await client.r.deliveries.cancel(delivery.data.reference, {
  reason: 'Customer requested cancellation',
});
```

#### Redeliveries
Quote and trigger redelivery attempts for packages that failed to get delivered on the first try:

```typescript
const failedRef = 'delivery_fail_ref';

const redeliveryQuote = await client.r.quoteRedelivery({
  delivery_reference: failedRef
});

await client.r.requestRedelivery({
  fee_id: redeliveryQuote.data.fee_id,
  delivery_reference: failedRef
});
```

#### Relay Wallet Management
Check funding status for logistics payments:

```typescript
const wallet = await client.r.wallet.getBalance();
const history = await client.r.wallet.getHistory();
const depositBank = await client.r.wallet.getAccount();
```

---

## Utilities

### Webhook Signature Verification
Verify that webhook events (e.g. `ORDER_CREATED`) originate securely from Chowdeck using timing-safe buffer comparisons:

```typescript
import { verifySignature } from '@chwdck/sdk';

const rawPayload = '{"event":"order.created",...}'; // Raw string body from request
const signature = request.headers['x-chowdeck-signature'];
const signingSecret = process.env.CHOWDECK_WEBHOOK_SECRET;

const isValid = verifySignature(rawPayload, signature, signingSecret);

if (!isValid) {
  throw new Error('Unauthorized webhook request.');
}
```

### Naira / Kobo Converters
Chowdeck APIs manage currency in Kobo minor units. Convert safely to avoid floating-point errors (e.g. `19.99 * 100` resulting in `1998.9999999999998`):

```typescript
import { nairaToKobo, koboToNaira } from '@chwdck/sdk';

nairaToKobo(19.99); // Returns 1999 (integer)
koboToNaira(15000); // Returns 150.00 (float)
```

---

## Error Handling

Standardized SDK exceptions wrap HTTP failures transparently:

```typescript
import { ChowdeckAPIError, ChowdeckConnectionError } from '@chwdck/sdk';

try {
  await client.m.orders.accept('merchant_ref', 'invalid_order_ref');
} catch (error) {
  if (error instanceof ChowdeckAPIError) {
    console.error(`HTTP Status: ${error.statusCode}`);
    console.error(`API Message: ${error.message}`);
    console.error(`Response details:`, error.responseData);
    console.error(`Request metadata:`, error.requestDetails); // URL and Method
  } else if (error instanceof ChowdeckConnectionError) {
    console.error(`Network failed: ${error.message}`, error.originalError);
  }
}
```

---

## Development

If you'd like to run build checks or tests locally:

```bash
# Install dependencies
bun install

# Run type check and linter
bun run lint

# Compile ESM and CJS bundles
bun run build

# Run unit tests
bun run test

# Run typescript examples directly
bun examples/test-client.ts
```

## License

This SDK is open-source software licensed under the [MIT License](LICENSE).
