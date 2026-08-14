import type {
  AcceptOrderResponse,
  GetOrderResponse,
  ListOrdersQueryParams,
  ListOrdersResponse,
  MarkOrderReadyResponse,
  RejectOrderResponse,
  SubmitOrderSubstitutionPayload,
  SubmitOrderSubstitutionResponse,
} from '../../types/index.js';
import { BaseResource } from '../base.js';

export class MerchantOrdersResource extends BaseResource {
  /**
   * List orders for a merchant.
   * GET /merchant/{merchantReference}/orders
   */
  async list(
    merchantReference: string,
    query?: ListOrdersQueryParams,
  ): Promise<ListOrdersResponse> {
    return this.httpGet<ListOrdersResponse>(
      `/merchant/${merchantReference}/orders`,
      {
        query: query as Record<string, any>,
      },
    );
  }

  /**
   * Get details of a single order.
   * GET /merchant/{merchantReference}/order/{orderReference}
   */
  async get(
    merchantReference: string,
    orderReference: string,
  ): Promise<GetOrderResponse> {
    return this.httpGet<GetOrderResponse>(
      `/merchant/${merchantReference}/order/${orderReference}`,
    );
  }

  /**
   * Accept an order.
   * PUT /merchant/{merchantReference}/order/{orderReference}/accept
   */
  async accept(
    merchantReference: string,
    orderReference: string,
  ): Promise<AcceptOrderResponse> {
    return this.httpPut<AcceptOrderResponse>(
      `/merchant/${merchantReference}/order/${orderReference}/accept`,
    );
  }

  /**
   * Reject an order.
   * PUT /merchant/{merchantReference}/order/{orderReference}/reject
   */
  async reject(
    merchantReference: string,
    orderReference: string,
  ): Promise<RejectOrderResponse> {
    return this.httpPut<RejectOrderResponse>(
      `/merchant/${merchantReference}/order/${orderReference}/reject`,
    );
  }

  /**
   * Mark an order as ready for pickup.
   * PUT /merchant/{merchantReference}/order/{orderReference}/ready
   */
  async markReady(
    merchantReference: string,
    orderReference: string,
  ): Promise<MarkOrderReadyResponse> {
    return this.httpPut<MarkOrderReadyResponse>(
      `/merchant/${merchantReference}/order/${orderReference}/ready`,
    );
  }

  /**
   * Propose item substitutions for an order.
   * POST /merchant/{merchantReference}/order/{orderReference}/substitution
   */
  async substitute(
    merchantReference: string,
    orderReference: string,
    payload: SubmitOrderSubstitutionPayload,
  ): Promise<SubmitOrderSubstitutionResponse> {
    return this.httpPost<SubmitOrderSubstitutionResponse>(
      `/merchant/${merchantReference}/order/${orderReference}/substitution`,
      payload,
    );
  }
}
