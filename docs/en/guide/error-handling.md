# Error Handling

Comprehensive guide to handling errors in the crypto payment gateway.

## Error Response Format

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": "Missing required field: network",
    "request_id": "req_1234567890"
  }
}
```

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid parameters |
| `401` | Unauthorized - Invalid API key |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Resource already exists |
| `422` | Unprocessable Entity - Validation failed |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |
| `503` | Service Unavailable |

## Error Codes

### Authentication Errors

#### `INVALID_API_KEY`
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid"
  }
}
```

#### `EXPIRED_API_KEY`
```json
{
  "error": {
    "code": "EXPIRED_API_KEY",
    "message": "The API key has expired"
  }
}
```

### Validation Errors

#### `INVALID_REQUEST`
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": "Missing required field: network"
  }
}
```

#### `INVALID_NETWORK`
```json
{
  "error": {
    "code": "INVALID_NETWORK",
    "message": "The specified network is not supported",
    "details": "Supported networks: bitcoin, ethereum, tron, polygon, bsc, arbitrum, fantom, litecoin"
  }
}
```

### Resource Errors

#### `RESOURCE_NOT_FOUND`
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": "Address with ID addr_123 not found"
  }
}
```

#### `INSUFFICIENT_BALANCE`
```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance for withdrawal",
    "details": "Available: 50.00 USDT, Requested: 100.00 USDT"
  }
}
```

### Rate Limiting

#### `RATE_LIMIT_EXCEEDED`
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": "Maximum 100 requests per minute allowed"
  }
}
```

## Error Handling Best Practices

### 1. Always Check Status Codes

```javascript
async function makeRequest(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}
```

### 2. Implement Retry Logic

```javascript
async function retryRequest(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}
```

### 3. Handle Specific Error Types

```javascript
async function createAddress(params) {
  try {
    const response = await gateway.addresses.create(params);
    return response.data;
  } catch (error) {
    switch (error.code) {
      case 'INVALID_NETWORK':
        throw new Error('Please select a supported network');
      case 'RATE_LIMIT_EXCEEDED':
        throw new Error('Too many requests. Please try again later');
      case 'INSUFFICIENT_PERMISSIONS':
        throw new Error('API key does not have permission for this operation');
      default:
        throw new Error('Failed to create address. Please try again');
    }
  }
}
```

### 4. Log Errors for Debugging

```javascript
function logError(error, context = {}) {
  console.error('API Error:', {
    message: error.message,
    code: error.code,
    status: error.status,
    requestId: error.request_id,
    context,
    timestamp: new Date().toISOString()
  });
}
```

## SDK Error Handling

### JavaScript/TypeScript

```typescript
import { Gateway, GatewayError } from '@gateway/crypto-payment-sdk';

const gateway = new Gateway({ apiKey: 'your-api-key' });

try {
  const address = await gateway.addresses.create({
    network: 'ethereum',
    coin: 'usdt',
    type: 'user'
  });
} catch (error) {
  if (error instanceof GatewayError) {
    console.error('Gateway Error:', error.code, error.message);
    
    // Handle specific errors
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Wait and retry
      setTimeout(() => {
        // Retry logic
      }, 60000);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Python

```python
from gateway import Gateway, GatewayError

gateway = Gateway(api_key='your-api-key')

try:
    address = gateway.addresses.create(
        network='ethereum',
        coin='usdt',
        type='user'
    )
except GatewayError as e:
    print(f"Gateway Error: {e.code} - {e.message}")
    
    if e.code == 'RATE_LIMIT_EXCEEDED':
        # Wait and retry
        time.sleep(60)
        # Retry logic
except Exception as e:
    print(f"Unexpected error: {e}")
```

### Go

```go
package main

import (
    "context"
    "log"
    "time"
    
    "github.com/gateway/crypto-payment-go"
)

func main() {
    client := gateway.NewClient(&gateway.Config{
        APIKey: "your-api-key",
    })
    
    address, err := client.Addresses.Create(context.Background(), &gateway.CreateAddressRequest{
        Network: "ethereum",
        Coin:    "usdt",
        Type:    "user",
    })
    
    if err != nil {
        if gatewayErr, ok := err.(*gateway.Error); ok {
            log.Printf("Gateway Error: %s - %s", gatewayErr.Code, gatewayErr.Message)
            
            switch gatewayErr.Code {
            case "RATE_LIMIT_EXCEEDED":
                time.Sleep(60 * time.Second)
                // Retry logic
            case "INSUFFICIENT_BALANCE":
                log.Println("Not enough balance for this operation")
            }
        } else {
            log.Printf("Unexpected error: %v", err)
        }
        return
    }
    
    log.Printf("Address created: %s", address.Address)
}
```

## Webhook Error Handling

### Handling Failed Webhooks

```javascript
app.post('/webhook', async (req, res) => {
  try {
    // Verify signature
    if (!verifySignature(req.body, req.headers['x-gateway-signature'])) {
      return res.status(401).send('Invalid signature');
    }
    
    const { event, data } = req.body;
    
    // Process event
    await processEvent(event, data);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing failed:', error);
    
    // Return 500 to trigger retry
    res.status(500).send('Processing failed');
  }
});
```

### Idempotency for Webhooks

```javascript
const processedEvents = new Map();

async function processEvent(event, data) {
  const eventId = data.id;
  
  // Check if already processed
  if (processedEvents.has(eventId)) {
    console.log(`Event ${eventId} already processed`);
    return;
  }
  
  try {
    // Process the event
    await handleEvent(event, data);
    
    // Mark as processed
    processedEvents.set(eventId, Date.now());
    
    // Clean up old entries (older than 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [id, timestamp] of processedEvents.entries()) {
      if (timestamp < oneDayAgo) {
        processedEvents.delete(id);
      }
    }
  } catch (error) {
    console.error(`Failed to process event ${eventId}:`, error);
    throw error;
  }
}
```

## Monitoring and Alerting

### Error Rate Monitoring

```javascript
class ErrorTracker {
  constructor() {
    this.errors = new Map();
  }
  
  trackError(error) {
    const minute = Math.floor(Date.now() / 60000);
    const key = `${minute}-${error.code}`;
    
    this.errors.set(key, (this.errors.get(key) || 0) + 1);
    
    // Alert if error rate is high
    if (this.errors.get(key) > 10) {
      this.sendAlert(`High error rate for ${error.code}`);
    }
  }
  
  sendAlert(message) {
    // Send to monitoring service
    console.error('ALERT:', message);
  }
}
```

## Testing Error Scenarios

### Unit Tests

```javascript
describe('Error Handling', () => {
  it('should handle invalid network error', async () => {
    const gateway = new Gateway({ apiKey: 'test-key' });
    
    try {
      await gateway.addresses.create({
        network: 'invalid-network',
        coin: 'usdt',
        type: 'user'
      });
      
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.code).toBe('INVALID_NETWORK');
      expect(error.message).toContain('not supported');
    }
  });
});
```

## Related Resources

- [API Reference](../api/overview.md)
- [Webhooks](../api/webhooks.md)
- [Rate Limits](./rate-limits.md) 