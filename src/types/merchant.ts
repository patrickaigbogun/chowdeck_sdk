import type { WalletTransaction } from './relay.js';

/**
 * Merchant Profile properties.
 */
export interface MerchantProfile {
  id: number;
  primary_user: number;
  name: string;
  reference: string;
  description: string;
  support_contact: string;
  support_email: string;
  logo_url: string;
  current_domain: string;
  /**
   * Cover images as an array or serialized JSON string containing paths.
   */
  cover_images: string | Array<{ path: string }>;
  slug: string;
  currency: string;
  minimum_order_amount: number;
  is_active: boolean;
  location: string | null;
  offers_pickup: boolean;
  offers_delivery: boolean;
  vendor_class: string;
  vendor_type: string;
  /**
   * Registration status indicating completeness, e.g. '{"basic_information":1,"bank_information":1}'
   */
  registration_status: string | Record<string, number>;
  minimum_delivery_time: number;
  maximum_delivery_time: number | null;
  metadata: string | null | Record<string, any>;
  created_at: string;
  updated_at: string;
  likes: number;
  /**
   * Available hours of operation, e.g. '{"default":{"opening":900,"closing":1900}}'
   */
  available_hours: string | Record<string, any>;
  /**
   * Supported notification types, e.g. '["sms", "whatsapp"]'
   */
  notification_types: string | string[];
  onboarded_by: number;
  total_rating: number;
  number_of_rating: number;
  average_rating: string;
  preorder_configuration: string | null | Record<string, any>;
  settlement_schedule: string | null;
  charge_percent: string;
  flat_fee_per_item: number;
  is_open: number | boolean;
  parent_vendor: any | null;
  has_pin: boolean;
  setting: string | null | Record<string, any>;
  service_charge_percent: string;
  service_charge_cap: number;
  is_closed_by_operations: boolean;
  activation_status: string;
  webhook_url: string;
  coordinate: {
    x: number;
    y: number;
  };
  pretty_name: string;
}

/**
 * Payload for onboarding a new merchant.
 */
export interface CreateMerchantPayload {
  reference: string;
  email: string;
  first_name: string;
  last_name: string;
  description: string;
  support_contact: string;
  support_email?: string;
  minimum_delivery_time?: number;
  cover_images?: Array<{ path: string }>;
  tags?: string[];
  bank_code?: string;
  account_number?: string;
  account_name?: string;
  address: {
    latitude: string;
    longitude: string;
  };
  available_hours?: Record<string, { opening: number; closing: number }>;
  test_webhook_url?: string;
  live_webhook_url?: string;
}

/**
 * Response returned after creating a merchant.
 */
export interface CreateMerchantResponse {
  status: 'success' | 'failed' | string;
  message: string;
  data?: {
    id: number;
    reference: string;
  };
}

/**
 * Payload for updating an existing merchant.
 */
export interface UpdateMerchantPayload {
  is_open?: boolean;
  name?: string;
  description?: string;
  support_contact?: string;
  support_email?: string;
  minimum_delivery_time?: number;
  available_hours?: {
    default?: {
      opening: string | number;
      closing: string | number;
    };
    [day: string]: any;
  };
}

/**
 * Response returned after updating a merchant.
 */
export interface UpdateMerchantResponse {
  status: 'success' | 'failed' | string;
  message: string;
  data?: MerchantProfile;
}

/**
 * Customer rating for specific menu items.
 */
export interface MenuRating {
  item_id: number;
  item_name: string;
  item_rating: number;
}

/**
 * Vendor review submitted by a customer.
 */
export interface VendorReview {
  id: number;
  customer_name: string;
  rater_type: 'customer' | string;
  vendor_rating: number;
  vendor_review: string;
  created_at: string;
  order_id: number;
  summary: string;
  menus_rating: MenuRating[];
}

/**
 * Query parameters for fetching vendor reviews.
 */
