# Getting Started with Integration

This guide will help you integrate the Crypto Payment Gateway into your application quickly and efficiently.

## Prerequisites

Before starting the integration, ensure you have:

- **API Access**: Valid API keys (test and production)
- **Development Environment**: Your preferred programming language setup
- **Webhook Endpoint**: HTTPS endpoint to receive notifications
- **Basic Understanding**: Cryptocurrency and blockchain concepts

## Quick Start

### 1. Account Setup

1. **Register Account**
   ```
   https://portal.gateway.com/register
   ```

2. **Verify Email and Complete KYC**
   - Email verification
   - Business information
   - Identity verification

3. **Generate API Keys**
   - Navigate to Settings → API Keys
   - Create test key for development
   - Create production key for live environment

### 2. Test API Connection

Verify your API access with a simple test call:

```bash
curl -X GET "https://api.gateway.com/v1/auth/test" \
  -H "Authorization: Bearer sk_test_your_test_key_here"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "key_id": "key_123456789",
    "permissions": ["addresses:read", "addresses:create", "transactions:read"],
    "environment": "test"
  }
}
```

### 3. Create Your First Address

Generate a cryptocurrency address to receive payments:

```bash
curl -X POST "https://api.gateway.com/v1/addresses" \
  -H "Authorization: Bearer sk_test_your_test_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "coin": "usdt",
    "type": "user",
    "metadata": {
      "customer_id": "customer_123",
      "order_id": "order_456"
    }
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "addr_123456789",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "network": "ethereum",
    "coin": "usdt",
    "type": "user",
    "status": "active",
    "metadata": {
      "customer_id": "customer_123",
      "order_id": "order_456"
    },
    "created_at": "2024-01-15T12:00:00Z"
  }
}
```

## Integration Patterns

### 1. E-commerce Integration

For online stores accepting cryptocurrency payments:

```mermaid
sequenceDiagram
    participant Customer
    participant Store
    participant Gateway
    participant Blockchain

    Customer->>Store: Place Order
    Store->>Gateway: Create Payment Address
    Gateway-->>Store: Return Address
    Store-->>Customer: Show Payment Details
    Customer->>Blockchain: Send Payment
    Blockchain->>Gateway: Transaction Detected
    Gateway->>Store: Webhook Notification
    Store->>Customer: Order Confirmation
```

#### Implementation Steps:

1. **Order Creation**
   ```javascript
   // Create payment address for order
   const paymentAddress = await gateway.addresses.create({
     network: 'ethereum',
     coin: 'usdt',
     type: 'user',
     metadata: {
       customer_id: customer.id,
       order_id: order.id,
       amount: order.total
     }
   });
   ```

2. **Payment Display**
   ```html
   <div class="payment-info">
     <h3>Payment Details</h3>
     <p>Send exactly <strong>$100.00 USDT</strong> to:</p>
     <code>0x742d35Cc6634C0532925a3b8D4C9db96590c6C87</code>
     <img src="qr-code-url" alt="QR Code" />
   </div>
   ```

3. **Webhook Handler**
   ```javascript
   app.post('/webhooks/gateway', (req, res) => {
     const { event, data } = req.body;
     
     if (event === 'transaction.confirmed') {
       const { metadata } = data;
       const order = await Order.findById(metadata.order_id);
       
       if (order && data.amount >= order.total) {
         order.status = 'paid';
         await order.save();
         
         // Send confirmation email
         await sendOrderConfirmation(order);
       }
     }
     
     res.status(200).send('OK');
   });
   ```

### 2. Subscription Service Integration

For recurring payment services:

```mermaid
sequenceDiagram
    participant User
    participant Service
    participant Gateway
    participant Scheduler

    User->>Service: Subscribe to Plan
    Service->>Gateway: Create Dedicated Address
    Gateway-->>Service: Return Address
    Service-->>User: Provide Payment Address
    User->>Gateway: Send Monthly Payment
    Gateway->>Service: Payment Notification
    Service->>Scheduler: Schedule Next Payment Check
    Scheduler->>Gateway: Check for Payment
    Gateway-->>Scheduler: Payment Status
```

#### Implementation:

