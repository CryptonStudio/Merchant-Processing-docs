# Payment Flow Example

This comprehensive example demonstrates a complete payment flow from order creation to payment confirmation using the Crypto Payment Gateway.

## Overview

This example shows how to implement a typical e-commerce payment flow:

1. Customer places an order
2. System generates payment address
3. Customer sends cryptocurrency
4. System detects and confirms payment
5. Order is fulfilled

## Complete Implementation

### 1. Order Creation and Payment Address Generation

```javascript
// services/PaymentService.js
const { Gateway } = require('@gateway/crypto-payment-sdk');

class PaymentService {
  constructor() {
    this.gateway = new Gateway({
      apiKey: process.env.GATEWAY_API_KEY,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'test'
    });
  }

  async createPaymentForOrder(order) {
    try {
      // Create unique payment address for this order
      const paymentAddress = await this.gateway.addresses.create({
        network: order.paymentMethod.network || 'ethereum',
        coin: order.paymentMethod.coin || 'usdt',
        type: 'user',
        metadata: {
          customer_id: order.customerId,
          order_id: order.id,
          amount: order.total.toString(),
          currency: order.currency,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }
      });

      // Update order with payment information
      await this.updateOrderPaymentInfo(order.id, {
        paymentAddressId: paymentAddress.data.id,
        paymentAddress: paymentAddress.data.address,
        network: paymentAddress.data.network,
        coin: paymentAddress.data.coin,
        status: 'awaiting_payment'
      });

      return {
        success: true,
        paymentAddress: paymentAddress.data.address,
        network: paymentAddress.data.network,
        coin: paymentAddress.data.coin,
        amount: order.total,
        qrCode: await this.generateQRCode(paymentAddress.data.address, order.total),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };

    } catch (error) {
      console.error('Failed to create payment for order:', error);
      throw new Error('Payment creation failed');
    }
  }

  async generateQRCode(address, amount) {
    // Generate QR code for payment
    const paymentUri = `ethereum:${address}?value=${amount}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentUri)}`;
  }

  async updateOrderPaymentInfo(orderId, paymentInfo) {
    // Update order in database
    // Implementation depends on your database
    console.log(`Updating order ${orderId} with payment info:`, paymentInfo);
  }
}

module.exports = PaymentService;
```

### 2. Frontend Payment Interface

