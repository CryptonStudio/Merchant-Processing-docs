# 地址 API

地址 API 提供管理加密货币地址、服务钱包和各种区块链网络灰名单的完整功能。

## 概述

地址 API 允许您：
- 为特定网络和币种创建新地址
- 检索地址信息和余额
- 管理服务钱包（热钱包、冷钱包、代币收集器）
- 处理安全灰名单地址
- 获取不同钱包类型的余额

## 身份验证

不同的端点需要不同级别的身份验证：
- **CLIENT_API_KEY**: 用于创建地址和检查余额等基本操作
- **ADMIN_API_KEY**: 用于管理服务钱包等管理操作
- **X-Api-Key**: 所有操作的身份验证方法

## API Endpoints

### POST /v1/addresses
**创建地址**

为特定网络和币种创建新地址（可选）. 如果未提供币种，则将为提供的网络的所有币种生成地址.

**Parameters:**
- `network` (string, required) - 网络标识符（例如：bitcoin、ethereum、tron）
- `coin` (string, optional) - 币种标识符（可选，如果未提供 - 为所有网络币种生成）
- `mode` (string, optional) - 地址模式：单一、通用、跨链
- `type` (string, optional) - 地址类型：用户、热钱包、冷钱包、收集器

**Responses:**
- `201 Created` - 地址创建成功
- `400 Bad Request` - 无效的请求参数

### GET /v1/addresses/{address}
**获取地址**

返回指定地址及其余额信息.

**Parameters:**
- `address` (string, required) - 要检索的加密货币地址

**Responses:**
- `200 OK` - 地址信息获取成功
- `400 Bad Request` - 无效的地址格式
- `404 Not Found` - 地址未找到

### GET /v1/addresses/hot-wallet/{network}
**获取热钱包余额**

返回指定网络的提取（热）钱包余额.

**Parameters:**
- `network` (string, required) - 网络标识符（例如：bitcoin、ethereum、tron）

**Responses:**
- `200 OK` - 热钱包余额获取成功
- `400 Bad Request` - 无效的网络

### GET /v1/addresses/service-wallet/{network}
**获取服务钱包余额**

返回指定网络的服务（代币收集器）钱包余额.

**Parameters:**
- `network` (string, required) - 网络标识符（例如：bitcoin、ethereum、tron）

**Responses:**
- `200 OK` - 服务钱包余额获取成功
- `400 Bad Request` - 无效的网络

### GET /v1/addresses/cold-wallet/{network}
**获取冷钱包余额**

返回指定网络的冷钱包余额.

**Parameters:**
- `network` (string, required) - 网络标识符（例如：bitcoin、ethereum、tron）
- `coin` (string, optional) - 可选的币种参数，用于按特定币种过滤

**Responses:**
- `200 OK` - 冷钱包余额获取成功
- `400 Bad Request` - 无效的网络 or coin

### POST /v1/addresses/service-wallets
**注册服务钱包**

为特定网络注册服务钱包. 对于冷钱包，只需提供地址. 对于其他钱包，可以提供地址和私钥, 否则将创建钱包并返回地址和私钥.

**Parameters:**
- `network` (string, required) - 网络标识符
- `type` (string, required) - 钱包类型：热钱包、冷钱包、代币收集器
- `address` (string, optional) - 钱包地址（冷钱包必需）
- `privateKey` (string, optional) - 私钥（可选，如果未提供将生成）

**Responses:**
- `201 Created` - 服务钱包注册成功
- `400 Bad Request` - 无效的参数

### GET /v1/addresses/grey-list
**获取灰名单**

返回用于安全监控的灰名单地址列表.

**Responses:**
- `200 OK` - 灰名单获取成功

### POST /v1/addresses/grey-list
**注册灰地址**

为特定网络注册灰地址以进行安全监控.

**Parameters:**
- `network` (string, required) - 网络标识符
- `address` (string, required) - 要添加到灰名单的地址
- `reason` (string, optional) - 灰名单原因

**Responses:**
- `201 Created` - 灰地址注册成功
- `400 Bad Request` - 无效的参数

### DELETE /v1/addresses/grey-list
**删除灰地址**

删除特定网络的灰地址.

**Parameters:**
- `network` (string, required) - 网络标识符
- `address` (string, required) - 要从灰名单中移除的地址

**Responses:**
- `200 OK` - 灰地址删除成功
- `400 Bad Request` - 无效的参数
- `404 Not Found` - 地址未找到 in grey list

## Examples

