# 提现 API

提现 API 提供管理加密货币提现、批量处理和状态跟踪的功能。

## 概述

提现 API 允许您：
- 创建单笔提现请求
- 批量处理多笔提现
- 查询提现状态和历史
- 获取提现统计信息
- 管理提现配置

## 身份验证

所有 API 请求都需要通过 X-Api-Key 头进行身份验证。

## API Endpoints

### POST /v1/withdraws
**创建提现**

创建新的提现请求。

**参数：**
- `currency` (string, 必需) - 币种标识符 (例如：btc, eth, usdt)
- `amount` (string, 必需) - 提现金额
- `address` (string, 必需) - 目标地址
- `externalId` (string, 可选) - 外部 ID
- `memo` (string, 可选) - 备注信息（某些网络需要）

**响应：**
- `201 Created` - 提现创建成功
- `400 Bad Request` - 无效的请求参数

### POST /v1/withdraws/batch
**批量提现**

批量创建多笔提现请求。

**参数：**
- `withdraws` (array, 必需) - 提现请求数组

**响应：**
- `201 Created` - 批量提现创建成功
- `400 Bad Request` - 无效的请求参数

### GET /v1/withdraws
**获取提现列表**

返回提现列表，支持分页和过滤。

**参数：**
- `page` (number, 可选) - 页码 (默认 1)
- `perPage` (number, 可选) - 每页数量 (默认 20)
- `status` (string, 可选) - 按状态过滤
- `currency` (string, 可选) - 按币种过滤
- `from` (string, 可选) - 开始日期 (YYYY-MM-DD)
- `to` (string, 可选) - 结束日期 (YYYY-MM-DD)

**响应：**
- `200 OK` - 提现列表获取成功

### GET /v1/withdraws/{id}
**获取提现详情**

返回特定提现的详细信息。

**参数：**
- `id` (string, 必需) - 提现 ID

**响应：**
- `200 OK` - 提现详情获取成功
- `404 Not Found` - 提现未找到

### GET /v1/withdraws/by-external-id/{externalId}
**通过外部 ID 获取提现**

通过外部 ID 查询提现信息。

**参数：**
- `externalId` (string, 必需) - 外部 ID

**响应：**
- `200 OK` - 提现信息获取成功
- `404 Not Found` - 提现未找到

### PUT /v1/withdraws/{id}/status
**更新提现状态**

更新提现状态。仅管理员访问。

**参数：**
- `id` (string, 必需) - 提现 ID
- `status` (string, 必需) - 新状态
- `reason` (string, 可选) - 状态变更原因

**响应：**
- `200 OK` - 状态更新成功
- `400 Bad Request` - 无效的状态

### GET /v1/withdraws/summary
**获取提现统计**

返回提现统计信息。

**响应：**
- `200 OK` - 统计信息获取成功

## 示例

### 创建提现

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/withdraws" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "eth",
    "amount": "0.1",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "externalId": "withdraw_123"
  }'
```

**响应：**
```json
{
  "id": "wd_abc123def456",
  "currency": "eth",
  "amount": "0.1",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "status": "pending",
  "externalId": "withdraw_123",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### 批量提现

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/withdraws/batch" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "withdraws": [
      {
        "currency": "eth",
        "amount": "0.1",
        "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        "externalId": "batch_1"
      },
      {
        "currency": "btc",
        "amount": "0.001",
        "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        "externalId": "batch_2"
      }
    ]
  }'
```

**响应：**
```json
{
  "batchId": "batch_abc123",
  "withdraws": [
    {
      "id": "wd_123",
      "currency": "eth",
      "amount": "0.1",
      "status": "pending",
      "externalId": "batch_1"
    },
    {
      "id": "wd_456",
      "currency": "btc",
      "amount": "0.001",
      "status": "pending",
      "externalId": "batch_2"
    }
  ]
}
```

### 获取提现列表

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/withdraws?page=1&perPage=20&status=pending" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "count": 150,
  "data": [
    {
      "id": "wd_abc123def456",
      "currency": "eth",
      "amount": "0.1",
      "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      "status": "pending",
      "externalId": "withdraw_123",
      "createdAt": "2025-01-15T10:30:00Z",
      "fee": "0.002",
      "networkFee": "0.001"
    }
  ]
}
```

