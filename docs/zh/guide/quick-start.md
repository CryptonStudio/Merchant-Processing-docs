# 快速开始

本指南将帮助您在几分钟内开始使用 Crypton Studio 支付网关。

## 前提条件

在开始之前，请确保您已经：

- 注册了商户账户
- 获得了 API 密钥
- 具备基本的编程知识

## 第一步：获取 API 密钥

1. 登录到商户控制台
2. 导航到 "API 设置" 页面
3. 生成新的 API 密钥
4. 安全保存您的密钥

::: warning 安全提示
请妥善保管您的 API 密钥，不要在客户端代码中暴露它们。
:::

## 第二步：安装 SDK（可选）

我们提供了多种语言的 SDK 来简化集成：

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

:::

## 第三步：初始化客户端

::: code-group

'''javascript [JavaScript]
import { CryptonClient } from '@crypton/payment-sdk'

const client = new CryptonClient({
  apiKey: 'your-api-key',
  environment: 'sandbox' // 测试环境
})
'''

'''python [Python]
from crypton_sdk import CryptonClient

client = CryptonClient(
    api_key='your-api-key',
    environment='sandbox'  # 测试环境
)
'''

'''go [Go]
package main

import (
    "github.com/crypton-studio/payment-sdk-go"
)

func main() {
    client := crypton.NewClient(&crypton.Config{
        APIKey:      "your-api-key",
        Environment: "sandbox", // 测试环境
    })
}
'''

:::

## 第四步：创建支付地址

创建一个用于接收支付的地址：

::: code-group

'''javascript [JavaScript]
const address = await client.addresses.create({
  network: 'ethereum',
  coin: 'USDT',
  label: '订单 #12345'
})

console.log('支付地址:', address.address)
console.log('二维码:', address.qrCode)
'''

'''python [Python]
address = client.addresses.create({
    'network': 'ethereum',
    'coin': 'USDT',
    'label': '订单 #12345'
})

print(f'支付地址: {address.address}')
print(f'二维码: {address.qr_code}')
'''

'''go [Go]
address, err := client.Addresses.Create(&crypton.CreateAddressRequest{
    Network: "ethereum",
    Coin:    "USDT",
    Label:   "订单 #12345",
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("支付地址: %s\n", address.Address)
fmt.Printf("二维码: %s\n", address.QRCode)
'''

:::

## 第五步：监控支付状态

有两种方式监控支付状态：

### 方式一：轮询查询

::: code-group

'''javascript [JavaScript]
const checkPayment = async (addressId) => {
  const transactions = await client.addresses.getTransactions(addressId)
  
  for (const tx of transactions) {
    if (tx.status === 'confirmed') {
      console.log('支付已确认:', tx.amount, tx.coin)
      // 处理支付成功逻辑
    }
  }
}

// 每 30 秒检查一次
setInterval(() => checkPayment(address.id), 30000)
'''

'''python [Python]
import time

def check_payment(address_id):
    transactions = client.addresses.get_transactions(address_id)
    
    for tx in transactions:
        if tx.status == 'confirmed':
            print(f'支付已确认: {tx.amount} {tx.coin}')
            # 处理支付成功逻辑

# 每 30 秒检查一次
while True:
    check_payment(address.id)
    time.sleep(30)
'''

'''go [Go]
func checkPayment(addressID string) {
    transactions, err := client.Addresses.GetTransactions(addressID)
    if err != nil {
        log.Printf("获取交易失败: %v", err)
        return
    }
    
    for _, tx := range transactions {
        if tx.Status == "confirmed" {
            fmt.Printf("支付已确认: %s %s\n", tx.Amount, tx.Coin)
            // 处理支付成功逻辑
        }
    }
}

// 每 30 秒检查一次
ticker := time.NewTicker(30 * time.Second)
for range ticker.C {
    checkPayment(address.ID)
}
'''

:::

### 方式二：Webhook 通知

配置 Webhook URL 来接收实时通知：

::: code-group

'''javascript [Express.js]
const express = require('express')
const app = express()

app.use(express.json())

app.post('/webhook', (req, res) => {
  const { event, data } = req.body
  
  if (event === 'transaction.confirmed') {
    console.log('收到支付确认:', data.amount, data.coin)
    // 处理支付成功逻辑
  }
  
  res.status(200).send('OK')
})

app.listen(3000)
'''

'''python [Flask]
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json()
    
    if data['event'] == 'transaction.confirmed':
        print(f"收到支付确认: {data['data']['amount']} {data['data']['coin']}")
        # 处理支付成功逻辑
    
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(port=3000)
'''

