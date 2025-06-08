# 币种 API

币种 API 提供跨不同区块链网络管理加密货币币种和代币的功能。

## 概述

币种 API 允许您：
- 创建新的币种和代币
- 从合约地址预创建代币
- 编辑币种设置和状态
- 检索币种信息和配置

## 认证

所有 API 请求都需要在请求头中包含 API 密钥：

```
X-Api-Key: YOUR_API_KEY
```

## 端点

### 创建币种

创建新的币种或代币。仅限管理员访问。

**请求**
```
POST /v1/coins
```

**参数**
| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| coin | string | 否 | 唯一币种标识符（如未提供则自动生成） |
| name | string | 否 | 币种或代币名称（如未提供则从合约自动检测） |
| contractAddress | string | 否 | 代币合约地址（仅适用于代币） |
| network | string | 是 | 网络标识（例如：ethereum、bitcoin、tron） |
| useUsdLimits | boolean | 否 | 对结算和交易使用美元限额 |
| collectThreshold | number | 否 | 转移到服务钱包的最小金额 |
| collectServiceToColdThreshold | number | 否 | 从服务钱包转移到冷钱包的最小金额 |
| collectPercentageHot | number | 否 | 在热钱包中收集的币种百分比 |
| approveThreshold | number | 否 | 转移到服务钱包的置信度量 |
| minValue | number | 否 | 单次提取的最小可能金额 |
| maxValue | number | 否 | 单次提取的最大可能金额 |
| maxValueDaily | number | 否 | 24小时内最大可能提取金额 |
| minDepositAmount | number | 否 | 存款的最小金额 |

**示例请求**
```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/coins" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "name": "我的代币",
    "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "collectThreshold": 0.001,
    "minValue": 0.0001,
    "maxValue": 1000
  }'
```

**响应**
- `201 Created` - 币种创建成功
- `400 Bad Request` - 无效参数

```json
{
  "message": "币种创建成功"
}
```

### 预创建代币

通过分析合约地址预创建代币。仅限管理员访问。

**请求**
```
PUT /v1/coins/precreate-token
```

**参数**
| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| contractAddress | string | 是 | 代币合约地址 |
| network | string | 是 | 网络标识（例如：ethereum、bsc、polygon） |

**示例请求**
```bash
curl -X PUT "https://cp-merch-dev.wsdemo.online/api/v1/coins/precreate-token" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "network": "ethereum"
  }'
```

**响应**
- `201 Created` - 代币预创建成功
- `400 Bad Request` - 无效的合约地址或网络

```json
{
  "coin": "usdt_erc20",
  "symbol": "USDT",
  "name": "Tether USD",
  "decimals": 6
}
```

### 编辑币种

编辑币种或代币设置和状态。可用于激活/停用币种。仅限管理员访问。

**请求**
```
PUT /v1/coins
```

**参数**
| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| coin | string | 是 | 唯一币种标识符 |
| name | string | 否 | 币种或代币名称 |
| status | string | 否 | 币种状态（ACTIVE、INACTIVE） |
| useUsdLimits | boolean | 否 | 对结算和交易使用美元限额 |
| collectThreshold | number | 否 | 转移到服务钱包的最小金额 |
| collectServiceToColdThreshold | number | 否 | 从服务钱包转移到冷钱包的最小金额 |
| collectPercentageHot | number | 否 | 在热钱包中收集的币种百分比 |
| approveThreshold | number | 否 | 转移到服务钱包的置信度量 |
| minValue | number | 否 | 单次提取的最小可能金额 |
| maxValue | number | 否 | 单次提取的最大可能金额 |
| maxValueDaily | number | 否 | 24小时内最大可能提取金额 |
| minDepositAmount | number | 否 | 存款的最小金额 |

**示例请求**
```bash
curl -X PUT "https://cp-merch-dev.wsdemo.online/api/v1/coins" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "coin": "btc",
    "status": "ACTIVE",
    "minValue": 0.0001,
    "maxValue": 10,
    "collectThreshold": 0.001
  }'
```

