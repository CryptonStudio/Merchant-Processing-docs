# 商户 API - 发票管理

商户模块提供发票管理的完整 API - 创建、检索、状态更改和配置。

## 概述

发票 API 允许您：
- 创建新的发票以接受付款
- 检索发票信息
- 更改发票状态
- 获取汇总统计信息
- 配置发票参数

## 身份验证

所有 API 请求都需要通过 X-Api-Key 头进行身份验证。

## API Endpoints

### POST /v1/invoices
**创建发票**

使用指定参数创建带有付款地址的新发票。

**参数：**
- `currency` (string, 必需) - 唯一币种标识符 (例如：eth, btc)
- `amount` (number, 必需) - 发票中的币数量
- `externalId` (string, 可选) - 发票的外部 ID

**响应：**
- `201 Created` - 发票创建成功
- `400 Bad Request` - 无效的请求参数

### PUT /v1/invoices
**更改发票状态**

更改指定发票的状态。

**参数：**
- `invoiceId` (string, 必需) - 发票 ID
- `status` (string, 必需) - 新发票状态

**响应：**
- `201 Created` - 状态更改成功
- `400 Bad Request` - 无效的请求参数

### GET /v1/invoices/getAll
**获取发票列表**

返回所有发票的列表，支持过滤和分页选项。

**参数：**
- `page` (number, 可选) - 页码 (默认 1)
- `perPage` (number, 可选) - 每页项目数 (默认 20)
- `status` (array, 可选) - 按状态过滤
- `address` (string, 可选) - 按地址过滤
- `currency` (string, 可选) - 按币种过滤
- `from` (string, 可选) - 开始日期过滤 (YYYY-MM-DD)
- `to` (string, 可选) - 结束日期过滤 (YYYY-MM-DD)

**响应：**
- `200 OK` - 发票列表检索成功

### GET /v1/invoices
**获取发票**

通过 ID 返回特定发票的信息。

**参数：**
- `id` (string, 必需) - 发票 ID

**响应：**
- `200 OK` - 发票信息检索成功
- `400 Bad Request` - 无效的发票 ID

### GET /v1/invoices/getByExternalId
**通过外部 ID 获取发票**

通过外部 ID 返回特定发票的信息。

**参数：**
- `externalId` (string, 必需) - 外部发票 ID

**响应：**
- `200 OK` - 发票信息检索成功
- `400 Bad Request` - 无效的外部 ID

### GET /v1/invoices/summary
**获取汇总**

返回所有已发出发票总和以及所有已收到资金总和的信息。

**响应：**
- `200 OK` - 汇总信息检索成功

### GET /v1/invoices/configureSettings
**获取发票设置**

检索当前发票配置设置。

**响应：**
- `200 OK` - 设置检索成功

### PUT /v1/invoices/configureSettings
**配置发票参数**

为各种网络和币种配置发票参数。

**参数：**
- `settings` (object, 必需) - 包含发票设置的对象

**响应：**
- `201 Created` - 设置更新成功
- `400 Bad Request` - 无效的参数

## 示例

### 创建发票

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/invoices" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "eth",
    "amount": 0.001,
    "externalId": "demo_123"
  }'
```

**响应：**
```json
{
  "id": "inv_abc123def456",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "amount": "0.001",
  "currency": "eth",
  "externalId": "demo_123"
}
```

### 获取发票列表

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/getAll?page=1&perPage=20" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "count": 150,
  "data": [
    {
      "id": "inv_abc123def456",
      "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      "amount": "0.001",
      "received": "0.001",
      "currency": "eth",
      "symbol": "ETH",
      "network": "ethereum",
      "status": "completed",
      "createdAt": "2025-01-15T10:30:00Z",
      "externalId": "demo_123",
      "transactions": [
        {
          "hash": "0xabc123...",
          "amount": "0.001",
          "confirmations": 15
        }
      ]
    }
  ]
}
```

### 获取特定发票

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices?id=inv_abc123def456" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "id": "inv_abc123def456",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "amount": "0.001",
  "received": "0.001",
  "currency": "eth",
  "symbol": "ETH",
  "network": "ethereum",
  "status": "completed",
  "createdAt": "2025-01-15T10:30:00Z",
  "externalId": "demo_123"
}
```

### 通过外部 ID 获取发票

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/getByExternalId?externalId=demo_123" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "id": "inv_abc123def456",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "amount": "0.001",
  "received": "0.001",
  "currency": "eth",
  "status": "completed",
  "externalId": "demo_123"
}
```

