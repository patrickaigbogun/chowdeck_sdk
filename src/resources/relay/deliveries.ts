import type {
  CancelRelayDeliveryPayload,
  CancelRelayDeliveryResponse,
  CreateRelayDeliveryPayload,
  CreateRelayDeliveryResponse,
  GetDeliveryFeePayload,
  GetDeliveryFeeResponse,
  GetRelayDeliveryResponse,
} from '../../types/index.js';
import type { RequestOptions } from '../base.js';
import { BaseResource } from '../base.js';

/**
 * Resource class for interacting with Chowdeck Relay Deliveries APIs.
 */
export class Deliveries extends BaseResource {
  /**
   * Calculate the delivery fee for a relay delivery.
   * The returned fee ID is required to create a delivery.
   *
   * @param payload - The delivery fee quote request payload.
   * @param options - Additional request options.
   * @returns A promise resolving to the delivery fee quote details.
   */
  async quote(
    payload: GetDeliveryFeePayload,
    options?: RequestOptions,
  ): Promise<GetDeliveryFeeResponse> {
    return this.httpPost<GetDeliveryFeeResponse>(
      '/relay/delivery/fee',
      payload,
      options,
    );
  }

  /**
   * Initiate a new relay delivery using a fee ID from the Get Delivery Fee endpoint.
   *
   * @param payload - The create delivery request payload.
   * @param options - Additional request options.
   * @returns A promise resolving to the created delivery details.
   */
  async create(
    payload: CreateRelayDeliveryPayload,
    options?: RequestOptions,
  ): Promise<CreateRelayDeliveryResponse> {
    return this.httpPost<CreateRelayDeliveryResponse>(
      '/relay/delivery',
      payload,
      options,
    );
  }

  /**
   * Retrieve the current status and full details of a relay delivery by its reference.
   *
   * @param reference - The unique reference of the delivery.
   * @param options - Additional request options.
   * @returns A promise resolving to the delivery details.
   */
  async get<T = GetRelayDeliveryResponse>(
    reference: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(
      'GET',
      `/relay/delivery/${encodeURIComponent(reference)}`,
      undefined,
      options,
    );
  }

  /**
   * Cancel an active relay delivery. A cancellation reason is required.
   *
   * @param reference - The unique reference of the delivery to cancel.
   * @param payload - The cancellation payload containing the reason.
   * @param options - Additional request options.
   * @returns A promise resolving to the cancel delivery response.
   */
  async cancel(
    reference: string,
    payload: CancelRelayDeliveryPayload,
    options?: RequestOptions,
  ): Promise<CancelRelayDeliveryResponse> {
    return this.httpPost<CancelRelayDeliveryResponse>(
      `/relay/delivery/${encodeURIComponent(reference)}/cancel`,
      payload,
      options,
    );
  }
}