**响应**
- `200 OK` - 币种更新成功
- `400 Bad Request` - 无效参数

```json
{
  "message": "币种更新成功"
}
```

### 获取币种列表

返回所有可用币种和代币的列表。

**请求**
```
GET /v1/coins
```

**示例请求**
```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/coins" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应**
- `200 OK` - 币种列表检索成功

```json
[
  {
    "coin": "btc",
    "name": "Bitcoin",
    "type": "NATIVE",
    "decimals": 8,
    "contractAddress": null,
    "status": "ACTIVE",
    "settings": {
      "useUsdLimits": true,
      "collectThreshold": 0.001,
      "collectServiceToColdThreshold": 1,
      "collectPercentageHot": 10,
      "approveThreshold": 1000000,
      "minValue": 0.0001,
      "maxValue": 10,
      "maxValueDaily": 100,
      "minDepositAmount": 0.0001
    },
    "network": {
      "network": "bitcoin"
    }
  },
  {
    "coin": "eth",
    "name": "Ethereum",
    "type": "NATIVE",
    "decimals": 18,
    "contractAddress": null,
    "status": "ACTIVE",
    "settings": {
      "useUsdLimits": false,
      "collectThreshold": 0.01,
      "collectServiceToColdThreshold": 10,
      "collectPercentageHot": 15,
      "approveThreshold": 1000000,
      "minValue": 0.001,
      "maxValue": 100,
      "maxValueDaily": 1000,
      "minDepositAmount": 0.001
    },
    "network": {
      "network": "ethereum"
    }
  }
]
```

### 获取币种信息

返回特定币种或代币的信息。

**请求**
```
GET /v1/coins/{coin}
```

**参数**
| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| coin | string | 是 | 币种标识（例如：btc、eth、usdt） |

**示例请求**
```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/coins/btc" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应**
- `200 OK` - 币种信息检索成功
- `400 Bad Request` - 无效的币种标识

```json
{
  "coin": "btc",
  "name": "Bitcoin",
  "type": "NATIVE",
  "decimals": 8,
  "contractAddress": null,
  "status": "ACTIVE",
  "settings": {
    "useUsdLimits": true,
    "collectThreshold": 0.001,
    "collectServiceToColdThreshold": 1,
    "collectPercentageHot": 10,
    "approveThreshold": 1000000,
    "minValue": 0.0001,
    "maxValue": 10,
    "maxValueDaily": 100,
    "minDepositAmount": 0.0001,
    "collectThresholdUSD": 50,
    "collectServiceToColdThresholdUSD": 50000,
    "approveThresholdUSD": 1000000,
    "minValueUSD": 5,
    "maxValueUSD": 500000,
    "maxValueDailyUSD": 5000000,
    "minDepositAmountUSD": 5
  },
  "network": {
    "network": "bitcoin"
  }
}
```

## 错误处理

API 使用标准 HTTP 状态码来指示请求的成功或失败：

- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `400 Bad Request` - 请求参数无效
- `401 Unauthorized` - API 密钥无效或缺失
- `403 Forbidden` - 权限不足
- `404 Not Found` - 资源未找到
- `500 Internal Server Error` - 服务器内部错误

错误响应格式：
```json
{
  "error": "错误描述",
  "code": "ERROR_CODE"
}
```

## 代码示例

### Python
```python
import requests

headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# 创建币种
response = requests.post(
    'https://cp-merch-dev.wsdemo.online/api/v1/coins',
    headers=headers,
    json={
        'network': 'ethereum',
        'name': '我的代币',
        'collectThreshold': 0.001
    }
)

print(response.json())
```

### JavaScript
```javascript
const headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
};

// 获取币种列表
fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
    headers: headers
})
.then(response => response.json())
.then(data => console.log(data));
```

### Go
```go
package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    payload := map[string]interface{}{
        "network": "ethereum",
        "name": "我的代币",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", 
        "https://cp-merch-dev.wsdemo.online/api/v1/coins", 
        bytes.NewBuffer(jsonData))
    req.Header.Set("X-Api-Key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}