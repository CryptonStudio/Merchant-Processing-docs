# Demo API Environment

The Crypto Payment Gateway provides a demo environment for testing and development purposes.

## Demo API Details

**Base URL:** `https://cp-merch-dev.wsdemo.online/api`

**OpenAPI Documentation:** https://cp-merch-dev.wsdemo.online/api/openapi/

## API Examples

Here are some common API endpoints you can test with curl or any HTTP client:

### Get Networks
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks
```

### Get Network Details
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks/ethereum
```

### Create Address
```bash
curl -X POST https://cp-merch-dev.wsdemo.online/api/addresses \
  -H "Content-Type: application/json" \
  -d '{"network": "ethereum", "type": "user"}'
```

### Get Hot Wallet Balance
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/addresses/hot-wallet/ethereum
```

### Get Transactions
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/transactions?limit=5
```

### Get Block Numbers
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks/last-number-blocks
```

::: tip Interactive Testing
For interactive API testing, visit the OpenAPI documentation:
**https://cp-merch-dev.wsdemo.online/api/openapi/**

This provides a full Swagger UI where you can:
- Enter your API key
- Test all endpoints interactively
- See real-time responses
- Download API specifications
:::

## Features

- **Sample Data**: Pre-populated with test networks, addresses, and transactions
- **No Real Transactions**: All operations are simulated - no real cryptocurrency is processed
- **Full API Coverage**: All endpoints available for testing
- **Reset Daily**: Demo data is reset every 24 hours

## Getting Started

### 1. Explore the API Documentation

Visit the interactive OpenAPI documentation:
```
https://cp-merch-dev.wsdemo.online/api/openapi/
```

### 2. Test Basic Endpoints

List available networks:
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks
```

Get network details:
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks/ethereum
```

### 3. Create Test Addresses

Create a new address:
```bash
curl -X POST https://cp-merch-dev.wsdemo.online/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "type": "user"
  }'
```

### 4. Query Balances

Check address balances:
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/addresses/hot-wallet/ethereum
```

## Available Test Data

### Networks
- Bitcoin (BTC)
- Ethereum (ETH)
- Tron (TRX)
- Polygon (MATIC)
- BSC (BNB)
- Arbitrum (ARB)
- Fantom (FTM)
- Litecoin (LTC)

### Address Types
- `user` - Individual user addresses
- `hot` - Hot wallet addresses
- `cold` - Cold storage addresses
- `tokens_collector` - Token collection addresses

### Sample Transactions
The demo environment includes sample transactions with various statuses:
- Pending transactions
- Confirmed transactions
- Failed transactions

## Limitations

::: warning Demo Limitations
- No real cryptocurrency transactions
- Data resets every 24 hours
- Rate limiting may be more restrictive
- Some advanced features may be disabled
:::

## Moving to Production

When you're ready to move to production:

1. **Get Production API Key**: Register at [your-gateway.com](https://your-gateway.com)
2. **Update Base URL**: Change to `https://api.your-gateway.com/api/v1`
3. **Configure Webhooks**: Set up production webhook endpoints
4. **Test with Small Amounts**: Start with small test transactions

## Support

Need help with the demo environment?

- 📖 [Full API Documentation](../api/overview.md)
- 💻 [Code Examples](../examples/basic-usage.md)
- 🔧 [Integration Guides](../integration/getting-started.md)
- 📧 [Contact Support](mailto:support@your-gateway.com) 