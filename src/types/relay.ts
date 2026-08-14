import type {
  OrderAddress,
  OrderCustomer,
  OrderItem,
  OrderTimelineEntry,
} from './merchant.js';

/**
 * Payload for requesting a delivery fee quote.
 */
export interface GetDeliveryFeePayload {
  source_address?: {
    latitude: number;
    longitude: number;
  };
  destination_address?: {
    latitude: number;
    longitude: number;
  };
  estimated_order_amount?: number;
  source_address_string?: string;
  destination_address_string?: string;
}

/**
 * Result of a delivery fee quote computation.
 */
export interface DeliveryFeeQuote {
  id: number;
  total_amount: number;
  service_amount: number;
  delivery_amount: number;
  safety_fee: number;
}

/**
 * Response returned when fetching delivery fee.
 */
export interface GetDeliveryFeeResponse {
  status: string;
  message: string;
  data: DeliveryFeeQuote;
}

/**
 * Contact structure for Relay delivery points.
 */
export interface RelayContact {
  name: string;
  phone: string;
  country_code: string;
  email?: string;
}

/**
 * Payload for creating a Relay delivery.
 */
export interface CreateRelayDeliveryPayload {
  destination_contact: RelayContact;
  source_contact: RelayContact;
  fee_id: number;
  item_type: string;
  user_action: 'sending' | 'receiving' | string;
  reference?: string;
  estimated_order_amount?: number;
  customer_delivery_note?: string;
}

/**
 * Response data returned after creating a Relay delivery.
 */
export interface CreateRelayDeliveryResponseData {
  reference: string;
  id: number;
  delivery_price: number;
  status: string;
  made_payment: boolean;
}

/**
 * Response returned after creating a Relay delivery.
 */
export interface CreateRelayDeliveryResponse {
  status: string;
  message: string;
  data: CreateRelayDeliveryResponseData;
}

/**
 * Detailed structure of a Relay package delivery order.
 */
export interface RelayDelivery {
  id: number;
  total_price: number;
  reference: string;
  status: string;
  summary: string;
  source: string;
  class: string;
  currency: string;
  created_at: string;
  updated_at: string;
  delivery_price: number;
  time_payment_confirmed: string | null;
  time_customer_received_order: string | null | any;
  actual_delivery_time: string | null | any;
  driver: Record<string, any>;
  customer_vendor_note?: string;
  customer_delivery_note?: string;
  customer: OrderCustomer;
  items: OrderItem[];
  timeline: OrderTimelineEntry[];
  customer_address: OrderAddress;
  vendor_address: OrderAddress;
  vendor_information: {
    name: string;
    reference: string;
    webhook_url: string;
  };
  tracking_url?: string;
}

/**
 * Response returned when retrieving a Relay delivery.
 */
export interface GetRelayDeliveryResponse {
  status: string;
  message: string;
  data: RelayDelivery;
}

/**
 * Payload for cancelling an active Relay delivery.
 */
export interface CancelRelayDeliveryPayload {
  reason: string;
}

/**
 * Response returned after cancelling a Relay delivery.
 */
export interface CancelRelayDeliveryResponse {
  status: string;
  message: string;
}

/**
 * Payload for requesting a redelivery fee.
 */
export interface GetRedeliveryFeePayload {
  reference: string;
}

/**
 * Result of a redelivery fee quote.
 */
export interface RedeliveryFeeQuote {
  id: number;
  amount: number;
  vendor_id: number;
  currency: string;
}

/**
 * Response returned when retrieving redelivery fee.
 */
export interface GetRedeliveryFeeResponse {
  status: string;
  message: string;
  data: RedeliveryFeeQuote;
}

/**
 * Payload for requesting redelivery of a failed/cancelled delivery.
 */
export interface RequestRedeliveryPayload {
  reference: string;
  fee_id: number;
}

/**
 * Response data returned after requesting redelivery.
 */
export interface RequestRedeliveryResponseData {
  id: number;
  reference: string;
  redelivery_amount: number;
  currency: string;
}

/**
 * Response returned after requesting redelivery.
 */
export interface RequestRedeliveryResponse {
  status: string;
  message: string;
  data: RequestRedeliveryResponseData;
}

/**
 * Virtual bank account details associated with a Relay wallet.
 */
export interface RelayVirtualAccount {
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
}

/**
 * Response returned when retrieving the wallet's virtual account.
 */
export interface GetRelayVirtualAccountResponse {
  status: string;
  message: string;
  data: RelayVirtualAccount;
}

/**
 * Response returned when retrieving Relay wallet balance.
 */
export interface GetRelayWalletBalanceResponse {
  status: string;
  message: string;
  data: {
    balance: number;
  };
}

/**
 * Single wallet transaction log record.
 */
export interface WalletTransaction {
  id: number;
  domain: string;
  currency: string;
  reason: string;
  balance: number; // in kobo
  difference: number; // in kobo, negative when it's a debit
  category: string;
  created_at: string;
  updated_at: string;
}

/**
 * Response returned when retrieving Relay wallet history.
 */
export interface GetRelayWalletHistoryResponse {
  status: string;
  message: string;
  data: {
    history: WalletTransaction[];
  };
}
