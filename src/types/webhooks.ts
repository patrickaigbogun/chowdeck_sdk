import type { Order } from './merchant.js';

/**
 * Valid category names for Chowdeck webhook events.
 */
export type WebhookEventCategory =
  | 'ORDER_CREATED'
  | 'ORDER_ASSIGNED'
  | 'ORDER_AWAITING_PICKUP'
  | 'ORDER_PICKED_UP'
  | 'ORDER_ARRIVED_AT_CUSTOMER_LOCATION'
  | 'ORDER_COMPLETE'
  | 'ORDER_ITEMS_UPDATED';

/**
 * Represents the standard payload wrapper delivered by Chowdeck webhooks.
 */
export interface WebhookPayload {
  category: WebhookEventCategory;
  description: string;
  payload: Order;
}

/**
 * Options used when verifying a webhook signature.
 */
export interface WebhookVerificationOptions {
  /**
   * The raw, unparsed request body string or Buffer.
   */
  rawBody: string | Buffer;
  /**
   * The signature header value (typically retrieved from 'x-chowdeck-signature').
   */
  signature: string;
  /**
   * The webhook secret token configured in the Chowdeck dashboard.
   */
  secret: string;
}
