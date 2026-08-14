import { MerchantResource } from './resources/merchant.js';
import { RelayResource } from './resources/relay.js';

export interface ChowdeckConfig {
  /**
   * The secret API key used for authenticating requests.
   */
  apiKey: string;

  /**
   * Optional base URL override for the Chowdeck API.
   * Defaults to 'https://api.chowdeck.com'.
   */
  baseUrl?: string;
}

/**
 * Main Chowdeck SDK Client.
 * Provides access to all API resources (Merchant and Relay).
 */
export class Chowdeck {
  public readonly apiKey: string;
  public readonly baseUrl: string;

  /**
   * Resource group for Chowdeck Merchant API endpoints.
   */
  public readonly merchant: MerchantResource;

  /**
   * Resource group for Chowdeck Relay API endpoints.
   */
  public readonly relay: RelayResource;

  /**
   * Alias for the merchant resource group.
   */
  public readonly m: MerchantResource;

  /**
   * Alias for the relay resource group.
   */
  public readonly r: RelayResource;

  constructor(config: ChowdeckConfig) {
    if (!config.apiKey) {
      throw new Error(
        'Chowdeck API key is required. Make sure to provide a valid apiKey.',
      );
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.chowdeck.com';

    this.merchant = new MerchantResource(this);
    this.relay = new RelayResource(this);

    // Fluent aliases
    this.m = this.merchant;
    this.r = this.relay;
  }
}

/**
 * Factory function to create a new Chowdeck client instance.
 *
 * @param config - The client configuration object.
 * @returns A new Chowdeck client instance.
 */
export function chowdeck(config: ChowdeckConfig): Chowdeck {
  return new Chowdeck(config);
}