```javascript
class SubscriptionService {
  async createSubscription(userId, planId) {
    // Create dedicated address for subscription
    const address = await gateway.addresses.create({
      network: 'ethereum',
      coin: 'usdt',
      type: 'user',
      metadata: {
        user_id: userId,
        plan_id: planId,
        subscription_type: 'monthly'
      }
    });

    // Store subscription
    const subscription = await Subscription.create({
      userId,
      planId,
      addressId: address.id,
      status: 'pending',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    return subscription;
  }

  async handlePayment(transactionData) {
    const { metadata, amount } = transactionData;
    const subscription = await Subscription.findOne({
      userId: metadata.user_id,
      planId: metadata.plan_id
    });

    if (subscription && amount >= subscription.plan.price) {
      subscription.status = 'active';
      subscription.lastPaymentDate = new Date();
      subscription.nextPaymentDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await subscription.save();

      // Activate user's subscription
      await this.activateUserAccess(subscription.userId);
    }
  }
}
```

### 3. Marketplace Integration

For multi-vendor platforms:

```javascript
class MarketplaceIntegration {
  async createVendorWallet(vendorId) {
    // Create hot wallet for vendor
    const hotWallet = await gateway.addresses.create({
      network: 'ethereum',
      coin: 'usdt',
      type: 'hot',
      metadata: {
        vendor_id: vendorId,
        wallet_type: 'vendor_hot'
      }
    });

    return hotWallet;
  }

  async processSale(saleData) {
    const { vendorId, amount, buyerId } = saleData;
    
    // Calculate fees
    const platformFee = amount * 0.025; // 2.5%
    const vendorAmount = amount - platformFee;

    // Create payment address for buyer
    const paymentAddress = await gateway.addresses.create({
      network: 'ethereum',
      coin: 'usdt',
      type: 'user',
      metadata: {
        vendor_id: vendorId,
        buyer_id: buyerId,
        sale_id: saleData.id,
        vendor_amount: vendorAmount.toString(),
        platform_fee: platformFee.toString()
      }
    });

    return paymentAddress;
  }

  async distributeFunds(transactionData) {
    const { metadata, amount } = transactionData;
    
    // Send to vendor
    await gateway.withdrawals.create({
      network: 'ethereum',
      coin: 'usdt',
      amount: metadata.vendor_amount,
      to_address: await this.getVendorAddress(metadata.vendor_id),
      metadata: {
        type: 'vendor_payout',
        sale_id: metadata.sale_id
      }
    });

    // Platform fee stays in system
    await this.recordPlatformRevenue(metadata.platform_fee);
  }
}
```

## SDK Integration

### JavaScript/Node.js

Install the SDK:
```bash
npm install @gateway/crypto-payment-sdk
```

Basic usage:
```javascript
const Gateway = require('@gateway/crypto-payment-sdk');

const gateway = new Gateway({
  apiKey: process.env.GATEWAY_API_KEY,
  environment: 'test' // or 'production'
});

// Create address
const address = await gateway.addresses.create({
  network: 'ethereum',
  coin: 'usdt',
  type: 'user'
});

// List transactions
const transactions = await gateway.transactions.list({
  address_id: address.id,
  status: 'confirmed'
});

// Create withdrawal
const withdrawal = await gateway.withdrawals.create({
  network: 'ethereum',
  coin: 'usdt',
  amount: '100.50',
  to_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87'
});
```

### Python

Install the SDK:
```bash
pip install gateway-crypto-payment
```

Basic usage:
```python
from gateway import Gateway

gateway = Gateway(
    api_key=os.getenv('GATEWAY_API_KEY'),
    environment='test'
)

# Create address
address = gateway.addresses.create(
    network='ethereum',
    coin='usdt',
    type='user'
)

# List transactions
transactions = gateway.transactions.list(
    address_id=address['id'],
    status='confirmed'
)

# Create withdrawal
withdrawal = gateway.withdrawals.create(
    network='ethereum',
    coin='usdt',
    amount='100.50',
    to_address='0x742d35Cc6634C0532925a3b8D4C9db96590c6C87'
)
```

### Go

Install the SDK:
```bash
go get github.com/gateway/crypto-payment-go
```