```html
<!-- payment.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Complete Payment</title>
    <style>
        .payment-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .payment-info {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .address-display {
            background: white;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
            margin: 10px 0;
        }
        .qr-code {
            text-align: center;
            margin: 20px 0;
        }
        .status-indicator {
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            font-weight: bold;
        }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-failed { background: #f8d7da; color: #721c24; }
        .countdown {
            background: #e7f3ff;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="payment-container">
        <h1>Complete Your Payment</h1>
        
        <div class="payment-info">
            <h3>Order Summary</h3>
            <p><strong>Order ID:</strong> <span id="orderId"></span></p>
            <p><strong>Amount:</strong> <span id="amount"></span> <span id="coin"></span></p>
            <p><strong>Network:</strong> <span id="network"></span></p>
        </div>

        <div class="payment-info">
            <h3>Payment Instructions</h3>
            <p>Send exactly <strong><span id="paymentAmount"></span> <span id="paymentCoin"></span></strong> to the address below:</p>
            
            <div class="address-display" id="paymentAddress"></div>
            
            <div class="qr-code">
                <img id="qrCode" alt="Payment QR Code" style="max-width: 200px;">
            </div>
            
            <div class="countdown">
                <p>Payment expires in: <span id="countdown"></span></p>
            </div>
        </div>

        <div id="paymentStatus" class="status-indicator status-pending">
            ⏳ Waiting for payment...
        </div>

        <div id="transactionInfo" style="display: none;">
            <h3>Transaction Details</h3>
            <p><strong>Transaction Hash:</strong> <span id="txHash"></span></p>
            <p><strong>Confirmations:</strong> <span id="confirmations"></span></p>
            <p><strong>Status:</strong> <span id="txStatus"></span></p>
        </div>
    </div>

    <script>
        class PaymentMonitor {
            constructor(orderId) {
                this.orderId = orderId;
                this.pollInterval = null;
                this.countdownInterval = null;
                this.init();
            }

            async init() {
                await this.loadPaymentInfo();
                this.startPolling();
                this.startCountdown();
            }

            async loadPaymentInfo() {
                try {
                    const response = await fetch(`/api/orders/${this.orderId}/payment`);
                    const payment = await response.json();

                    document.getElementById('orderId').textContent = this.orderId;
                    document.getElementById('amount').textContent = payment.amount;
                    document.getElementById('coin').textContent = payment.coin.toUpperCase();
                    document.getElementById('network').textContent = payment.network;
                    document.getElementById('paymentAmount').textContent = payment.amount;
                    document.getElementById('paymentCoin').textContent = payment.coin.toUpperCase();
                    document.getElementById('paymentAddress').textContent = payment.address;
                    document.getElementById('qrCode').src = payment.qrCode;

                    this.expiresAt = new Date(payment.expiresAt);
                } catch (error) {
                    console.error('Failed to load payment info:', error);
                }
            }

            startPolling() {
                this.pollInterval = setInterval(async () => {
                    await this.checkPaymentStatus();
                }, 10000); // Check every 10 seconds
            }

            async checkPaymentStatus() {
                try {
                    const response = await fetch(`/api/orders/${this.orderId}/status`);
                    const status = await response.json();

                    this.updatePaymentStatus(status);

                    if (status.status === 'confirmed' || status.status === 'failed') {
                        clearInterval(this.pollInterval);
                        clearInterval(this.countdownInterval);
                    }
                } catch (error) {
                    console.error('Failed to check payment status:', error);
                }
            }

            updatePaymentStatus(status) {
                const statusElement = document.getElementById('paymentStatus');
                const transactionInfo = document.getElementById('transactionInfo');

                switch (status.status) {
                    case 'awaiting_payment':
                        statusElement.className = 'status-indicator status-pending';
                        statusElement.innerHTML = '⏳ Waiting for payment...';
                        break;
                    case 'payment_detected':
                        statusElement.className = 'status-indicator status-pending';
                        statusElement.innerHTML = '🔍 Payment detected, waiting for confirmations...';
                        this.showTransactionInfo(status.transaction);
                        break;
                    case 'confirmed':
                        statusElement.className = 'status-indicator status-confirmed';
                        statusElement.innerHTML = '✅ Payment confirmed! Order is being processed.';
                        this.showTransactionInfo(status.transaction);
                        setTimeout(() => {
                            window.location.href = `/orders/${this.orderId}/success`;
                        }, 3000);
                        break;
                    case 'failed':
                        statusElement.className = 'status-indicator status-failed';
                        statusElement.innerHTML = '❌ Payment failed or expired.';
                        break;
                }
            }

            showTransactionInfo(transaction) {
                if (transaction) {
                    document.getElementById('txHash').textContent = transaction.hash;
                    document.getElementById('confirmations').textContent = transaction.confirmations;
                    document.getElementById('txStatus').textContent = transaction.status;
                    document.getElementById('transactionInfo').style.display = 'block';
                }
            }

            startCountdown() {
                this.countdownInterval = setInterval(() => {
                    const now = new Date();
                    const timeLeft = this.expiresAt - now;

                    if (timeLeft <= 0) {
                        document.getElementById('countdown').textContent = 'EXPIRED';
                        clearInterval(this.countdownInterval);
                        return;
                    }

                    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                    document.getElementById('countdown').textContent = 
                        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }, 1000);
            }
        }

        // Initialize payment monitor
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId') || 'ORDER_123';
        new PaymentMonitor(orderId);
    </script>
</body>
</html>
```

### 3. Backend API Endpoints

```javascript
// routes/payment.js
const express = require('express');
const PaymentService = require('../services/PaymentService');
const OrderService = require('../services/OrderService');

const router = express.Router();
const paymentService = new PaymentService();
const orderService = new OrderService();

// Create payment for order
router.post('/orders/:orderId/payment', async (req, res) => {
  try {
    const order = await orderService.getOrder(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending payment' });
    }

    const payment = await paymentService.createPaymentForOrder(order);
    
    res.json(payment);
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Get payment info for order
router.get('/orders/:orderId/payment', async (req, res) => {
  try {
    const order = await orderService.getOrder(req.params.orderId);
    
    if (!order || !order.paymentAddress) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      address: order.paymentAddress,
      network: order.network,
      coin: order.coin,
      amount: order.total,
      qrCode: await paymentService.generateQRCode(order.paymentAddress, order.total),
      expiresAt: order.paymentExpiresAt
    });
  } catch (error) {
    console.error('Get payment info error:', error);
    res.status(500).json({ error: 'Failed to get payment info' });
  }
});

// Get order status
router.get('/orders/:orderId/status', async (req, res) => {
  try {
    const order = await orderService.getOrderWithTransaction(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      status: order.status,
      transaction: order.transaction ? {
        hash: order.transaction.hash,
        confirmations: order.transaction.confirmations,
        status: order.transaction.status
      } : null
    });
  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({ error: 'Failed to get order status' });
  }
});

module.exports = router;
```

