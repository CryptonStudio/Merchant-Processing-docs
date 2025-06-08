# 集成指南

本指南将帮助您将 Crypton Studio 支付网关集成到您的应用程序中。

## 集成流程概览

'''mermaid
graph TD
    A[注册商户账户] --> B[获取 API 密钥]
    B --> C[选择集成方式]
    C --> D[SDK 集成]
    C --> E[直接 API 调用]
    D --> F[测试集成]
    E --> F
    F --> G[配置 Webhook]
    G --> H[上线部署]
'''

## 第一步：环境准备

### 1. 注册账户
- 访问 [Crypton Studio 控制台](https://dashboard.crypton.studio)
- 注册商户账户
- 完成身份验证

### 2. 获取 API 密钥
- 在控制台生成测试环境密钥
- 保存 Client Key 和 Admin Key
- 配置 IP 白名单（推荐）

### 3. 选择开发环境
- **测试环境**: 'https://api-sandbox.crypton.studio'
- **生产环境**: 'https://api.crypton.studio'

## 第二步：选择集成方式

### 方式一：使用 SDK（推荐）

我们提供多种语言的官方 SDK：

::: code-group

'''bash [Node.js]
npm install @crypton/payment-sdk
'''

'''bash [Python]
pip install crypton-payment-sdk
'''

'''bash [Go]
go get github.com/crypton-studio/payment-sdk-go
'''

'''bash [PHP]
composer require crypton/payment-sdk
'''

:::

### 方式二：直接 API 调用

如果您的语言没有官方 SDK，可以直接调用 REST API。

## 第三步：基础集成

### JavaScript/TypeScript 示例

'''javascript
import { CryptonClient } from '@crypton/payment-sdk'

// 初始化客户端
const client = new CryptonClient({
  apiKey: 'ck_test_your_key_here',
  environment: 'sandbox'
})

// 创建支付地址
async function createPaymentAddress(amount, currency) {
  try {
    const address = await client.addresses.create({
      network: 'ethereum',
      coin: currency,
      label: 'Payment for order ' + orderId + '',
      metadata: {
        orderId: orderId,
        amount: amount,
        currency: currency
      }
    })
    
    return {
      address: address.address,
      qrCode: address.qrCode,
      id: address.id
    }
  } catch (error) {
    console.error('创建地址失败:', error)
    throw error
  }
}

// 检查支付状态
async function checkPaymentStatus(addressId) {
  try {
    const transactions = await client.addresses.getTransactions(addressId)
    
    for (const tx of transactions) {
      if (tx.status === 'confirmed') {
        return {
          status: 'paid',
          amount: tx.amount,
          hash: tx.hash,
          confirmations: tx.confirmations
        }
      }
    }
    
    return { status: 'pending' }
  } catch (error) {
    console.error('检查支付状态失败:', error)
    throw error
  }
}
'''

### Python 示例

'''python
from crypton_sdk import CryptonClient
import asyncio

# 初始化客户端
client = CryptonClient(
    api_key='ck_test_your_key_here',
    environment='sandbox'
)

async def create_payment_address(amount, currency, order_id):
    """创建支付地址"""
    try:
        address = await client.addresses.create({
            'network': 'ethereum',
            'coin': currency,
            'label': f'Payment for order {order_id}',
            'metadata': {
                'order_id': order_id,
                'amount': amount,
                'currency': currency
            }
        })
        
        return {
            'address': address.address,
            'qr_code': address.qr_code,
            'id': address.id
        }
    except Exception as error:
        print(f'创建地址失败: {error}')
        raise

async def check_payment_status(address_id):
    """检查支付状态"""
    try:
        transactions = await client.addresses.get_transactions(address_id)
        
        for tx in transactions:
            if tx.status == 'confirmed':
                return {
                    'status': 'paid',
                    'amount': tx.amount,
                    'hash': tx.hash,
                    'confirmations': tx.confirmations
                }
        
        return {'status': 'pending'}
    except Exception as error:
        print(f'检查支付状态失败: {error}')
        raise
'''

### Go 示例

'''go
package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/crypton-studio/payment-sdk-go"
)

func main() {
    // 初始化客户端
    client := crypton.NewClient(&crypton.Config{
        APIKey:      "ck_test_your_key_here",
        Environment: "sandbox",
    })
    
    // 创建支付地址
    address, err := createPaymentAddress(client, "100.00", "USDT", "order_123")
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("支付地址: %s\n", address.Address)
    fmt.Printf("二维码: %s\n", address.QRCode)
}

func createPaymentAddress(client *crypton.Client, amount, currency, orderID string) (*crypton.Address, error) {
    ctx := context.Background()
    
    req := &crypton.CreateAddressRequest{
        Network: "ethereum",
        Coin:    currency,
        Label:   fmt.Sprintf("Payment for order %s", orderID),
        Metadata: map[string]interface{}{
            "order_id": orderID,
            "amount":   amount,
            "currency": currency,
        },
    }
    
    return client.Addresses.Create(ctx, req)
}

func checkPaymentStatus(client *crypton.Client, addressID string) (*PaymentStatus, error) {
    ctx := context.Background()
    
    transactions, err := client.Addresses.GetTransactions(ctx, addressID)
    if err != nil {
        return nil, err
    }
    
    for _, tx := range transactions {
        if tx.Status == "confirmed" {
            return &PaymentStatus{
                Status:        "paid",
                Amount:        tx.Amount,
                Hash:          tx.Hash,
                Confirmations: tx.Confirmations,
            }, nil
        }
    }
    
    return &PaymentStatus{Status: "pending"}, nil
}

type PaymentStatus struct {
    Status        string 'json:"status"'
    Amount        string 'json:"amount,omitempty"'
    Hash          string 'json:"hash,omitempty"'
    Confirmations int    'json:"confirmations,omitempty"'
}
'''

## 第四步：配置 Webhook

Webhook 允许您实时接收支付状态更新：

### 1. 创建 Webhook 端点

::: code-group

'''javascript [Express.js]
const express = require('express')
const crypto = require('crypto')

const app = express()
app.use(express.json())

app.post('/webhook', (req, res) => {
  // 验证签名
  const signature = req.headers['x-crypton-signature']
  const payload = JSON.stringify(req.body)
  
  if (!verifySignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature')
  }
  
  // 处理事件
  const { event, data } = req.body
  
  switch (event) {
    case 'transaction.confirmed':
      handlePaymentConfirmed(data)
      break
    case 'transaction.failed':
      handlePaymentFailed(data)
      break
    default:
      console.log('未知事件:', event)
  }
  
  res.status(200).send('OK')
})

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return 'sha256=' + expectedSignature + '' === signature
}

function handlePaymentConfirmed(data) {
  console.log('支付确认:', data)
  // 更新订单状态
  // 发送确认邮件
  // 处理业务逻辑
}

app.listen(3000)
'''

'''python [Flask]
from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    # 验证签名
    signature = request.headers.get('X-Crypton-Signature')
    payload = request.get_data()
    
    if not verify_signature(payload, signature, WEBHOOK_SECRET):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # 处理事件
    data = request.get_json()
    event = data['event']
    event_data = data['data']
    
    if event == 'transaction.confirmed':
        handle_payment_confirmed(event_data)
    elif event == 'transaction.failed':
        handle_payment_failed(event_data)
    else:
        print(f'未知事件: {event}')
    
    return jsonify({'status': 'ok'})

def verify_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return f'sha256={expected_signature}' == signature

def handle_payment_confirmed(data):
    print(f'支付确认: {data}')
    # 更新订单状态
    # 发送确认邮件
    # 处理业务逻辑

if __name__ == '__main__':
    app.run(port=3000)
'''

:::

### 2. 注册 Webhook

'''bash
curl -X POST "https://api-sandbox.crypton.studio/v1/webhooks" \
  -H "X-Api-Key: ak_test_your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhook",
    "events": [
      "transaction.confirmed",
      "transaction.failed",
      "withdrawal.completed"
    ]
  }'
'''

## 第五步：错误处理

### 常见错误处理

'''javascript
async function handleApiCall(apiCall) {
  try {
    return await apiCall()
  } catch (error) {
    switch (error.code) {
      case 'INSUFFICIENT_BALANCE':
        // 余额不足
        throw new Error('账户余额不足，请充值后重试')
      
      case 'INVALID_ADDRESS':
        // 地址无效
        throw new Error('提现地址格式不正确')
      
      case 'NETWORK_CONGESTION':
        // 网络拥堵
        throw new Error('网络繁忙，请稍后重试')
      
      case 'RATE_LIMIT_EXCEEDED':
        // 频率限制
        await sleep(60000) // 等待 1 分钟
        return handleApiCall(apiCall) // 重试
      
      default:
        console.error('API 调用失败:', error)
        throw error
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
'''

### 重试机制

'''javascript
async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      // 指数退避
      await sleep(delay * Math.pow(2, i))
    }
  }
}
'''

## 第六步：测试

### 单元测试示例

'''javascript
const { CryptonClient } = require('@crypton/payment-sdk')

describe('Crypton Payment Integration', () => {
  let client
  
  beforeEach(() => {
    client = new CryptonClient({
      apiKey: 'ck_test_mock_key',
      environment: 'sandbox'
    })
  })
  
  test('should create payment address', async () => {
    const address = await client.addresses.create({
      network: 'ethereum',
      coin: 'USDT',
      label: 'Test payment'
    })
    
    expect(address).toHaveProperty('address')
    expect(address).toHaveProperty('qrCode')
    expect(address.network).toBe('ethereum')
  })
  
  test('should handle payment confirmation', async () => {
    const mockTransaction = {
      status: 'confirmed',
      amount: '100.000000',
      hash: '0x123...'
    }
    
    const result = await handlePaymentConfirmed(mockTransaction)
    expect(result.status).toBe('processed')
  })
})
'''

## 第七步：上线部署

### 生产环境检查清单

- [ ] 使用生产环境 API 密钥
- [ ] 配置 HTTPS
- [ ] 设置 IP 白名单
- [ ] 配置监控和日志
- [ ] 测试 Webhook 端点
- [ ] 设置错误告警
- [ ] 准备客服支持

### 环境变量配置

'''bash
# 生产环境配置
CRYPTON_API_KEY=ck_live_your_production_key
CRYPTON_ADMIN_KEY=ak_live_your_admin_key
CRYPTON_ENVIRONMENT=production
WEBHOOK_SECRET=your_webhook_secret
'''

## 最佳实践

### 1. 安全性
- 使用 HTTPS
- 验证 Webhook 签名
- 定期轮换 API 密钥
- 实施 IP 白名单

### 2. 性能优化
- 使用连接池
- 实施缓存策略
- 异步处理 Webhook
- 监控 API 调用频率

### 3. 错误处理
- 实施重试机制
- 记录详细日志
- 设置告警通知
- 准备降级方案

### 4. 监控
- 监控支付成功率
- 跟踪 API 响应时间
- 监控余额变化
- 设置异常告警

## 技术支持

如果您在集成过程中遇到问题：

- **文档**: 查看详细的 API 文档
- **示例**: 参考 GitHub 上的示例项目
- **支持**: 联系技术支持团队
- **社区**: 加入开发者社区

---

准备好开始集成了吗？查看 [API 文档](/zh/api/overview) 获取详细信息。 