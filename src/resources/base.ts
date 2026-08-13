import { ChowdeckAPIError, ChowdeckConnectionError } from '../errors.js';

export interface RequestOptions {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
}

/**
 * Base class for Chowdeck API resource groups.
 * Provides helper methods for making standard HTTP requests using native fetch.
 */
export abstract class BaseResource {
  protected client: {
    apiKey: string;
    baseUrl: string;
  };

  constructor(client: { apiKey: string; baseUrl: string }) {
    this.client = client;
  }

  /**
   * Helper method to perform a HTTP request.
   */
  protected async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = new URL(`${this.client.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`);

    if (options?.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers = new Headers({
      'Authorization': `Bearer ${this.client.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    });

    let requestBody: string | undefined;
    if (body) {
      requestBody = JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method,
        headers,
        body: requestBody,
      });
    } catch (error) {
      throw new ChowdeckConnectionError(
        `Failed to establish connection to Chowdeck API at ${url.toString()}`,
        error instanceof Error ? error : new Error(String(error))
      );
    }

    let responseData: unknown;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }
    } else {
      try {
        responseData = await response.text();
      } catch {
        responseData = null;
      }
    }

    if (!response.ok) {
      throw new ChowdeckAPIError(
        `Chowdeck API Request Failed: ${method} ${path}`,
        response.status,
        responseData,
        { url: url.toString(), method }
      );
    }

    return responseData as T;
  }

  protected httpGet<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  protected httpPost<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  protected httpPut<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  protected httpPatch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  protected httpDelete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}
