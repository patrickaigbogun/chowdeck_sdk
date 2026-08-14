import type {
  GetMerchantProfileResponse,
  GetMerchantVirtualAccountResponse,
  GetMerchantWalletBalanceResponse,
  GetMerchantWalletHistoryResponse,
  GetVendorReviewsQueryParams,
  GetVendorReviewsResponse,
  UpdateMerchantPayload,
  UpdateMerchantResponse,
} from '../../types/index.js';
import { BaseResource } from '../base.js';
import { MerchantDiscountsResource } from './discounts.js';
import { MerchantMenusResource } from './menus.js';
import { MerchantOrdersResource } from './orders.js';

export class MerchantResource extends BaseResource {
  public readonly orders: MerchantOrdersResource;
  public readonly menus: MerchantMenusResource;
  public readonly discounts: MerchantDiscountsResource;

  constructor(client: { apiKey: string; baseUrl: string }) {
    super(client);
    this.orders = new MerchantOrdersResource(client);
    this.menus = new MerchantMenusResource(client);
    this.discounts = new MerchantDiscountsResource(client);
  }

  /**
   * Get merchant profile details.
   * GET /merchant/{merchantReference}
   */
  async getProfile(
    merchantReference: string,
  ): Promise<GetMerchantProfileResponse> {
    return this.httpGet<GetMerchantProfileResponse>(
      `/merchant/${merchantReference}`,
    );
  }

  /**
   * Update merchant profile details.
   * PUT /merchant/{merchantReference}
   */
  async updateProfile(
    merchantReference: string,
    payload: UpdateMerchantPayload,
  ): Promise<UpdateMerchantResponse> {
    return this.httpPut<UpdateMerchantResponse>(
      `/merchant/${merchantReference}`,
      payload,
    );
  }

  /**
   * Get customer reviews and ratings for a merchant.
   * GET /merchant/{merchantReference}/reviews
   */
  async getReviews(
    merchantReference: string,
    query?: GetVendorReviewsQueryParams,
  ): Promise<GetVendorReviewsResponse> {
    return this.httpGet<GetVendorReviewsResponse>(
      `/merchant/${merchantReference}/reviews`,
      {
        query: query as Record<string, any>,
      },
    );
  }

  /**
   * Get virtual bank account details associated with the merchant's wallet.
   * GET /merchant/{merchantReference}/wallet/virtual-account
   */
  async getVirtualAccount(
    merchantReference: string,
  ): Promise<GetMerchantVirtualAccountResponse> {
    return this.httpGet<GetMerchantVirtualAccountResponse>(
      `/merchant/${merchantReference}/wallet/virtual-account`,
    );
  }

  /**
   * Get the current balance of the merchant's wallet.
   * GET /merchant/{merchantReference}/wallet/balance
   */
  async getWalletBalance(
    merchantReference: string,
  ): Promise<GetMerchantWalletBalanceResponse> {
    return this.httpGet<GetMerchantWalletBalanceResponse>(
      `/merchant/${merchantReference}/wallet/balance`,
    );
  }

  /**
   * Get the transaction history of the merchant's wallet.
   * GET /merchant/{merchantReference}/wallet/history
   */
  async getWalletHistory(
    merchantReference: string,
  ): Promise<GetMerchantWalletHistoryResponse> {
    return this.httpGet<GetMerchantWalletHistoryResponse>(
      `/merchant/${merchantReference}/wallet/history`,
    );
  }
}
