# Quick Start

Get up and running with the Crypto Payment Gateway in minutes.

## Prerequisites

Before you begin, ensure you have:

- API key from your gateway dashboard
- Basic understanding of REST APIs
- Development environment set up

## Step 1: Get Your API Key

1. Sign up for an account at [your-gateway.com](https://your-gateway.com)
2. Navigate to the API section in your dashboard
3. Generate a new API key
4. Save your API key securely

## Step 2: Make Your First API Call

Test your connection by listing available networks:

**Production:**
```bash
curl -X GET https://api.your-gateway.com/api/v1/networks \
  -H "X-Api-Key: your-api-key"
```

**Demo/Testing:**
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks \
  -H "X-Api-Key: demo-key"
```

::: tip Demo Environment
Try the demo API first: https://cp-merch-dev.wsdemo.online/api/openapi/

Use demo credentials for testing without real transactions.
:::

Expected response:
```json
[
  {
    "network": "ethereum",
    "status": "active",
    "lastBlock": 18500000
  },
  {
    "network": "bitcoin", 
    "status": "active",
    "lastBlock": 820000
  }
]
```

## Step 3: Create Your First Address

Create a cryptocurrency address to receive payments:

```bash
curl -X POST https://api.your-gateway.com/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: your-api-key" \
  -d '{
    "network": "ethereum"
  }'
```

Response:
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c4C87",
  "network": "ethereum",
  "affectedNetworks": ["ethereum"],
  "balances": [
    {
      "coin": "ethereum",
      "balance": "0",
      "contractAddress": null
    }
  ]
}
```

## Step 4: Monitor the Address

Check the balance of your newly created address:

```bash
curl -X GET https://api.your-gateway.com/api/v1/addresses/0x742d35Cc6634C0532925a3b8D4C9db96590c4C87 \
  -H "X-Api-Key: your-api-key"
```

## Step 5: Set Up Webhooks (Optional)

Configure webhooks to receive real-time notifications:

1. Set up an endpoint in your application to receive webhooks
2. Configure the webhook URL in your dashboard
3. Handle incoming webhook events

Example webhook payload:
```json
{
  "event": "transaction.confirmed",
  "data": {
    "txId": "0x123...",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c4C87",
    "amount": "1.5",
    "coin": "ethereum",
    "confirmations": 12
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Next Steps

Now that you have the basics working:

1. **Explore the API** - Check out our [complete API reference](../api/overview.md)
2. **Use an SDK** - Speed up development with our [official SDKs](../integration/getting-started.md)
3. **Learn about security** - Understand [authentication and best practices](../api/authentication.md)
4. **Handle withdrawals** - Learn how to [process withdrawals](../api/withdrawals.md)

## Need Help?

- 📖 [API Documentation](../api/overview.md)
- 💻 [Code Examples](../examples/basic-usage.md)
- 🔧 [Integration Guides](../integration/getting-started.md)
- 📧 [Contact Support](mailto:support@your-gateway.com) 