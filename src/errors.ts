/**
 * Base class for all Chowdeck SDK errors.
 */
export class ChowdeckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChowdeckError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the Chowdeck API returns a non-2xx status code.
 */
export class ChowdeckAPIError extends ChowdeckError {
  /**
   * The HTTP status code of the error response.
   */
  public readonly statusCode: number;

  /**
   * The parsed response body from the API, if any.
   */
  public readonly responseData: unknown;

  /**
   * The request details that triggered the error.
   */
  public readonly requestDetails?: {
    url: string;
    method: string;
  };

  constructor(
    message: string,
    statusCode: number,
    responseData: unknown,
    requestDetails?: { url: string; method: string },
  ) {
    // Try to extract a specific error message from the response payload
    let computedMessage = message;
    if (responseData && typeof responseData === 'object') {
      const data = responseData as Record<string, unknown>;
      const extractedMessage = data.message || data.error;
      if (typeof extractedMessage === 'string') {
        computedMessage = extractedMessage;
      }
    }

    super(
      computedMessage || `Chowdeck API returned a ${statusCode} status code.`,
    );
    this.name = 'ChowdeckAPIError';
    this.statusCode = statusCode;
    this.responseData = responseData;
    this.requestDetails = requestDetails;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a network request to the Chowdeck API fails (e.g. DNS resolution, timeout, loss of connection).
 */
export class ChowdeckConnectionError extends ChowdeckError {
  public readonly originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'ChowdeckConnectionError';
    this.originalError = originalError;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
