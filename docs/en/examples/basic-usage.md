# Basic Usage Examples

This guide provides practical examples of how to integrate with the Crypto Payment Gateway API for common use cases.

## Getting Started

### Authentication Setup

First, obtain your API key from the dashboard and set up authentication:

```javascript
const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.your-gateway.com/api/v1';

const headers = {
  'X-Api-Key': apiKey,
  'Content-Type': 'application/json'
};
```

## Basic Payment Flow

### 1. Create a Deposit Address

Generate a unique address for receiving payments:

```javascript
// Create address for USDT on Ethereum
async function createDepositAddress(customerID) {
  const response = await fetch(`${BASE_URL}/addresses`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      network: 'ethereum',
      coin: 'usdt',
      label: `Customer ${customerID}`,
      metadata: {
        customer_id: customerID,
        purpose: 'deposit'
      }
    })
  });
  
  const result = await response.json();
  return result.data;
}

// Usage
const address = await createDepositAddress('cust_123');
console.log('Deposit address:', address.address);
```

### 2. Monitor Address Balance

Check the balance of a specific address:

```javascript
async function getAddressBalance(addressId) {
  const response = await fetch(`${BASE_URL}/addresses/${addressId}/balances`, {
    method: 'GET',
    headers
  });
  
  const result = await response.json();
  return result.data;
}

// Usage
const balances = await getAddressBalance(address.id);
balances.forEach(balance => {
  console.log(`${balance.coin}: ${balance.available}`);
});
```

### 3. List Transactions

Retrieve transaction history for an address:

```javascript
async function getTransactions(addressId, options = {}) {
  const params = new URLSearchParams({
    address_id: addressId,
    page: options.page || 1,
    limit: options.limit || 20,
    ...options
  });
  
  const response = await fetch(`${BASE_URL}/transactions?${params}`, {
    method: 'GET',
    headers
  });
  
  const result = await response.json();
  return result.data;
}

// Usage
const transactions = await getTransactions(address.id, {
  status: 'confirmed',
  coin: 'usdt'
});
```

## Payment Processing Examples

### E-commerce Integration

Complete example for an e-commerce payment flow:

```javascript
class CryptoPaymentProcessor {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.your-gateway.com/api/v1';
    this.headers = {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json'
    };
  }

  // Create payment request
  async createPayment(orderData) {
    const { orderId, amount, currency, customerEmail } = orderData;
    
    // Create deposit address
    const address = await this.createAddress({
      network: this.getNetworkForCurrency(currency),
      coin: currency.toLowerCase(),
      label: `Order ${orderId}`,
      metadata: {
        order_id: orderId,
        customer_email: customerEmail,
        amount_expected: amount
      }
    });

    return {
      paymentId: address.id,
      address: address.address,
      amount,
      currency,
      qrCode: this.generateQRCode(address.address, amount, currency)
    };
  }

  // Check payment status
  async checkPaymentStatus(paymentId) {
    const balances = await this.getAddressBalance(paymentId);
    const transactions = await this.getTransactions(paymentId);
    
    const confirmedBalance = balances.find(b => b.coin === 'usdt')?.confirmed || '0';
    const latestTx = transactions[0];
    
    return {
      status: this.determinePaymentStatus(confirmedBalance, latestTx),
      received: confirmedBalance,
      transactions: transactions.map(tx => ({
        hash: tx.hash,
        amount: tx.amount,
        confirmations: tx.confirmations,
        timestamp: tx.created_at
      }))
    };
  }

  // Helper methods
  async createAddress(data) {
    const response = await fetch(`${this.baseURL}/addresses`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return (await response.json()).data;
  }

  async getAddressBalance(addressId) {
    const response = await fetch(`${this.baseURL}/addresses/${addressId}/balances`, {
      headers: this.headers
    });
    return (await response.json()).data;
  }

  async getTransactions(addressId) {
    const response = await fetch(`${this.baseURL}/transactions?address_id=${addressId}`, {
      headers: this.headers
    });
    return (await response.json()).data;
  }

  getNetworkForCurrency(currency) {
    const networkMap = {
      'USDT': 'ethereum',
      'USDC': 'ethereum',
      'ETH': 'ethereum',
      'BTC': 'bitcoin',
      'TRX': 'tron'
    };
    return networkMap[currency.toUpperCase()] || 'ethereum';
  }

  generateQRCode(address, amount, currency) {
    // Generate payment URI for QR code
    return `${currency.toLowerCase()}:${address}?amount=${amount}`;
  }

  determinePaymentStatus(balance, latestTx) {
    if (parseFloat(balance) === 0) return 'pending';
    if (latestTx && latestTx.confirmations >= 12) return 'confirmed';
    return 'unconfirmed';
  }
}

// Usage example
const processor = new CryptoPaymentProcessor('your_api_key');

// Create payment
const payment = await processor.createPayment({
  orderId: 'ORD-123',
  amount: '100.00',
  currency: 'USDT',
  customerEmail: 'customer@example.com'
});

console.log('Payment created:', payment);

// Check status periodically
setInterval(async () => {
  const status = await processor.checkPaymentStatus(payment.paymentId);
  console.log('Payment status:', status);
  
  if (status.status === 'confirmed') {
    console.log('Payment confirmed! Processing order...');
    // Process the order
  }
}, 30000); // Check every 30 seconds
```