### 4. Webhook Handler for Payment Processing

```javascript
// webhooks/paymentWebhook.js
const express = require('express');
const crypto = require('crypto');
const OrderService = require('../services/OrderService');
const NotificationService = require('../services/NotificationService');

const router = express.Router();
const orderService = new OrderService();
const notificationService = new NotificationService();

// Webhook signature verification middleware
function verifyWebhookSignature(req, res, next) {
  const signature = req.headers['x-gateway-signature'];
  const payload = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== `sha256=${expectedSignature}`) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  next();
}

// Main webhook handler
router.post('/gateway', verifyWebhookSignature, async (req, res) => {
  try {
    const { event, data } = req.body;
    
    console.log(`Received webhook: ${event}`, data);
    
    switch (event) {
      case 'transaction.detected':
        await handleTransactionDetected(data);
        break;
      case 'transaction.confirmed':
        await handleTransactionConfirmed(data);
        break;
      case 'transaction.failed':
        await handleTransactionFailed(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleTransactionDetected(transaction) {
  const { metadata } = transaction;
  
  if (!metadata || !metadata.order_id) {
    console.log('Transaction without order metadata:', transaction.id);
    return;
  }
  
  try {
    // Update order status
    await orderService.updateOrderStatus(metadata.order_id, 'payment_detected', {
      transactionId: transaction.id,
      transactionHash: transaction.hash,
      amount: transaction.amount,
      confirmations: transaction.confirmations
    });
    
    // Send notification to customer
    await notificationService.sendPaymentDetectedNotification(metadata.order_id);
    
    console.log(`Payment detected for order ${metadata.order_id}`);
  } catch (error) {
    console.error(`Failed to process detected transaction for order ${metadata.order_id}:`, error);
  }
}

async function handleTransactionConfirmed(transaction) {
  const { metadata } = transaction;
  
  if (!metadata || !metadata.order_id) {
    console.log('Confirmed transaction without order metadata:', transaction.id);
    return;
  }
  
  try {
    const order = await orderService.getOrder(metadata.order_id);
    
    if (!order) {
      console.error(`Order not found: ${metadata.order_id}`);
      return;
    }
    
    // Verify payment amount
    const expectedAmount = parseFloat(metadata.amount);
    const receivedAmount = parseFloat(transaction.amount);
    
    if (receivedAmount < expectedAmount) {
      console.error(`Insufficient payment for order ${metadata.order_id}: expected ${expectedAmount}, received ${receivedAmount}`);
      await orderService.updateOrderStatus(metadata.order_id, 'payment_insufficient');
      return;
    }
    
    // Mark order as paid and confirmed
    await orderService.updateOrderStatus(metadata.order_id, 'confirmed', {
      transactionId: transaction.id,
      transactionHash: transaction.hash,
      amount: transaction.amount,
      confirmations: transaction.confirmations,
      confirmedAt: new Date()
    });
    
    // Process the order (fulfill, ship, etc.)
    await orderService.processOrder(metadata.order_id);
    
    // Send confirmation notifications
    await notificationService.sendPaymentConfirmedNotification(metadata.order_id);
    
    console.log(`Payment confirmed and order processed: ${metadata.order_id}`);
  } catch (error) {
    console.error(`Failed to process confirmed transaction for order ${metadata.order_id}:`, error);
  }
}

async function handleTransactionFailed(transaction) {
  const { metadata } = transaction;
  
  if (!metadata || !metadata.order_id) {
    return;
  }
  
  try {
    await orderService.updateOrderStatus(metadata.order_id, 'payment_failed', {
      transactionId: transaction.id,
      transactionHash: transaction.hash,
      failureReason: transaction.failure_reason
    });
    
    await notificationService.sendPaymentFailedNotification(metadata.order_id);
    
    console.log(`Payment failed for order ${metadata.order_id}`);
  } catch (error) {
    console.error(`Failed to process failed transaction for order ${metadata.order_id}:`, error);
  }
}

module.exports = router;
```

### 5. Order Service Implementation

