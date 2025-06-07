# Addresses API

The Addresses API allows you to create and manage cryptocurrency addresses, check balances, and handle service wallets.

## Authentication

All address endpoints require authentication using either:
- `X-Api-Key` header with CLIENT_API_KEY
- `Authorization` header with Bearer token

## Create Address

Create a new cryptocurrency address for receiving payments.

### Endpoint
```http
POST /api/v1/addresses
```

### Request Body

```json
{
  "network": "ethereum",
  "coin": "usdt"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network slug (ethereum, bitcoin, tron, etc.) |
| `coin` | string | No | Coin slug (optional, creates address for all network coins if omitted) |

### Response

```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c4C87",
  "network": "ethereum",
  "affectedNetworks": ["ethereum", "polygon", "arbitrum"],
  "balances": [
    {
      "coin": "ethereum",
      "balance": "0",
      "contractAddress": null
    },
    {
      "coin": "usdt",
      "balance": "0",
      "contractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7"
    }
  ]
}
```

### Example Request

::: code-group

```bash [cURL]
curl -X POST https://api.your-gateway.com/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: your-api-key" \
  -d '{
    "network": "ethereum",
    "coin": "usdt"
  }'
```

```go [Go]
package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

type CreateAddressRequest struct {
    Network string `json:"network"`
    Coin    string `json:"coin,omitempty"`
}

func createAddress() {
    reqBody := CreateAddressRequest{
        Network: "ethereum",
        Coin:    "usdt",
    }
    
    jsonData, _ := json.Marshal(reqBody)
    
    req, _ := http.NewRequest("POST", 
        "https://api.your-gateway.com/api/v1/addresses", 
        bytes.NewBuffer(jsonData))
    
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-Api-Key", "your-api-key")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}
```

```typescript [TypeScript]
interface CreateAddressRequest {
  network: string;
  coin?: string;
}

interface CreateAddressResponse {
  address: string;
  network: string;
  affectedNetworks: string[];
  balances: Array<{
    coin: string;
    balance: string;
    contractAddress: string | null;
  }>;
}

async function createAddress(): Promise<CreateAddressResponse> {
  const response = await fetch('https://api.your-gateway.com/api/v1/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': 'your-api-key'
    },
    body: JSON.stringify({
      network: 'ethereum',
      coin: 'usdt'
    })
  });
  
  return response.json();
}
```

```python [Python]
import requests
import json

def create_address():
    url = "https://api.your-gateway.com/api/v1/addresses"
    
    headers = {
        "Content-Type": "application/json",
        "X-Api-Key": "your-api-key"
    }
    
    data = {
        "network": "ethereum",
        "coin": "usdt"
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()
```

:::

## Get Address Details

Retrieve address information including balance and transaction history.

### Endpoint
```http
GET /api/v1/addresses/{address}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | The cryptocurrency address |

### Response

```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c4C87",
  "network": "ethereum",
  "status": "active",
  "balances": [
    {
      "coin": "ethereum",
      "balance": "1.5",
      "contractAddress": null,
      "usdValue": "2400.00"
    },
    {
      "coin": "usdt",
      "balance": "1000.0",
      "contractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "usdValue": "1000.00"
    }
  ],
  "totalUsdValue": "3400.00",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastActivity": "2024-01-20T15:45:00Z"
}
```

### Example Request

::: code-group

```bash [cURL]
curl -X GET https://api.your-gateway.com/api/v1/addresses/0x742d35Cc6634C0532925a3b8D4C9db96590c4C87 \
  -H "X-Api-Key: your-api-key"
```

```go [Go]
func getAddress(address string) {
    req, _ := http.NewRequest("GET", 
        "https://api.your-gateway.com/api/v1/addresses/"+address, nil)
    
    req.Header.Set("X-Api-Key", "your-api-key")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}
```

```typescript [TypeScript]
async function getAddress(address: string) {
  const response = await fetch(`https://api.your-gateway.com/api/v1/addresses/${address}`, {
    headers: {
      'X-Api-Key': 'your-api-key'
    }
  });
  
  return response.json();
}
```

```python [Python]
def get_address(address):
    url = f"https://api.your-gateway.com/api/v1/addresses/{address}"
    
    headers = {
        "X-Api-Key": "your-api-key"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()
```

:::

## Get Hot Wallet Balance

Retrieve the balance of the hot wallet for a specific network.

### Endpoint
```http
GET /api/v1/addresses/hot-wallet/{network}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network slug |

### Response

```json
{
  "network": "ethereum",
  "walletType": "hot",
  "address": "0x123...abc",
  "balances": [
    {
      "coin": "ethereum",
      "balance": "10.5",
      "contractAddress": null,
      "usdValue": "16800.00"
    },
    {
      "coin": "usdt",
      "balance": "50000.0",
      "contractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "usdValue": "50000.00"
    }
  ],
  "totalUsdValue": "66800.00"
}
```

## Get Cold Wallet Balance

Retrieve the balance of the cold wallet for a specific network.

### Endpoint
```http
GET /api/v1/addresses/cold-wallet/{network}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network slug |
| `coin` | string | No | Specific coin slug (query parameter) |

### Response

```json
{
  "network": "ethereum",
  "walletType": "cold",
  "address": "0x456...def",
  "balances": [
    {
      "coin": "ethereum",
      "balance": "100.0",
      "contractAddress": null,
      "usdValue": "160000.00"
    }
  ],
  "totalUsdValue": "160000.00"
}
```

## Register Service Wallet

Register a service wallet (hot, cold, or token collector) for a network.

### Endpoint
```http
POST /api/v1/addresses/service-wallets
```

### Authentication
Requires ADMIN_API_KEY or Bearer token authorization.

### Request Body

```json
{
  "network": "ethereum",
  "type": "hot",
  "address": "0x789...ghi",
  "privateKey": "0x123...private"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network slug |
| `type` | string | Yes | Wallet type: `hot`, `cold`, `tokens_collector` |
| `address` | string | No | Wallet address (generated if not provided) |
| `privateKey` | string | No | Private key (generated if not provided, not needed for cold wallets) |

### Response

```json
{
  "network": "ethereum",
  "type": "hot",
  "address": "0x789...ghi",
  "privateKey": "0x123...private",
  "created": true
}
```

## Error Responses

### Invalid Network

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

### Address Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Address not found",
    "details": []
  }
}
```

### Insufficient Permissions

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions for this operation",
    "details": []
  }
}
```

## Best Practices

### Address Generation
- Always specify the network when creating addresses
- Use the `coin` parameter only when you need address isolation per coin
- Monitor address balances regularly using webhooks

### Security
- Never expose private keys in client-side code
- Use separate API keys for different environments
- Implement proper error handling for all API calls

### Performance
- Cache address information when possible
- Use batch operations for multiple address queries
- Implement exponential backoff for failed requests

## Next Steps

- [Networks API](./networks.md) - Configure blockchain networks
- [Withdrawals API](./withdrawals.md) - Process withdrawals
- [Webhooks](./webhooks.md) - Real-time notifications 