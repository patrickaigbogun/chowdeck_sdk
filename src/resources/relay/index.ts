import type {
  GetRedeliveryFeePayload,
  GetRedeliveryFeeResponse,
  RequestRedeliveryPayload,
  RequestRedeliveryResponse,
} from '../../types/index.js';
import type { RequestOptions } from '../base.js';
import { BaseResource } from '../base.js';
import { Deliveries } from './deliveries.js';
import { Wallet } from './wallet.js';

/**
 * Resource class for interacting with the Chowdeck Relay APIs.
 * Orchestrates sub-resources for Deliveries and Wallet and handles redeliveries.
 */
export class RelayResource extends BaseResource {
  /**
   * Sub-client for interacting with Relay deliveries.
   */
  public readonly deliveries = new Deliveries(this.client);

  /**
   * Sub-client for interacting with the Relay wallet.
   */
  public readonly wallet = new Wallet(this.client);

  /**
   * Calculate the fee for re-attempting a cancelled or failed delivery.
   * The returned fee ID is required to request a redelivery.
   *
   * @param payload - The redelivery fee quote request payload.
   * @param options - Additional request options.
   * @returns A promise resolving to the redelivery fee quote.
   */
  async quoteRedelivery(
    payload: GetRedeliveryFeePayload,
    options?: RequestOptions,
  ): Promise<GetRedeliveryFeeResponse> {
    return this.httpPost<GetRedeliveryFeeResponse>(
      '/relay/redelivery/fee',
      payload,
      options,
    );
  }

  /**
   * Request a redelivery for a cancelled or failed delivery.
   * Requires a fee ID from the Get Redelivery Fee endpoint.
   *
   * @param payload - The request redelivery payload.
   * @param options - Additional request options.
   * @returns A promise resolving to the redelivery request details.
   */
  async requestRedelivery(
    payload: RequestRedeliveryPayload,
    options?: RequestOptions,
  ): Promise<RequestRedeliveryResponse> {
    return this.httpPost<RequestRedeliveryResponse>(
      '/relay/redelivery',
      payload,
      options,
    );
  }
}
export { Deliveries } from './deliveries.js';
export { Wallet } from './wallet.js';