```javascript
// services/OrderService.js
class OrderService {
  constructor() {
    // Initialize database connection
  }

  async getOrder(orderId) {
    // Get order from database
    // This is a mock implementation
    return {
      id: orderId,
      customerId: 'customer_123',
      total: 100.50,
      currency: 'USD',
      status: 'pending',
      items: [
        { name: 'Product 1', price: 50.25, quantity: 1 },
        { name: 'Product 2', price: 50.25, quantity: 1 }
      ],
      paymentMethod: {
        network: 'ethereum',
        coin: 'usdt'
      }
    };
  }

  async getOrderWithTransaction(orderId) {
    const order = await this.getOrder(orderId);
    
    // Add transaction info if available
    if (order.transactionId) {
      order.transaction = {
        id: order.transactionId,
        hash: order.transactionHash,
        confirmations: order.confirmations || 0,
        status: order.transactionStatus || 'pending'
      };
    }
    
    return order;
  }

  async updateOrderStatus(orderId, status, transactionData = {}) {
    console.log(`Updating order ${orderId} status to ${status}`, transactionData);
    
    // Update order in database
    // Implementation depends on your database
    
    return true;
  }

  async processOrder(orderId) {
    console.log(`Processing order ${orderId}`);
    
    // Implement order fulfillment logic:
    // - Update inventory
    // - Generate shipping labels
    // - Send to fulfillment center
    // - Update order status to 'processing'
    
    return true;
  }
}

module.exports = OrderService;
```

### 6. Notification Service

```javascript
// services/NotificationService.js
class NotificationService {
  async sendPaymentDetectedNotification(orderId) {
    console.log(`Sending payment detected notification for order ${orderId}`);
    
    // Send email/SMS to customer
    // Implementation depends on your notification provider
  }

  async sendPaymentConfirmedNotification(orderId) {
    console.log(`Sending payment confirmed notification for order ${orderId}`);
    
    // Send confirmation email with order details
    // Update customer dashboard
    // Send internal notifications to fulfillment team
  }

  async sendPaymentFailedNotification(orderId) {
    console.log(`Sending payment failed notification for order ${orderId}`);
    
    // Send failure notification to customer
    // Provide alternative payment options
  }
}

module.exports = NotificationService;
```

## Usage Flow

### 1. Customer Places Order
```javascript
// Customer checkout process
const order = await orderService.createOrder({
  customerId: 'customer_123',
  items: [
    { productId: 'prod_1', quantity: 1, price: 50.25 },
    { productId: 'prod_2', quantity: 1, price: 50.25 }
  ],
  paymentMethod: {
    type: 'crypto',
    network: 'ethereum',
    coin: 'usdt'
  }
});

// Redirect to payment page
window.location.href = `/payment?orderId=${order.id}`;
```

### 2. Payment Page Loads
- Generates unique payment address
- Displays QR code and payment instructions
- Starts monitoring for payment

### 3. Customer Sends Payment
- Customer scans QR code or copies address
- Sends exact amount to the address
- System detects transaction via webhook

### 4. Payment Confirmation
- Transaction gets confirmed on blockchain
- Webhook triggers order processing
- Customer receives confirmation
- Order fulfillment begins

## Error Handling

### Payment Timeout
```javascript
// Handle expired payments
setTimeout(async () => {
  const order = await orderService.getOrder(orderId);
  if (order.status === 'awaiting_payment') {
    await orderService.updateOrderStatus(orderId, 'expired');
    await notificationService.sendPaymentExpiredNotification(orderId);
  }
}, 24 * 60 * 60 * 1000); // 24 hours
```

### Insufficient Payment
```javascript
// Handle underpayment
if (receivedAmount < expectedAmount) {
  const shortfall = expectedAmount - receivedAmount;
  await orderService.updateOrderStatus(orderId, 'payment_insufficient', {
    receivedAmount,
    expectedAmount,
    shortfall
  });
  
  // Offer options: refund or pay difference
  await notificationService.sendInsufficientPaymentNotification(orderId, shortfall);
}
```

### Overpayment
```javascript
// Handle overpayment
if (receivedAmount > expectedAmount) {
  const overpayment = receivedAmount - expectedAmount;
  await orderService.updateOrderStatus(orderId, 'confirmed', {
    overpayment
  });
  
  // Process refund for overpayment
  await paymentService.processRefund(orderId, overpayment);
}
```

## Security Considerations

1. **Webhook Signature Verification**: Always verify webhook signatures
2. **Payment Validation**: Verify amounts and addresses
3. **Timeout Handling**: Implement payment expiration
4. **Idempotency**: Handle duplicate webhooks gracefully
5. **Error Logging**: Log all payment events for audit

This complete payment flow example demonstrates production-ready cryptocurrency payment processing with proper error handling, monitoring, and customer experience.
