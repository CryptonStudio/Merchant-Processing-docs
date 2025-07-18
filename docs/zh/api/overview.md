# API 概述

加密支付网关提供全面的 RESTful API 用于管理加密货币交易、地址和钱包.

## 基础 URL

**生产环境:**
'''
https://api.your-gateway.com/api/v1
'''

**演示/测试环境:**
'''
https://cp-merch-dev.wsdemo.online/api
'''

::: tip 演示环境
使用演示环境进行测试和开发. 演示 API 包含示例数据，不处理真实交易.

**OpenAPI 文档:** https://cp-merch-dev.wsdemo.online/api/openapi/
:::

## 身份验证

All API requests require authentication using one of the following methods:

- **API Key** - Include 'X-Api-Key' header with your API key
- **API Key** - Include 'X-Api-Key: &lt;token&gt;' header

## API Versioning

Our API uses URI versioning. The current version is `v1`, which is included in all endpoint URLs:

```
/api/v1/addresses
/api/v1/networks
/api/v1/withdrawals
```

## Content Type

All API requests and responses use JSON format:

```http
Content-Type: application/json
```

## 速率限制

API requests are rate-limited to ensure fair usage:

- **Standard endpoints**: 1000 requests per minute
- **Webhook endpoints**: 100 requests per minute
- **Admin endpoints**: 500 requests per minute

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 错误处理

The API uses standard HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - 资源已创建 successfully
- `400 Bad Request` - 无效的请求参数
- `401 未授权` - Authentication required
- `403 访问被拒绝` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The provided network slug is invalid",
    "details": [
      {
        "field": "network",
        "value": "invalid-network",
        "constraints": {
          "isNotExisting": "Network invalid-network does not exist"
        }
      }
    ]
  }
}
```

## Core Resources

### Addresses
Manage cryptocurrency addresses and wallets.

**Key endpoints:**
- `POST /addresses` - Create new address
- `GET /addresses/{address}` - Get address details
- `GET /addresses/hot-wallet/{network}` - Get hot wallet balance
- `GET /addresses/cold-wallet/{network}` - Get cold wallet balance

### Networks
Configure and manage blockchain networks.

**Key endpoints:**
- `GET /networks` - List all networks
- `GET /networks/{network}` - Get network details
- `PUT /networks` - Configure network settings
- `GET /networks/last-number-blocks` - Get latest block numbers

### 提取
Process cryptocurrency withdrawals.

**Key endpoints:**
- `POST /withdrawals` - Initiate withdrawal
- `GET /withdrawals/requests` - List withdrawal requests
- `PUT /withdrawals/request/accept` - Accept withdrawal
- `PUT /withdrawals/request/reject` - Reject withdrawal

### Transactions
Query transaction history and details.

**Key endpoints:**
- `GET /transactions` - List transactions
- `GET /transactions/{txId}` - Get transaction details
- `GET /transactions/address/{address}` - Get address transactions

## Interactive API Explorer

Try our API endpoints directly in your browser using our web interface.

## SDK Libraries

We provide official SDK libraries for popular programming languages:

### Go SDK
```go
import "github.com/your-org/crypto-gateway-go"

client := gateway.NewClient("your-api-key")
address, err := client.CreateAddress("ethereum", "")
```

### TypeScript SDK
```typescript
import { CryptoGateway } from '@your-org/crypto-gateway-ts';

const client = new CryptoGateway('your-api-key');
const address = await client.createAddress('ethereum');
```

### Python SDK
```python
from crypto_gateway import CryptoGateway

client = CryptoGateway('your-api-key')
address = client.create_address('ethereum')
```

## Webhook

Stay updated with real-time notifications:

```json
{
  "event": "transaction.confirmed",
  "data": {
    "txId": "0x123...",
    "address": "0xabc...",
    "amount": "1.5",
    "coin": "ethereum",
    "confirmations": 12
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Next Steps

- [Authentication Guide](./authentication.md) - Learn how to authenticate API requests
- [Addresses API](./addresses.md) - Detailed address management endpoints
- [Networks API](./networks.md) - Network configuration and monitoring
- [提取 API](./withdrawals.md) - Process cryptocurrency withdrawals

&lt;style&gt;
.api-explorer {
  margin: 2rem 0;
}

.endpoint-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.method {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.875rem;
  min-width: 60px;
  text-align: center;
}

.method.get {
  background: #10b981;
  color: white;
}

.method.post {
  background: #3b82f6;
  color: white;
}

.path {
  font-family: monospace;
  font-weight: 500;
  flex: 1;
}

.description {
  color: var(--vp-c-text-2);
  flex: 2;
}

.try-button {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.try-button:hover {
  background: var(--vp-c-brand-dark);
}
&lt;/style&gt;

 