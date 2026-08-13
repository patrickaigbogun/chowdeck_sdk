import { BaseResource } from '../base.js';
import type {
  CreateDiscountPayload,
  ListDiscountsResponse,
  CreateDiscountResponse,
  ActivateDiscountsPayload,
  ActivateDiscountsResponse,
  DeactivateDiscountsPayload,
  DeactivateDiscountsResponse,
} from '../../types/index.js';

export class MerchantDiscountsResource extends BaseResource {
  /**
   * List discounts for a merchant.
   * GET /merchant/{merchantReference}/discounts
   */
  async list(merchantReference: string): Promise<ListDiscountsResponse> {
    return this.httpGet<ListDiscountsResponse>(`/merchant/${merchantReference}/discounts`);
  }

  /**
   * Create a discount.
   * POST /merchant/{merchantReference}/discounts
   */
  async create(
    merchantReference: string,
    payload: CreateDiscountPayload
  ): Promise<CreateDiscountResponse> {
    return this.httpPost<CreateDiscountResponse>(`/merchant/${merchantReference}/discounts`, payload);
  }

  /**
   * Update an existing discount.
   * PUT /merchant/{merchantReference}/discounts/{discountReference}
   */
  async update(
    merchantReference: string,
    discountReference: string,
    payload: Partial<CreateDiscountPayload>
  ): Promise<CreateDiscountResponse> {
    return this.httpPut<CreateDiscountResponse>(
      `/merchant/${merchantReference}/discounts/${discountReference}`,
      payload
    );
  }

  /**
   * Activate discounts.
   * PATCH /merchant/{merchantReference}/discounts/activate
   */
  async activate(
    merchantReference: string,
    payload: ActivateDiscountsPayload
  ): Promise<ActivateDiscountsResponse> {
    return this.httpPatch<ActivateDiscountsResponse>(
      `/merchant/${merchantReference}/discounts/activate`,
      payload
    );
  }

  /**
   * Deactivate discounts.
   * DELETE /merchant/{merchantReference}/discounts/deactivate
   */
  async deactivate(
    merchantReference: string,
    payload: DeactivateDiscountsPayload
  ): Promise<DeactivateDiscountsResponse> {
    // Standard BaseResource.httpDelete does not take a body, so we call request directly.
    return this.request<DeactivateDiscountsResponse>(
      'DELETE',
      `/merchant/${merchantReference}/discounts/deactivate`,
      payload
    );
  }
}
