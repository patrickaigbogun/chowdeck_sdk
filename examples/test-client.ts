import { chowdeck, ChowdeckAPIError, ChowdeckConnectionError } from '../src/index.js';

// Load credentials from environment or fallback to sandbox placeholder
const apiKey = process.env.CHOWDECK_API_KEY!;
const baseUrl = process.env.CHOWDECK_BASE_URL || 'https://api.chowdeck.com';

const client = chowdeck({ apiKey, baseUrl });

console.log('--------------------------------------------------');
console.log('Chowdeck SDK Live API Request Verification');
console.log('--------------------------------------------------');
console.log(`Using Base URL: ${client.baseUrl}`);
console.log(`Using API Key:  ${client.apiKey.substring(0, 10)}...`);
console.log('--------------------------------------------------\n');

async function testApiCall() {
  try {
    console.log('Executing live API request: GET /relay/wallet/balance...');
    const balance = await client.r.wallet.getBalance();
    
    console.log('\n✅ Request Succeeded!');
    console.log('Response data:', JSON.stringify(balance, null, 2));
  } catch (error) {
    console.log('\n❌ Request Failed!');
    if (error instanceof ChowdeckAPIError) {
      console.log('Caught expected ChowdeckAPIError:');
      console.log(`- Status Code:      ${error.statusCode}`);
      console.log(`- Error Message:    ${error.message}`);
      console.log(`- Response Payload:`, error.responseData);
      console.log(`- Request URL:      ${error.requestDetails?.url}`);
    } else if (error instanceof ChowdeckConnectionError) {
      console.log('Caught ChowdeckConnectionError (Network failure):');
      console.log(`- Message:          ${error.message}`);
      console.log(`- Original Error:   `, error.originalError);
    } else {
      console.log('Caught unexpected error:', error);
    }
  }
}

await testApiCall();
console.log('\n--------------------------------------------------');
