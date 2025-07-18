# Webhooks API

Webhooks allow you to receive real-time notifications about events in your payment gateway.

::: tip Interactive Testing
On this page you can test webhook management in real time! Enter your API key in the field below and click the "Test" buttons to send requests to the server `https://cp-merch-dev.wsdemo.online/api`.

**If you encounter CORS errors:**
- Use the "📋 Copy curl" buttons to get ready-to-use commands
- Execute commands in terminal or use Postman
- Install a browser extension to disable CORS (e.g., "CORS Unblock")
:::

## Overview

Webhooks are HTTP POST requests sent to your specified endpoint when certain events occur. This enables you to:

- Process payments in real-time
- Update order statuses automatically
- Monitor transaction confirmations
- Handle withdrawal completions

## Webhook Events

### Transaction Events

#### `transaction.confirmed`
Triggered when a transaction receives sufficient confirmations.

```json
{
  "event": "transaction.confirmed",
  "data": {
    "id": "tx_1234567890",
    "address_id": "addr_abcdef123456",
    "hash": "0x1234567890abcdef...",
    "amount": "100.50",
    "coin": "usdt",
    "network": "ethereum",
    "confirmations": 12,
    "status": "confirmed",
    "created_at": "2025-01-01T12:00:00Z",
    "confirmed_at": "2025-01-01T12:15:00Z"
  }
}
```

#### `transaction.failed`
Triggered when a transaction fails or is rejected.

```json
{
  "event": "transaction.failed",
  "data": {
    "id": "tx_1234567890",
    "address_id": "addr_abcdef123456",
    "hash": "0x1234567890abcdef...",
    "amount": "100.50",
    "coin": "usdt",
    "network": "ethereum",
    "status": "failed",
    "error": "Insufficient gas",
    "created_at": "2025-01-01T12:00:00Z",
    "failed_at": "2025-01-01T12:05:00Z"
  }
}
```

### Address Events

#### `address.balance_updated`
Triggered when an address balance changes.

```json
{
  "event": "address.balance_updated",
  "data": {
    "id": "addr_abcdef123456",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "network": "ethereum",
    "coin": "usdt",
    "balance": {
      "total": "250.75",
      "confirmed": "200.25",
      "unconfirmed": "50.50"
    },
    "previous_balance": {
      "total": "150.25",
      "confirmed": "150.25",
      "unconfirmed": "0.00"
    },
    "updated_at": "2025-01-01T12:00:00Z"
  }
}
```

### Withdrawal Events

#### `withdrawal.completed`
Triggered when a withdrawal is successfully processed.

```json
{
  "event": "withdrawal.completed",
  "data": {
    "id": "wd_1234567890",
    "amount": "100.00",
    "coin": "usdt",
    "network": "ethereum",
    "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "hash": "0x1234567890abcdef...",
    "fee": "2.50",
    "status": "completed",
    "created_at": "2025-01-01T12:00:00Z",
    "completed_at": "2025-01-01T12:10:00Z"
  }
}
```

## Webhook Security

### Signature Verification

All webhooks include a signature in the `X-Gateway-Signature` header. Verify this signature to ensure the webhook is from our service.

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}

// Usage
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-gateway-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  const { event, data } = req.body;
  // ... handle event
  
  res.status(200).send('OK');
});
```

## Managing Webhooks

<!-- API Key Configuration Section -->
<div class="api-key-section">
  <h4>API Configuration</h4>
  <div class="api-key-controls">
    <div class="api-key-input-group">
      <label for="global-api-key">API Key:</label>
      <input type="text" id="global-api-key" class="api-key-input" placeholder="sk_test_demo_key_12345" />
    </div>
    <button onclick="setGlobalApiKey()" class="set-api-key-button">Set API Key</button>
  </div>
  <div class="api-key-status"></div>
</div>

### Create Webhook

<div class="api-demo">
  <div class="demo-controls">
    <label for="webhook-url">Webhook URL:</label>
    <input type="text" id="webhook-url" placeholder="https://your-domain.com/webhook" />
    <div class="button-group">
      <button onclick="testCreateWebhook()" class="test-button">Test Create</button>
      <button onclick="copyCurlCommand('/webhooks', {method: 'POST', body: JSON.stringify({url: 'https://your-domain.com/webhook', events: ['transaction.confirmed'], active: true})})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```http
POST /api/v1/webhooks
```

```json
{
  "url": "https://your-domain.com/webhook",
  "events": [
    "transaction.confirmed",
    "transaction.failed",
    "address.balance_updated",
    "withdrawal.completed"
  ],
  "description": "Main webhook endpoint",
  "active": true
}
```

### List Webhooks

<div class="api-demo">
  <div class="demo-controls">
    <div class="button-group">
      <button onclick="testListWebhooks()" class="test-button">Test List</button>
      <button onclick="copyCurlCommand('/webhooks', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```http
GET /api/v1/webhooks
```

### Update Webhook

```http
PUT /api/v1/webhooks/{webhook_id}
```

### Delete Webhook

```http
DELETE /api/v1/webhooks/{webhook_id}
```

## Best Practices

### Idempotency
Handle duplicate webhooks gracefully by implementing idempotency checks:

```javascript
const processedEvents = new Set();

app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  const eventId = data.id;
  
  if (processedEvents.has(eventId)) {
    return res.status(200).send('Already processed');
  }
  
  // Process event
  processEvent(event, data);
  processedEvents.add(eventId);
  
  res.status(200).send('OK');
});
```

### Error Handling
Return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad request
- `401` - Unauthorized
- `500` - Server error

### Retry Logic
We implement exponential backoff for failed webhooks:

- Initial retry: 1 second
- Second retry: 2 seconds
- Third retry: 4 seconds
- Maximum retries: 5 attempts

### Timeout
Webhook endpoints should respond within 30 seconds.

## Testing Webhooks

### Local Development
Use tools like ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose local port
ngrok http 3000

# Use the provided URL for webhook configuration
```

### Webhook Testing Tool
We provide a webhook testing tool in your dashboard to send test events to your endpoints.

## Troubleshooting

### Common Issues

1. **Webhook not received**
   - Check firewall settings
   - Verify URL accessibility
   - Check webhook configuration

2. **Signature verification fails**
   - Ensure you're using the correct webhook secret
   - Verify payload is not modified
   - Check header name case sensitivity

3. **Duplicate events**
   - Implement idempotency checks
   - Use event IDs for deduplication

### Webhook Logs
View webhook delivery logs in your dashboard to debug issues.

## Rate Limits

- Maximum 1000 webhooks per minute per endpoint
- Maximum 10 concurrent webhook deliveries per endpoint

## Related Resources

- [Authentication](./authentication.md)
- [Error Handling](../guide/error-handling.md)
- [Examples](../examples/webhooks.md) 