'''go [Go]
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type WebhookData struct {
    Event string      'json:"event"'
    Data  interface{ + ' 'json:"data"'
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
    var webhook WebhookData
    json.NewDecoder(r.Body).Decode(&webhook)
    
    if webhook.Event == "transaction.confirmed" {
        fmt.Println("收到支付确认")
        // 处理支付成功逻辑
    }
    
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
}

func main() {
    http.HandleFunc("/webhook", webhookHandler)
    http.ListenAndServe(":3000", nil)
}
'''

:::

## 第六步：处理提现

当需要将资金转出时：

::: code-group

'''javascript [JavaScript]
const withdrawal = await client.withdrawals.create({
  network: 'ethereum',
  coin: 'USDT',
  amount: '100.00',
  toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
  label: '提现到用户钱包'
})

console.log('提现 ID:', withdrawal.id)
console.log('状态:', withdrawal.status)
'''

'''python [Python]
withdrawal = client.withdrawals.create({
    'network': 'ethereum',
    'coin': 'USDT',
    'amount': '100.00',
    'to_address': '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    'label': '提现到用户钱包'
})

print(f'提现 ID: {withdrawal.id}')
print(f'状态: {withdrawal.status}')
'''

'''go [Go]
withdrawal, err := client.Withdrawals.Create(&crypton.CreateWithdrawalRequest{
    Network:   "ethereum",
    Coin:      "USDT",
    Amount:    "100.00",
    ToAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    Label:     "提现到用户钱包",
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("提现 ID: %s\n", withdrawal.ID)
fmt.Printf("状态: %s\n", withdrawal.Status)
'''

:::

## 完整示例

这是一个完整的支付流程示例：

::: code-group

'''javascript [JavaScript]
import { CryptonClient } from '@crypton/payment-sdk'

const client = new CryptonClient({
  apiKey: 'your-api-key',
  environment: 'sandbox'
})

async function processPayment(orderAmount, orderCurrency) {
  try {
    // 1. 创建支付地址
    const address = await client.addresses.create({
      network: 'ethereum',
      coin: orderCurrency,
      label: '订单支付 - ' + Date.now() + ''
    })
    
    console.log('请向以下地址支付:')
    console.log('地址:', address.address)
    console.log('金额:', orderAmount, orderCurrency)
    console.log('二维码:', address.qrCode)
    
    // 2. 监控支付状态
    const checkInterval = setInterval(async () => {
      const transactions = await client.addresses.getTransactions(address.id)
      
      for (const tx of transactions) {
        if (tx.status === 'confirmed' && parseFloat(tx.amount) >= parseFloat(orderAmount)) {
          console.log('支付成功!')
          console.log('交易哈希:', tx.hash)
          clearInterval(checkInterval)
          
          // 3. 处理支付成功逻辑
          await handlePaymentSuccess(tx)
          break
        }
      }
    }, 30000) // 每 30 秒检查一次
    
  } catch (error) {
    console.error('处理支付时出错:', error)
  }
}

async function handlePaymentSuccess(transaction) {
  console.log('处理支付成功逻辑...')
  // 更新订单状态
  // 发送确认邮件
  // 等等...
}

// 使用示例
processPayment('100.00', 'USDT')
'''

:::

## 下一步

恭喜！您已经成功集成了基本的支付功能。接下来您可以：

- 查看 [API 文档](/zh/api/overview) 了解更多功能
- 学习 [集成指南](/zh/integration/getting-started) 的最佳实践
- 查看 [代码示例](/zh/examples/basic-usage) 获取更多灵感
- 配置 [Webhook](/zh/api/webhooks) 实现实时通知

## 常见问题

### 如何切换到生产环境？

将 'environment' 参数从 ''sandbox'' 改为 ''production''，并使用生产环境的 API 密钥。

### 支持哪些币种？

我们支持主流的加密货币，包括 BTC、ETH、USDT、USDC 等。完整列表请查看 [币种 API](/zh/api/coins)。

### 交易确认需要多长时间？

确认时间取决于区块链网络：
- Bitcoin: ~60 分钟
- Ethereum: ~15 分钟  
- Tron: ~3 分钟
- BSC: ~3 分钟
- Polygon: ~2 分钟

### 如何处理网络拥堵？

我们的系统会自动调整 Gas 费用以确保交易及时确认。您也可以通过 API 设置自定义的费用策略。 