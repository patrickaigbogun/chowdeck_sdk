import { BaseResource } from '../base.js';
import type {
  CreateMenuCategoryPayload,
  CreateMenuCategoryResponse,
  UpdateMenuCategoryPayload,
  UpdateMenuCategoryResponse,
  ListMenuCategoriesResponse,
  CreateMenuItemPayload,
  CreateMenuItemResponse,
  ListMenuItemsResponse,
  GetMenuItemResponse,
  BulkCreateMenuItemsPayload,
  BulkCreateMenuItemsResponse,
  BulkUpdateMenuItemsPayload,
  BulkUpdateMenuItemsResponse,
} from '../../types/index.js';

export class MerchantMenusResource extends BaseResource {
  /**
   * List menu categories for a merchant.
   * GET /merchant/{merchantReference}/menucategory
   */
  async listCategories(merchantReference: string): Promise<ListMenuCategoriesResponse> {
    return this.httpGet<ListMenuCategoriesResponse>(`/merchant/${merchantReference}/menucategory`);
  }

  /**
   * Create a menu category.
   * POST /merchant/{merchantReference}/menucategory
   */
  async createCategory(
    merchantReference: string,
    payload: CreateMenuCategoryPayload
  ): Promise<CreateMenuCategoryResponse> {
    return this.httpPost<CreateMenuCategoryResponse>(`/merchant/${merchantReference}/menucategory`, payload);
  }

  /**
   * Update a menu category.
   * PUT /merchant/{merchantReference}/menucategory/{categoryReference}
   */
  async updateCategory(
    merchantReference: string,
    categoryReference: string,
    payload: UpdateMenuCategoryPayload
  ): Promise<UpdateMenuCategoryResponse> {
    return this.httpPut<UpdateMenuCategoryResponse>(
      `/merchant/${merchantReference}/menucategory/${categoryReference}`,
      payload
    );
  }

  /**
   * List menu items for a merchant.
   * GET /merchant/{merchantReference}/menu/items
   */
  async listItems(merchantReference: string): Promise<ListMenuItemsResponse> {
    return this.httpGet<ListMenuItemsResponse>(`/merchant/${merchantReference}/menu/items`);
  }

  /**
   * Create a menu item.
   * POST /merchant/{merchantReference}/menu/items
   */
  async createItem(
    merchantReference: string,
    payload: CreateMenuItemPayload
  ): Promise<CreateMenuItemResponse> {
    return this.httpPost<CreateMenuItemResponse>(`/merchant/${merchantReference}/menu/items`, payload);
  }

  /**
   * Get a specific menu item.
   * GET /merchant/{merchantReference}/menu/items/{itemReference}
   */
  async getItem(
    merchantReference: string,
    itemReference: string
  ): Promise<GetMenuItemResponse> {
    return this.httpGet<GetMenuItemResponse>(`/merchant/${merchantReference}/menu/items/${itemReference}`);
  }

  /**
   * Bulk create menu items.
   * POST /merchant/{merchantReference}/menu/items/bulk
   */
  async bulkCreateItems(
    merchantReference: string,
    payload: BulkCreateMenuItemsPayload
  ): Promise<BulkCreateMenuItemsResponse> {
    return this.httpPost<BulkCreateMenuItemsResponse>(`/merchant/${merchantReference}/menu/items/bulk`, payload);
  }

  /**
   * Bulk update menu items.
   * PUT /merchant/{merchantReference}/menu/items/bulk
   */
  async bulkUpdateItems(
    merchantReference: string,
    payload: BulkUpdateMenuItemsPayload
  ): Promise<BulkUpdateMenuItemsResponse> {
    return this.httpPut<BulkUpdateMenuItemsResponse>(`/merchant/${merchantReference}/menu/items/bulk`, payload);
  }
}