Basic usage:
```go
package main

import (
    "context"
    "os"
    
    "github.com/gateway/crypto-payment-go"
)

func main() {
    client := gateway.NewClient(gateway.Config{
        APIKey:      os.Getenv("GATEWAY_API_KEY"),
        Environment: "test",
    })

    // Create address
    address, err := client.Addresses.Create(context.Background(), &gateway.CreateAddressRequest{
        Network: "ethereum",
        Coin:    "usdt",
        Type:    "user",
    })
    if err != nil {
        panic(err)
    }

    // List transactions
    transactions, err := client.Transactions.List(context.Background(), &gateway.ListTransactionsRequest{
        AddressID: address.ID,
        Status:    "confirmed",
    })
    if err != nil {
        panic(err)
    }

    // Create withdrawal
    withdrawal, err := client.Withdrawals.Create(context.Background(), &gateway.CreateWithdrawalRequest{
        Network:   "ethereum",
        Coin:      "usdt",
        Amount:    "100.50",
        ToAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    })
    if err != nil {
        panic(err)
    }
}
```

## Webhook Setup

### 1. Create Webhook Endpoint

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.raw({ type: 'application/json' }));

app.post('/webhooks/gateway', (req, res) => {
  const signature = req.headers['x-gateway-signature'];
  const payload = req.body;

  // Verify webhook signature
  if (!verifySignature(payload, signature)) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(payload);
  
  switch (event.type) {
    case 'transaction.confirmed':
      handleTransactionConfirmed(event.data);
      break;
    case 'withdrawal.completed':
      handleWithdrawalCompleted(event.data);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send('OK');
});

function verifySignature(payload, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

### 2. Register Webhook

```bash
curl -X POST "https://api.gateway.com/v1/webhooks" \
  -H "Authorization: Bearer sk_test_your_test_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhooks/gateway",
    "events": [
      "transaction.confirmed",
      "withdrawal.completed",
      "address.created"
    ]
  }'
```

## Testing

### 1. Test Environment

Use test API keys and test networks:
- **Test API Key**: `sk_test_...`
- **Test Networks**: Ethereum Goerli, Bitcoin Testnet
- **Test Coins**: Test USDT, Test BTC

### 2. Simulate Transactions

```bash
# Send test transaction
curl -X POST "https://api.gateway.com/v1/test/transactions" \
  -H "Authorization: Bearer sk_test_your_test_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "amount": "100.50",
    "network": "ethereum",
    "coin": "usdt"
  }'
```

### 3. Test Webhooks

Use tools like ngrok for local testing:
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the ngrok URL for webhook registration
```

## Production Deployment

### 1. Environment Configuration

```bash
# Production environment variables
GATEWAY_API_KEY=sk_live_your_production_key_here
GATEWAY_ENVIRONMENT=production
WEBHOOK_SECRET=your_webhook_secret_here
DATABASE_URL=your_production_database_url
```

### 2. Security Checklist

- [ ] Use HTTPS for all webhook endpoints
- [ ] Verify webhook signatures
- [ ] Store API keys securely
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerts
- [ ] Configure proper logging
- [ ] Test failover scenarios

### 3. Monitoring

```javascript
// Add monitoring to your webhook handler
app.post('/webhooks/gateway', async (req, res) => {
  const startTime = Date.now();
  
  try {
    await processWebhook(req.body);
    
    // Log success
    logger.info('Webhook processed successfully', {
      duration: Date.now() - startTime,
      event_type: req.body.type
    });
    
    res.status(200).send('OK');
  } catch (error) {
    // Log error
    logger.error('Webhook processing failed', {
      error: error.message,
      duration: Date.now() - startTime,
      event_type: req.body.type
    });
    
    res.status(500).send('Error');
  }
});
```

## Next Steps

1. **Choose Your Integration Pattern**: E-commerce, subscription, or marketplace
2. **Select SDK**: Use our official SDKs for faster development
3. **Set Up Webhooks**: Implement real-time notifications
4. **Test Thoroughly**: Use test environment before going live
5. **Deploy Securely**: Follow security best practices
6. **Monitor Performance**: Set up logging and monitoring

## Support

- **Documentation**: [https://docs.gateway.com](https://docs.gateway.com)
- **API Reference**: [https://docs.gateway.com/api](https://docs.gateway.com/api)
- **Support Email**: support@gateway.com
- **Developer Discord**: [https://discord.gg/gateway-dev](https://discord.gg/gateway-dev)

This guide provides a solid foundation for integrating the Crypto Payment Gateway into your application. Choose the integration pattern that best fits your use case and follow the implementation steps. 