### Subscription Service Integration

Example for recurring payments or subscription services:

```javascript
class SubscriptionManager {
  constructor(apiKey) {
    this.processor = new CryptoPaymentProcessor(apiKey);
    this.subscriptions = new Map();
  }

  async createSubscription(subscriptionData) {
    const { customerId, planId, amount, currency, interval } = subscriptionData;
    
    // Create dedicated address for subscription
    const address = await this.processor.createAddress({
      network: this.processor.getNetworkForCurrency(currency),
      coin: currency.toLowerCase(),
      label: `Subscription ${customerId}-${planId}`,
      metadata: {
        customer_id: customerId,
        plan_id: planId,
        subscription_amount: amount,
        billing_interval: interval
      }
    });

    const subscription = {
      id: address.id,
      customerId,
      planId,
      address: address.address,
      amount,
      currency,
      interval,
      status: 'active',
      nextBilling: this.calculateNextBilling(interval),
      totalPaid: '0'
    };

    this.subscriptions.set(address.id, subscription);
    return subscription;
  }

  async processSubscriptionPayments() {
    for (const [subId, subscription] of this.subscriptions) {
      if (subscription.status !== 'active') continue;

      const status = await this.processor.checkPaymentStatus(subId);
      const newPayments = this.getNewPayments(subscription, status.transactions);

      if (newPayments.length > 0) {
        await this.processNewPayments(subscription, newPayments);
      }

      // Check if subscription needs renewal
      if (Date.now() > subscription.nextBilling) {
        await this.handleSubscriptionRenewal(subscription);
      }
    }
  }

  getNewPayments(subscription, transactions) {
    // Filter transactions that haven't been processed yet
    return transactions.filter(tx => 
      tx.confirmations >= 12 && 
      !subscription.processedTxs?.includes(tx.hash)
    );
  }

  async processNewPayments(subscription, payments) {
    let totalReceived = 0;
    
    for (const payment of payments) {
      totalReceived += parseFloat(payment.amount);
      
      // Mark transaction as processed
      if (!subscription.processedTxs) subscription.processedTxs = [];
      subscription.processedTxs.push(payment.hash);
    }

    subscription.totalPaid = (parseFloat(subscription.totalPaid) + totalReceived).toString();
    
    // Extend subscription based on payments received
    const periodsExtended = Math.floor(totalReceived / parseFloat(subscription.amount));
    if (periodsExtended > 0) {
      subscription.nextBilling = this.extendBilling(subscription.nextBilling, 
                                                   subscription.interval, 
                                                   periodsExtended);
      
      console.log(`Subscription ${subscription.id} extended by ${periodsExtended} periods`);
    }
  }

  calculateNextBilling(interval) {
    const now = new Date();
    switch (interval) {
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1)).getTime();
      case 'yearly':
        return new Date(now.setFullYear(now.getFullYear() + 1)).getTime();
      default:
        return Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }

  extendBilling(currentBilling, interval, periods) {
    const date = new Date(currentBilling);
    switch (interval) {
      case 'monthly':
        return new Date(date.setMonth(date.getMonth() + periods)).getTime();
      case 'yearly':
        return new Date(date.setFullYear(date.getFullYear() + periods)).getTime();
      default:
        return currentBilling + (periods * 30 * 24 * 60 * 60 * 1000);
    }
  }
}
```

## Withdrawal Examples

### Basic Withdrawal

Send cryptocurrency to external addresses:

```javascript
async function createWithdrawal(withdrawalData) {
  const { toAddress, amount, coin, network } = withdrawalData;
  
  const response = await fetch(`${BASE_URL}/withdrawals`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      to_address: toAddress,
      amount: amount,
      coin: coin,
      network: network,
      metadata: {
        purpose: 'user_withdrawal',
        requested_at: new Date().toISOString()
      }
    })
  });
  
  const result = await response.json();
  return result.data;
}

// Usage
const withdrawal = await createWithdrawal({
  toAddress: '0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C',
  amount: '50.00',
  coin: 'usdt',
  network: 'ethereum'
});

console.log('Withdrawal created:', withdrawal.id);
```