### 创建地址

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/addresses" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "coin": "eth"
  }'
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "network": "ethereum",
  "coin": "eth",
  "type": "user"
}
```

### 获取地址信息

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/addresses/0x742d35Cc6634C0532925a3b8D4C9db96590c6C87" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "network": "ethereum",
  "balances": [
    {
      "coin": "eth",
      "balance": "1.5",
      "symbol": "ETH"
    },
    {
      "coin": "usdt",
      "balance": "1000.0",
      "symbol": "USDT"
    }
  ]
}
```

### 获取热钱包余额

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/addresses/hot-wallet/ethereum" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Response:**
```json
{
  "network": "ethereum",
  "balances": [
    {
      "coin": "eth",
      "balance": "10.5",
      "symbol": "ETH"
    },
    {
      "coin": "usdt",
      "balance": "50000.0",
      "symbol": "USDT"
    }
  ]
}
```

### 注册服务钱包

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/addresses/service-wallets" \
  -H "X-Api-Key: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "type": "hot-wallet"
  }'
```

**Response:**
```json
{
  "address": "0x123...",
  "privateKey": "0xabc...",
  "network": "ethereum",
  "type": "hot-wallet"
}
```

### 获取灰名单

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/addresses/grey-list" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Response:**
```json
[
  {
    "address": "0x123...",
    "network": "ethereum",
    "reason": "Suspicious activity",
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

### 添加灰地址

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/addresses/grey-list" \
  -H "X-Api-Key: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "address": "0x456...",
    "reason": "Fraud investigation"
  }'
```

## Programming Examples

### Python Example

```python
import requests

API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1'
headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Create new address
payload = {
    'network': 'ethereum',
    'coin': 'eth'
}

response = requests.post(f'{API_BASE}/addresses', headers=headers, json=payload)

if response.status_code == 201:
    address_info = response.json()
    print(f"Created address: {address_info['address']}")
    
    # Get address details
    address_response = requests.get(f'{API_BASE}/addresses/{address_info["address"]}', headers=headers)
    
    if address_response.status_code == 200:
        details = address_response.json()
        print(f"Address balances: {details['balances']}")
else:
    print(f"Error: {response.status_code}")
```

### JavaScript Example

```javascript
const API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1';
const headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
};

// Create new address
const createAddress = async () => {
    try {
        const response = await fetch(`${API_BASE}/addresses`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                network: 'ethereum',
                coin: 'eth'
            })
        });
        
        if (response.ok) {
            const addressInfo = await response.json();
            console.log('Created address:', addressInfo.address);
            
            // Get address details
            const detailsResponse = await fetch(`${API_BASE}/addresses/${addressInfo.address}`, {
                headers: headers
            });
            
            if (detailsResponse.ok) {
                const details = await detailsResponse.json();
                console.log('Address balances:', details.balances);
            }
        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};

createAddress();
```

### Go Example

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

const (
    APIBase = "https://cp-merch-dev.wsdemo.online/api/v1"
    APIKey  = "YOUR_API_KEY"
)

type CreateAddressRequest struct {
    Network string `json:"network"`
    Coin    string `json:"coin"`
}

type AddressResponse struct {
    Address string `json:"address"`
    Network string `json:"network"`
    Coin    string `json:"coin"`
    Type    string `json:"type"`
}

func main() {
    // Create new address
    payload := CreateAddressRequest{
        Network: "ethereum",
        Coin:    "eth",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", APIBase+"/addresses", bytes.NewBuffer(jsonData))
    req.Header.Set("X-Api-Key", APIKey)
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    
    if resp.StatusCode == 201 {
        var addressInfo AddressResponse
        json.Unmarshal(body, &addressInfo)
        fmt.Printf("Created address: %s\n", addressInfo.Address)
    } else {
        fmt.Printf("Error: %d\n", resp.StatusCode)
    }
}
```

## Data Structures

### Request Types

```typescript
interface CreateAddressRequest {
  network: string;
  coin?: string;
  mode?: 'single' | 'universal' | 'cross-chain';
  type?: 'user' | 'hot-wallet' | 'cold-wallet' | 'collector';
}

interface ServiceWalletRequest {
  network: string;
  type: 'hot-wallet' | 'cold-wallet' | 'token-collector';
  address?: string;
  privateKey?: string;
}

interface GreyListRequest {
  network: string;
  address: string;
  reason?: string;
}
```

### Response Types

```typescript
interface AddressInfo {
  address: string;
  network: string;
  coin?: string;
  type: string;
  balances?: Balance[];
}

interface Balance {
  coin: string;
  balance: string;
  symbol: string;
}

interface ServiceWallet {
  address: string;
  privateKey?: string;
  network: string;
  type: string;
}

interface GreyListEntry {
  address: string;
  network: string;
  reason?: string;
  createdAt: string;
}
```
