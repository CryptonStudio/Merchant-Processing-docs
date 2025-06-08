# 网络 API

网络 API 提供管理区块链网络、配置和 Tron 特定操作的功能。

## 概述

网络 API 允许您：
- 获取支持的区块链网络信息
- 配置网络参数（仅管理员）
- 监控最后处理的区块号
- 管理 Tron 质押和资源

## 身份验证

所有 API 请求都需要通过 X-Api-Key 头进行身份验证。

## API Endpoints

### GET /v1/networks
**获取网络列表**

返回所有支持的区块链网络及其配置的列表。

**响应：**
- `200 OK` - 网络列表获取成功

### GET /v1/networks/{network}
**获取特定网络**

返回特定区块链网络的信息。

**参数：**
- `network` (string, 必需) - 网络标识符 (例如：bitcoin, ethereum, tron, bsc)

**响应：**
- `200 OK` - 网络信息获取成功
- `400 Bad Request` - 无效的网络标识符

### GET /v1/networks/last-number-block/{network}
**获取最后区块号**

返回指定网络的最后处理区块号。

**参数：**
- `network` (string, 必需) - 网络标识符

**响应：**
- `200 OK` - 最后区块号获取成功

### POST /v1/networks/tron/stake
**质押 TRX**

质押指定数量的 TRX 以获得带宽或能量。仅管理员访问。

**参数：**
- `amount` (string, 必需) - 要质押的 TRX 数量
- `resource` (string, 必需) - 资源类型：BANDWIDTH 或 ENERGY

**响应：**
- `201 Created` - TRX 质押成功

## 示例

### 获取网络列表

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/networks" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
[
  {
    "id": "bitcoin",
    "name": "Bitcoin",
    "symbol": "BTC",
    "isTestnet": false,
    "confirmations": 6,
    "blockTime": 600
  },
  {
    "id": "ethereum",
    "name": "Ethereum",
    "symbol": "ETH",
    "isTestnet": false,
    "confirmations": 12,
    "blockTime": 15
  },
  {
    "id": "tron",
    "name": "Tron",
    "symbol": "TRX",
    "isTestnet": false,
    "confirmations": 19,
    "blockTime": 3
  }
]
```

### 获取特定网络

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/networks/ethereum" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "id": "ethereum",
  "name": "Ethereum",
  "symbol": "ETH",
  "isTestnet": false,
  "confirmations": 12,
  "blockTime": 15,
  "rpcUrl": "https://mainnet.infura.io/v3/...",
  "explorerUrl": "https://etherscan.io"
}
```

### 获取最后区块号

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/networks/last-number-block/ethereum" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "network": "ethereum",
  "lastBlockNumber": 18500000,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### 质押 TRX

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/networks/tron/stake" \
  -H "X-Api-Key: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "1000",
    "resource": "ENERGY"
  }'
```

**响应：**
```json
{
  "transactionId": "abc123...",
  "amount": "1000",
  "resource": "ENERGY",
  "status": "success"
}
```

## 编程示例

### Python 示例

```python
import requests

API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1'
headers = {
    'X-Api-Key': 'YOUR_API_KEY'
}

# 获取所有网络
response = requests.get(f'{API_BASE}/networks', headers=headers)

if response.status_code == 200:
    networks = response.json()
    print(f"找到 {len(networks)} 个网络")
    
    for network in networks:
        print(f"- {network['name']} ({network['symbol']})")
        
        # 获取特定网络详情
        detail_response = requests.get(f'{API_BASE}/networks/{network["id"]}', headers=headers)
        if detail_response.status_code == 200:
            detail = detail_response.json()
            print(f"  确认数: {detail['confirmations']}")
else:
    print(f"错误: {response.status_code}")
```

### JavaScript 示例

```javascript
const API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1';
const headers = {
    'X-Api-Key': 'YOUR_API_KEY'
};

// 获取所有网络
const getNetworks = async () => {
    try {
        const response = await fetch(`${API_BASE}/networks`, { headers });
        
        if (response.ok) {
            const networks = await response.json();
            console.log('支持的网络:', networks);
            
            // 获取以太坊网络详情
            const ethResponse = await fetch(`${API_BASE}/networks/ethereum`, { headers });
            if (ethResponse.ok) {
                const ethNetwork = await ethResponse.json();
                console.log('以太坊网络:', ethNetwork);
            }
        } else {
            console.error('错误:', response.status);
        }
    } catch (error) {
        console.error('网络错误:', error);
    }
};

getNetworks();
```

### Go 示例

```go
package main

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

const (
    APIBase = "https://cp-merch-dev.wsdemo.online/api/v1"
    APIKey  = "YOUR_API_KEY"
)

type Network struct {
    ID            string `json:"id"`
    Name          string `json:"name"`
    Symbol        string `json:"symbol"`
    IsTestnet     bool   `json:"isTestnet"`
    Confirmations int    `json:"confirmations"`
    BlockTime     int    `json:"blockTime"`
}

func main() {
    // 获取所有网络
    req, _ := http.NewRequest("GET", APIBase+"/networks", nil)
    req.Header.Set("X-Api-Key", APIKey)
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("错误: %v\n", err)
        return
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    
    if resp.StatusCode == 200 {
        var networks []Network
        json.Unmarshal(body, &networks)
        
        fmt.Printf("找到 %d 个网络:\n", len(networks))
        for _, network := range networks {
            fmt.Printf("- %s (%s)\n", network.Name, network.Symbol)
        }
    } else {
        fmt.Printf("错误: %d\n", resp.StatusCode)
    }
}
```

## 数据结构

### 网络对象

```typescript
interface Network {
  id: string;           // 网络标识符
  name: string;         // 网络名称
  symbol: string;       // 网络符号
  isTestnet: boolean;   // 是否为测试网
  confirmations: number; // 所需确认数
  blockTime: number;    // 区块时间（秒）
  rpcUrl?: string;      // RPC URL
  explorerUrl?: string; // 区块浏览器 URL
}
```

### 区块信息

```typescript
interface BlockInfo {
  network: string;      // 网络标识符
  lastBlockNumber: number; // 最后区块号
  timestamp: string;    // 时间戳
}
```

### 质押响应

```typescript
interface StakeResponse {
  transactionId: string; // 交易 ID
  amount: string;       // 质押数量
  resource: string;     // 资源类型
  status: string;       // 状态
}
``` 