export interface GetVendorReviewsQueryParams {
  page?: number;
  per_page?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Response returned when fetching vendor reviews.
 */
export interface GetVendorReviewsResponse {
  status: string;
  message: string;
  data: VendorReview[];
}

/**
 * Menu Category properties.
 */
export interface MenuCategory {
  id: number;
  name: string;
  is_published: boolean;
  rank: number;
  reference: string;
  is_general: boolean;
  food_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Payload for creating a new category.
 */
export interface CreateMenuCategoryPayload {
  reference: string;
  name: string;
}

/**
 * Response returned after creating a menu category.
 */
export interface CreateMenuCategoryResponse {
  status: string;
  message: string;
  data: {
    reference: string;
    id: number;
  };
}

/**
 * Payload for updating a category.
 */
export interface UpdateMenuCategoryPayload {
  name?: string;
  is_published?: boolean;
  rank?: number;
}

/**
 * Response returned after updating a category.
 */
export interface UpdateMenuCategoryResponse {
  status: string;
  message: string;
  data: MenuCategory;
}

/**
 * Response returned when listing menu categories.
 */
export interface ListMenuCategoriesResponse {
  status: string;
  message: string;
  data: MenuCategory[];
}

/**
 * Tag associated with a menu item.
 */
export interface MenuItemTag {
  id: number;
  name: string;
}

/**
 * Image associated with a menu item.
 */
export interface MenuItemImage {
  id?: number;
  rank?: number;
  path: string;
}

/**
 * Category info attached to a menu item.
 */
export interface MenuItemCategoryInfo {
  id: number;
  name: string;
  reference: string;
  is_published: boolean;
  is_general: boolean;
}

/**
 * Modifier option item inside a modifier group.
 */
export interface ModifierItem {
  name: string;
  price: number;
  reference: string;
}

/**
 * Modifier group for menu item customization.
 */
export interface ModifierGroup {
  name: string;
  minimum_selection: number;
  maximum_selection: number | string;
  items: ModifierItem[];
}

/**
 * Menu Item details.
 */
export interface MenuItem {
  id: number;
  group_id: number;
  rank: number;
  name: string;
  popular_name: string;
  description: string;
  in_stock: boolean;
  is_published: boolean;
  is_active: boolean;
  price: number;
  discounted_price: number;
  currency: string;
  price_description: string;
  created_at: string;
  updated_at: string;
  container_type_id: number | null;
  menu_group_ids: number[] | null;
  volume_per_portion: number | null;
  maximum_quantity: number | null;
  maximum_quantity_as_side: number | null;
  reference: string;
  category: MenuItemCategoryInfo;
  modifiers?: ModifierGroup[];
  tags?: string[] | MenuItemTag[];
  sides?: any[];
  images: MenuItemImage[];
  container_name?: string | null;
  container_price?: number | null;
  container_description?: string | null;
  container_volume?: number | null;
}

/**
 * Payload for creating a menu item.
 */
export interface CreateMenuItemPayload {
  reference: string;
  name: string;
  description?: string;
  menu_category_id: number;
  in_stock: boolean;
  price: number;
  images?: Array<{ path: string }>;
}

/**
 * Response returned after creating a menu item.
 */
export interface CreateMenuItemResponse {
  status: string;
  message: string;
  data: MenuItem;
}

/**
 * Response returned when listing menu items.
 */
export interface ListMenuItemsResponse {
  status: string;
  message: string;
  data: MenuItem[];
}

/**
 * Response returned when fetching a single menu item.
 */
export interface GetMenuItemResponse {
  status: string;
  message: string;
  data: MenuItem;
}

/**
 * Structure of a menu item in a bulk creation request.
 */
export interface BulkCreateMenuItem {
  reference: string;
  name: string;
  price: number;
  description?: string;
  images?: Array<{ path: string }>;
  category: {
    name: string;
    reference: string;
    rank?: number;
  };
  in_stock: boolean;
  modifiers?: ModifierGroup[];
}

/**
 * Payload for batch uploading menu items.
 */
export interface BulkCreateMenuItemsPayload {
  items: BulkCreateMenuItem[];
}

/**
 * Response returned after bulk creating menu items.
 */
export interface BulkCreateMenuItemsResponse {
  status: string;
  message: string;
  data: MenuItem[];
}

/**
 * Structure of a menu item in a bulk update request.
 */
export interface BulkUpdateMenuItem extends Partial<BulkCreateMenuItem> {
  reference: string;
}

/**
 * Payload for batch updating menu items.
 */
export interface BulkUpdateMenuItemsPayload {
  items: BulkUpdateMenuItem[];
}

/**
 * Response returned after bulk updating menu items.
 */
export interface BulkUpdateMenuItemsResponse {
  status: string;
  message: string;
  data: MenuItem[];
}

/**
 * Order Address format.
 */
export interface OrderAddress {
  id: number;
  street: string;
  pretty_name: string;
  city: string;
  state: string;
  country: string;
  coordinate: {
    x: number;
    y: number;
  };
}

/**
 * Order Customer format.
 */
export interface OrderCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string | null;
}

/**
 * Item in an Order payload.
 */
export interface OrderItem {
  id: number;
  item_id: number;
  name: string;
  description: string;
  reference: string;
  type: 'item' | 'group' | string;
  pack_id: number;
  quantity: number;
  price_per_quantity: number;
  variant_id?: number;
  variant_reference?: string;
  variant_name?: string;
}

/**
 * Order timeline event details.
 */
export interface OrderTimelineEntry {
  action: string;
  description: string;
  created_at: string;
}

/**
 * Detailed Order object structure.
 */
export interface Order {
  id: number;
  reference: string;
  status: 'received' | 'accepted' | 'preparing' | 'awaiting_pickup' | 'picked' | 'arrived' | 'completed' | 'rejected' | string;
  summary: string;
  total_price: number;
  delivery_price: number;
  currency: string;
  source: string;
  class: string;
  created_at: string;
  updated_at: string;
  time_payment_confirmed: string | null;
  time_customer_received_order: string | null;
  actual_delivery_time: string | null;
  driver: Record<string, any>;
  customer: OrderCustomer;
  items: OrderItem[];
  timeline: OrderTimelineEntry[];
  customer_address: OrderAddress;
  vendor_address: OrderAddress;
  vendor_information: {
    name: string;
    reference?: string;
    webhook_url?: string;
  };
  customer_delivery_note?: string;
  customer_vendor_note?: string;
}

/**
 * Simplified Order information returned when listing orders.
 */
export interface OrderSummary {
  id: number;
  vendor_name: string;
  vendor_id: number;
  vendor_location: string;
  support_phone_number: string;
  total_price: number;
  created_at: string;
  status: string;
  updated_at: string;
  customer_address: string;
  vendor_address: string;
  class: string;
}

/**
 * Query parameters for listing orders.
 */
export interface ListOrdersQueryParams {
  page?: number;
  per_page?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Response returned when listing orders.
 */
export interface ListOrdersResponse {
  status: string;
  message: string;
  data: OrderSummary[];
}

/**
 * Response returned when retrieving a single order.
 */
export interface GetOrderResponse {
  status: string;
  message: string;
  data: Order;
}

/**
 * Response returned after accepting an order.
 */
export interface AcceptOrderResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Response returned after rejecting an order.
 */
export interface RejectOrderResponse {
  status: string;
  message: string;
  data?: Order;
}

/**
 * Response returned after marking an order as ready.
 */
export interface MarkOrderReadyResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Substitute item specification.
 */
export interface OrderSubstitutionReplacement {
  reference: string;
  quantity: string | number;
}

/**
 * Item substitution proposed structure.
 */
export interface OrderSubstitution {
  item_reference: string;
  pack_id: string | number;
  order_item_type: string;
  quantity_unavailable: string | number;
  replacements: OrderSubstitutionReplacement[];
}

/**
 * Payload for proposing item substitutions for an order.
 */
export interface SubmitOrderSubstitutionPayload {
  substitutions: OrderSubstitution[];
}

/**
 * Response returned after proposing order substitutions.
 */
export interface SubmitOrderSubstitutionResponse {
  status: string;
  message: string;
}

/**
 * Discount configuration.
 */
export interface Discount {
  reference: string;
  title: string;
  description: string;
  value: number;
  minimum_order_amount: number;
  expiry_date: string;
  maximum_usage_times: number;
  is_active: boolean;
  is_published: boolean;
}

/**
 * Payload for creating a discount.
 */
export interface CreateDiscountPayload {
  reference: string;
  title: string;
  description: string;
  type: 'flat_fee' | 'percentage_off' | string;
  value: string | number;
  category: 'price_slash_off_all_orders' | 'price_slash_off_menu' | string;
  expiry_date: string;
  maximum_usage_times: number;
  vendor_references: string[];
  minimum_order_amount: number;
  capped_amount?: number;
  menu_references?: string[];
}

/**
 * Response returned when listing discounts.
 */
export interface ListDiscountsResponse {
  status: string;
  message: string;
  data: Discount[];
}

/**
 * Response returned after creating a discount.
 */
export interface CreateDiscountResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Payload for activating discounts.
 */
export interface ActivateDiscountsPayload {
  references: string[];
}

/**
 * Response returned after activating discounts.
 */
export interface ActivateDiscountsResponse {
  status: string;
  message: string;
}

/**
 * Payload for deactivating discounts.
 */
export interface DeactivateDiscountsPayload {
  references: string[];
}

/**
 * Response returned after deactivating discounts.
 */
export interface DeactivateDiscountsResponse {
  status: string;
  message: string;
}

/**
 * Virtual bank account details associated with a Merchant wallet.
 */
export interface MerchantVirtualAccount {
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
}

/**
 * Response returned when retrieving the merchant wallet's virtual account.
 */
export interface GetMerchantVirtualAccountResponse {
  status: string;
  message: string;
  data: MerchantVirtualAccount;
}

/**
 * Response returned when retrieving Merchant wallet balance.
 */
export interface GetMerchantWalletBalanceResponse {
  status: string;
  message: string;
  data: {
    balance: number;
  };
}

/**
 * Response returned when retrieving Merchant wallet history.
 */
export interface GetMerchantWalletHistoryResponse {
  status: string;
  message: string;
  data: {
    history: WalletTransaction[];
  };
}

/**
 * Response returned when fetching the merchant profile.
 */
export interface GetMerchantProfileResponse {
  status: string;
  message: string;
  data: MerchantProfile;
}
