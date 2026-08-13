export { Chowdeck, chowdeck } from './client.js';
export type { ChowdeckConfig } from './client.js';

export {
  ChowdeckError,
  ChowdeckAPIError,
  ChowdeckConnectionError,
} from './errors.js';

export { nairaToKobo, koboToNaira } from './utils/currency.js';
export { verifySignature } from './utils/signature.js';

export { MerchantResource } from './resources/merchant.js';
export { RelayResource } from './resources/relay.js';
export { BaseResource } from './resources/base.js';