### 获取汇总统计

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/summary" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "totalInvoices": 1250,
  "totalAmount": "125.5",
  "totalReceived": "120.3",
  "completedInvoices": 1100,
  "pendingInvoices": 150,
  "currencies": [
    {
      "currency": "eth",
      "totalAmount": "50.5",
      "totalReceived": "48.2"
    },
    {
      "currency": "btc",
      "totalAmount": "75.0",
      "totalReceived": "72.1"
    }
  ]
}
```

### 更改发票状态

```bash
curl -X PUT "https://cp-merch-dev.wsdemo.online/api/v1/invoices" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "inv_abc123def456",
    "status": "completed"
  }'
```

**响应：**
```json
{
  "message": "发票状态更新成功",
  "invoiceId": "inv_abc123def456",
  "newStatus": "completed"
}
```

### 获取发票设置

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/configureSettings" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "settings": {
    "defaultExpirationTime": 3600,
    "autoConfirmThreshold": 6,
    "supportedCurrencies": ["eth", "btc", "usdt"],
    "minimumAmounts": {
      "eth": "0.001",
      "btc": "0.0001",
      "usdt": "1.0"
    }
  }
}
```

## 编程示例

### Python 示例

```python
import requests

API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1'
headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# 创建发票
payload = {
    'currency': 'eth',
    'amount': 0.001,
    'externalId': 'demo_123'
}

response = requests.post(f'{API_BASE}/invoices', headers=headers, json=payload)

if response.status_code == 201:
    invoice = response.json()
    print(f"创建发票: {invoice['id']}")
    print(f"付款地址: {invoice['address']}")
    
    # 获取发票状态
    invoice_response = requests.get(f'{API_BASE}/invoices?id={invoice["id"]}', headers=headers)
    if invoice_response.status_code == 200:
        invoice_data = invoice_response.json()
        print(f"发票状态: {invoice_data['status']}")
else:
    print(f"错误: {response.status_code}")
```

### JavaScript 示例

```javascript
const API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1';
const headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
};

// 创建发票
const createInvoice = async () => {
    const payload = {
        currency: 'eth',
        amount: 0.001,
        externalId: 'demo_123'
    };
    
    try {
        const response = await fetch(`${API_BASE}/invoices`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            const invoice = await response.json();
            console.log('创建发票:', invoice.id);
            console.log('付款地址:', invoice.address);
            
            // 获取发票列表
            const listResponse = await fetch(`${API_BASE}/invoices/getAll?page=1&perPage=10`, {
                headers: headers
            });
            
            if (listResponse.ok) {
                const invoiceList = await listResponse.json();
                console.log(`找到 ${invoiceList.count} 张发票`);
            }
        }
    } catch (error) {
        console.error('错误:', error);
    }
};

createInvoice();
```

### Go 示例

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type InvoiceRequest struct {
    Currency   string  `json:"currency"`
    Amount     float64 `json:"amount"`
    ExternalID string  `json:"externalId"`
}

func main() {
    apiBase := "https://cp-merch-dev.wsdemo.online/api/v1"
    apiKey := "YOUR_API_KEY"
    
    // 创建发票
    payload := InvoiceRequest{
        Currency:   "eth",
        Amount:     0.001,
        ExternalID: "demo_123",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", apiBase+"/invoices", bytes.NewBuffer(jsonData))
    req.Header.Set("X-Api-Key", apiKey)
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("错误: %v\n", err)
        return
    }
    defer resp.Body.Close()
    
    if resp.StatusCode == 201 {
        var invoice map[string]interface{}
        json.NewDecoder(resp.Body).Decode(&invoice)
        fmt.Printf("创建发票: %s\n", invoice["id"])
        fmt.Printf("付款地址: %s\n", invoice["address"])
    } else {
        fmt.Printf("错误状态码: %d\n", resp.StatusCode)
    }
}
```

## 错误处理

API 使用标准 HTTP 状态码：

- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `400 Bad Request` - 请求参数无效
- `401 Unauthorized` - API 密钥无效
- `404 Not Found` - 资源未找到
- `500 Internal Server Error` - 服务器内部错误

错误响应格式：
```json
{
  "error": "错误描述",
  "code": "ERROR_CODE",
  "details": "详细错误信息"
}