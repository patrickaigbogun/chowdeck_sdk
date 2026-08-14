import type {
  GetRelayVirtualAccountResponse,
  GetRelayWalletBalanceResponse,
  GetRelayWalletHistoryResponse,
} from '../../types/index.js';
import type { RequestOptions } from '../base.js';
import { BaseResource } from '../base.js';

/**
 * Resource class for interacting with the Chowdeck Relay Wallet APIs.
 */
export class Wallet extends BaseResource {
  /**
   * Retrieve the current wallet balance for your relay account.
   *
   * @param options - Additional request options (headers, query parameters).
   * @returns A promise resolving to the wallet balance.
   */
  async getBalance(
    options?: RequestOptions,
  ): Promise<GetRelayWalletBalanceResponse> {
    return this.httpGet<GetRelayWalletBalanceResponse>(
      '/relay/wallet/balance',
      options,
    );
  }

  /**
   * Retrieve the virtual bank account details associated with your relay wallet, used for funding your account.
   *
   * @param options - Additional request options (headers, query parameters).
   * @returns A promise resolving to the virtual bank account details.
   */
  async getAccount(
    options?: RequestOptions,
  ): Promise<GetRelayVirtualAccountResponse> {
    return this.httpGet<GetRelayVirtualAccountResponse>(
      '/relay/wallet/virtual-account',
      options,
    );
  }

  /**
   * Retrieve your relay wallet transaction history. Supports filtering by date range.
   *
   * @param options - Additional request options (headers, query parameters).
   * @returns A promise resolving to the wallet transaction history.
   */
  async getHistory(
    options?: RequestOptions,
  ): Promise<GetRelayWalletHistoryResponse> {
    return this.httpGet<GetRelayWalletHistoryResponse>(
      '/relay/wallet/history',
      options,
    );
  }
}