### 获取提现详情

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/withdraws/wd_abc123def456" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "id": "wd_abc123def456",
  "currency": "eth",
  "amount": "0.1",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "status": "completed",
  "externalId": "withdraw_123",
  "createdAt": "2025-01-15T10:30:00Z",
  "completedAt": "2025-01-15T10:35:00Z",
  "transactionHash": "0xabc123...",
  "fee": "0.002",
  "networkFee": "0.001",
  "confirmations": 12
}
```

### 获取提现统计

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/withdraws/summary" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**响应：**
```json
{
  "totalWithdraws": 1250,
  "totalAmount": {
    "btc": "15.5",
    "eth": "125.8",
    "usdt": "50000.0"
  },
  "statusCounts": {
    "pending": 25,
    "processing": 10,
    "completed": 1200,
    "failed": 15
  },
  "last24Hours": {
    "count": 45,
    "totalAmount": {
      "btc": "2.1",
      "eth": "8.5",
      "usdt": "3500.0"
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

# 创建提现
withdraw_data = {
    'currency': 'eth',
    'amount': '0.1',
    'address': '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    'externalId': 'python_withdraw_123'
}

response = requests.post(f'{API_BASE}/withdraws', headers=headers, json=withdraw_data)

if response.status_code == 201:
    withdraw = response.json()
    print(f"创建提现: {withdraw['id']}")
    
    # 查询提现状态
    status_response = requests.get(f'{API_BASE}/withdraws/{withdraw["id"]}', headers=headers)
    
    if status_response.status_code == 200:
        status = status_response.json()
        print(f"提现状态: {status['status']}")
        
    # 获取提现列表
    list_response = requests.get(f'{API_BASE}/withdraws?page=1&perPage=10', headers=headers)
    
    if list_response.status_code == 200:
        withdraws = list_response.json()
        print(f"找到 {withdraws['count']} 笔提现")
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

// 创建提现
const createWithdraw = async () => {
    try {
        const withdrawData = {
            currency: 'eth',
            amount: '0.1',
            address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
            externalId: 'js_withdraw_123'
        };
        
        const response = await fetch(`${API_BASE}/withdraws`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(withdrawData)
        });
        
        if (response.ok) {
            const withdraw = await response.json();
            console.log('创建提现:', withdraw.id);
            
            // 查询状态
            const statusResponse = await fetch(`${API_BASE}/withdraws/${withdraw.id}`, {
                headers: headers
            });
            
            if (statusResponse.ok) {
                const status = await statusResponse.json();
                console.log('提现状态:', status.status);
            }
        } else {
            console.error('错误:', response.status);
        }
    } catch (error) {
        console.error('网络错误:', error);
    }
};

// 批量提现
const batchWithdraw = async () => {
    try {
        const batchData = {
            withdraws: [
                {
                    currency: 'eth',
                    amount: '0.05',
                    address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
                    externalId: 'batch_1'
                },
                {
                    currency: 'btc',
                    amount: '0.001',
                    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                    externalId: 'batch_2'
                }
            ]
        };
        
        const response = await fetch(`${API_BASE}/withdraws/batch`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(batchData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('批量提现:', result.batchId);
            console.log('提现数量:', result.withdraws.length);
        }
    } catch (error) {
        console.error('批量提现错误:', error);
    }
};

createWithdraw();
```

### Go 示例

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

type WithdrawRequest struct {
    Currency   string `json:"currency"`
    Amount     string `json:"amount"`
    Address    string `json:"address"`
    ExternalID string `json:"externalId,omitempty"`
}

type WithdrawResponse struct {
    ID         string `json:"id"`
    Currency   string `json:"currency"`
    Amount     string `json:"amount"`
    Address    string `json:"address"`
    Status     string `json:"status"`
    ExternalID string `json:"externalId"`
    CreatedAt  string `json:"createdAt"`
}

func main() {
    // 创建提现
    withdrawReq := WithdrawRequest{
        Currency:   "eth",
        Amount:     "0.1",
        Address:    "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        ExternalID: "go_withdraw_123",
    }
    
    jsonData, _ := json.Marshal(withdrawReq)
    
    req, _ := http.NewRequest("POST", APIBase+"/withdraws", bytes.NewBuffer(jsonData))
    req.Header.Set("X-Api-Key", APIKey)
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("错误: %v\n", err)
        return
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    
    if resp.StatusCode == 201 {
        var withdraw WithdrawResponse
        json.Unmarshal(body, &withdraw)
        fmt.Printf("创建提现: %s\n", withdraw.ID)
        fmt.Printf("状态: %s\n", withdraw.Status)
        
        // 查询提现详情
        detailReq, _ := http.NewRequest("GET", APIBase+"/withdraws/"+withdraw.ID, nil)
        detailReq.Header.Set("X-Api-Key", APIKey)
        
        detailResp, err := client.Do(detailReq)
        if err == nil {
            defer detailResp.Body.Close()
            detailBody, _ := io.ReadAll(detailResp.Body)
            
            if detailResp.StatusCode == 200 {
                var detail WithdrawResponse
                json.Unmarshal(detailBody, &detail)
                fmt.Printf("详情状态: %s\n", detail.Status)
            }
        }
    } else {
        fmt.Printf("错误: %d\n", resp.StatusCode)
    }
}
```

## 数据结构

### 提现请求

```typescript
interface WithdrawRequest {
  currency: string;     // 币种标识符
  amount: string;       // 提现金额
  address: string;      // 目标地址
  externalId?: string;  // 外部 ID
  memo?: string;        // 备注信息
}
```

### 提现响应

```typescript
interface WithdrawResponse {
  id: string;              // 提现 ID
  currency: string;        // 币种
  amount: string;          // 金额
  address: string;         // 目标地址
  status: string;          // 状态
  externalId?: string;     // 外部 ID
  createdAt: string;       // 创建时间
  completedAt?: string;    // 完成时间
  transactionHash?: string; // 交易哈希
  fee?: string;            // 手续费
  networkFee?: string;     // 网络费用
  confirmations?: number;  // 确认数
}
```

### 批量提现请求

```typescript
interface BatchWithdrawRequest {
  withdraws: WithdrawRequest[]; // 提现请求数组
}
```

### 提现统计

```typescript
interface WithdrawSummary {
  totalWithdraws: number;           // 总提现数
  totalAmount: Record&lt;string, string&gt;; // 各币种总金额
  statusCounts: Record&lt;string, number&gt;; // 各状态数量
  last24Hours: {                    // 24小时统计
    count: number;
    totalAmount: Record&lt;string, string&gt;;
  };
}
```

## 提现状态

- `pending` - 待处理
- `processing` - 处理中
- `completed` - 已完成
- `failed` - 失败
- `cancelled` - 已取消 