### Batch Withdrawals

Process multiple withdrawals efficiently:

```javascript
async function processBatchWithdrawals(withdrawals) {
  const results = [];
  
  for (const withdrawal of withdrawals) {
    try {
      const result = await createWithdrawal(withdrawal);
      results.push({ success: true, data: result });
    } catch (error) {
      results.push({ success: false, error: error.message, data: withdrawal });
    }
    
    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// Usage
const withdrawalBatch = [
  { toAddress: '0x123...', amount: '10.00', coin: 'usdt', network: 'ethereum' },
  { toAddress: '0x456...', amount: '25.50', coin: 'usdt', network: 'ethereum' },
  { toAddress: '0x789...', amount: '5.75', coin: 'usdt', network: 'ethereum' }
];

const results = await processBatchWithdrawals(withdrawalBatch);
console.log('Batch results:', results);
```

## Webhook Integration

### Setting Up Webhooks

Configure webhooks to receive real-time notifications:

```javascript
// Webhook endpoint handler (Express.js example)
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Webhook secret for verification
const WEBHOOK_SECRET = 'your_webhook_secret';

app.post('/webhooks/crypto', (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-signature'];
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook event
  const { event, data } = req.body;
  
  switch (event) {
    case 'transaction.confirmed':
      handleTransactionConfirmed(data);
      break;
    case 'withdrawal.completed':
      handleWithdrawalCompleted(data);
      break;
    case 'balance.updated':
      handleBalanceUpdated(data);
      break;
    default:
      console.log('Unknown event:', event);
  }
  
  res.status(200).send('OK');
});

function handleTransactionConfirmed(transaction) {
  console.log('Transaction confirmed:', transaction.hash);
  
  // Update order status, send confirmation email, etc.
  updateOrderStatus(transaction.metadata?.order_id, 'paid');
}

function handleWithdrawalCompleted(withdrawal) {
  console.log('Withdrawal completed:', withdrawal.id);
  
  // Notify user, update balance, etc.
  notifyUser(withdrawal.metadata?.user_id, 'withdrawal_completed', withdrawal);
}

function handleBalanceUpdated(balance) {
  console.log('Balance updated:', balance);
  
  // Update internal records, trigger alerts, etc.
  updateInternalBalance(balance.address_id, balance.coin, balance.available);
}
```

## Error Handling

### Robust Error Handling

Implement proper error handling for production use:

```javascript
class APIError extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

async function makeAPIRequest(endpoint, options = {}) {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers,
        ...options
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new APIError(
          result.error?.message || 'API request failed',
          result.error?.code || 'UNKNOWN_ERROR',
          result.error?.details
        );
      }
      
      return result.data;
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage with error handling
async function safeCreateAddress(addressData) {
  try {
    return await makeAPIRequest('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
  } catch (error) {
    if (error instanceof APIError) {
      console.error(`API Error [${error.code}]: ${error.message}`);
      if (error.details) {
        console.error('Details:', error.details);
      }
    } else {
      console.error('Network or other error:', error.message);
    }
    throw error;
  }
}
```

## Testing

### Unit Tests Example

```javascript
const { describe, it, expect, beforeEach } = require('@jest/globals');

describe('CryptoPaymentProcessor', () => {
  let processor;
  
  beforeEach(() => {
    processor = new CryptoPaymentProcessor('test_api_key');
  });
  
  it('should create payment successfully', async () => {
    const orderData = {
      orderId: 'TEST-123',
      amount: '100.00',
      currency: 'USDT',
      customerEmail: 'test@example.com'
    };
    
    const payment = await processor.createPayment(orderData);
    
    expect(payment).toHaveProperty('paymentId');
    expect(payment).toHaveProperty('address');
    expect(payment.amount).toBe('100.00');
    expect(payment.currency).toBe('USDT');
  });
  
  it('should handle API errors gracefully', async () => {
    // Mock API to return error
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({
        error: { code: 'INVALID_NETWORK', message: 'Network not supported' }
      })
    });
    
    await expect(processor.createPayment({
      orderId: 'TEST-123',
      amount: '100.00',
      currency: 'INVALID',
      customerEmail: 'test@example.com'
    })).rejects.toThrow('Network not supported');
  });
});
```

These examples provide a solid foundation for integrating with the Crypto Payment Gateway. Remember to always test thoroughly in a sandbox environment before deploying to production. 