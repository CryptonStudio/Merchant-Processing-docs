# Subscription Billing Example

This example demonstrates how to implement recurring cryptocurrency payments for subscription-based services using the Crypto Payment Gateway.

## Overview

Subscription billing with cryptocurrency involves:

1. Creating subscription plans
2. Generating recurring payment addresses
3. Monitoring subscription payments
4. Handling payment failures and renewals
5. Managing subscription lifecycle

## Implementation

### 1. Subscription Service

```javascript
// services/SubscriptionService.js
const { Gateway } = require('@gateway/crypto-payment-sdk');

class SubscriptionService {
  constructor() {
    this.gateway = new Gateway({
      apiKey: process.env.GATEWAY_API_KEY,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'test'
    });
  }

  async createSubscription(customerId, planId, paymentMethod) {
    try {
      const plan = await this.getSubscriptionPlan(planId);
      const customer = await this.getCustomer(customerId);

      // Create subscription record
      const subscription = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId,
        planId,
        status: 'pending',
        currentPeriodStart: new Date(),
        currentPeriodEnd: this.calculateNextBillingDate(plan.interval),
        paymentMethod,
        createdAt: new Date(),
        metadata: {
          customer_email: customer.email,
          plan_name: plan.name
        }
      };

      // Generate first payment
      const firstPayment = await this.generateSubscriptionPayment(subscription);
      
      await this.saveSubscription(subscription);
      
      return {
        subscription,
        firstPayment
      };

    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw new Error('Subscription creation failed');
    }
  }

  async generateSubscriptionPayment(subscription) {
    const plan = await this.getSubscriptionPlan(subscription.planId);
    
    // Create payment address for this billing cycle
    const paymentAddress = await this.gateway.addresses.create({
      network: subscription.paymentMethod.network,
      coin: subscription.paymentMethod.coin,
      type: 'user',
      metadata: {
        subscription_id: subscription.id,
        customer_id: subscription.customerId,
        plan_id: subscription.planId,
        amount: plan.price.toString(),
        billing_period_start: subscription.currentPeriodStart.toISOString(),
        billing_period_end: subscription.currentPeriodEnd.toISOString(),
        payment_type: 'subscription_renewal'
      }
    });

    const payment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subscriptionId: subscription.id,
      amount: plan.price,
      currency: plan.currency,
      status: 'pending',
      dueDate: subscription.currentPeriodEnd,
      paymentAddress: paymentAddress.data.address,
      paymentAddressId: paymentAddress.data.id,
      network: paymentAddress.data.network,
      coin: paymentAddress.data.coin,
      createdAt: new Date()
    };

    await this.saveSubscriptionPayment(payment);
    
    return payment;
  }

  async processSubscriptionPayment(transactionData) {
    const { metadata } = transactionData;
    
    if (!metadata.subscription_id) {
      throw new Error('No subscription ID in transaction metadata');
    }

    const subscription = await this.getSubscription(metadata.subscription_id);
    const payment = await this.getSubscriptionPaymentByAddress(transactionData.to_address);

    if (!subscription || !payment) {
      throw new Error('Subscription or payment not found');
    }

    // Verify payment amount
    const expectedAmount = parseFloat(metadata.amount);
    const receivedAmount = parseFloat(transactionData.amount);

    if (receivedAmount < expectedAmount) {
      await this.handleInsufficientPayment(subscription, payment, receivedAmount, expectedAmount);
      return;
    }

    // Mark payment as completed
    await this.updatePaymentStatus(payment.id, 'completed', {
      transactionId: transactionData.id,
      transactionHash: transactionData.hash,
      paidAmount: receivedAmount,
      paidAt: new Date()
    });

    // Update subscription
    await this.renewSubscription(subscription);

    // Send confirmation
    await this.sendSubscriptionRenewalConfirmation(subscription, payment);
  }

  async renewSubscription(subscription) {
    const plan = await this.getSubscriptionPlan(subscription.planId);
    
    // Calculate next billing period
    const nextPeriodStart = new Date(subscription.currentPeriodEnd);
    const nextPeriodEnd = this.calculateNextBillingDate(plan.interval, nextPeriodStart);

    // Update subscription
    await this.updateSubscription(subscription.id, {
      status: 'active',
      currentPeriodStart: nextPeriodStart,
      currentPeriodEnd: nextPeriodEnd,
      lastPaymentAt: new Date()
    });

    // Schedule next payment generation
    await this.scheduleNextPayment(subscription.id, nextPeriodEnd);
  }

  calculateNextBillingDate(interval, fromDate = new Date()) {
    const date = new Date(fromDate);
    
    switch (interval) {
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      default:
        throw new Error(`Unsupported billing interval: ${interval}`);
    }
    
    return date;
  }

  // Database operations (implement based on your database)
  async getSubscriptionPlan(planId) {
    // Mock implementation
    return {
      id: planId,
      name: 'Premium Plan',
      price: 29.99,
      currency: 'USD',
      interval: 'monthly',
      features: ['Feature 1', 'Feature 2']
    };
  }

  async getCustomer(customerId) {
    return {
      id: customerId,
      email: 'customer@example.com',
      name: 'John Doe'
    };
  }

  async saveSubscription(subscription) {
    console.log('Saving subscription:', subscription);
  }

  async saveSubscriptionPayment(payment) {
    console.log('Saving subscription payment:', payment);
  }

  async getSubscription(subscriptionId) {
    // Mock implementation
    return {
      id: subscriptionId,
      customerId: 'customer_123',
      planId: 'plan_premium',
      status: 'active'
    };
  }

  async updateSubscription(subscriptionId, updates) {
    console.log(`Updating subscription ${subscriptionId}:`, updates);
  }

  async updatePaymentStatus(paymentId, status, data) {
    console.log(`Updating payment ${paymentId} to ${status}:`, data);
  }
}

module.exports = SubscriptionService;
```

### 2. Frontend Subscription Dashboard

```html
<!-- subscription-dashboard.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Subscription Dashboard</title>
    <style>
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .subscription-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            background: white;
        }
        .status-active { border-left: 4px solid #28a745; }
        .status-expired { border-left: 4px solid #dc3545; }
        .status-pending { border-left: 4px solid #ffc107; }
        .payment-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .payment-address {
            font-family: monospace;
            background: white;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            word-break: break-all;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        .btn-primary { background: #007bff; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-success { background: #28a745; color: white; }
    </style>
</head>
<body>
    <div class="dashboard">
        <h1>My Subscriptions</h1>
        
        <div id="subscriptions-container">
            <!-- Subscriptions will be loaded here -->
        </div>
        
        <div id="create-subscription" style="margin-top: 40px;">
            <h2>Create New Subscription</h2>
            <form id="subscription-form">
                <div>
                    <label>Plan:</label>
                    <select id="plan-select" required>
                        <option value="">Select a plan</option>
                        <option value="plan_basic">Basic - $9.99/month</option>
                        <option value="plan_premium">Premium - $29.99/month</option>
                        <option value="plan_enterprise">Enterprise - $99.99/month</option>
                    </select>
                </div>
                <div>
                    <label>Payment Method:</label>
                    <select id="payment-method" required>
                        <option value="">Select payment method</option>
                        <option value="ethereum-usdt">Ethereum USDT</option>
                        <option value="bitcoin-btc">Bitcoin</option>
                        <option value="polygon-usdc">Polygon USDC</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Create Subscription</button>
            </form>
        </div>
    </div>

    <script>
        class SubscriptionDashboard {
            constructor() {
                this.customerId = 'customer_123'; // Get from auth
                this.init();
            }

            async init() {
                await this.loadSubscriptions();
                this.setupEventListeners();
            }

            async loadSubscriptions() {
                try {
                    const response = await fetch(`/api/customers/${this.customerId}/subscriptions`);
                    const subscriptions = await response.json();
                    
                    this.renderSubscriptions(subscriptions);
                } catch (error) {
                    console.error('Failed to load subscriptions:', error);
                }
            }

            renderSubscriptions(subscriptions) {
                const container = document.getElementById('subscriptions-container');
                
                if (subscriptions.length === 0) {
                    container.innerHTML = '<p>No subscriptions found.</p>';
                    return;
                }

                container.innerHTML = subscriptions.map(sub => `
                    <div class="subscription-card status-${sub.status}">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3>${sub.plan.name}</h3>
                            <span class="status-badge status-${sub.status}">${sub.status.toUpperCase()}</span>
                        </div>
                        
                        <p><strong>Price:</strong> $${sub.plan.price}/${sub.plan.interval}</p>
                        <p><strong>Current Period:</strong> ${new Date(sub.currentPeriodStart).toLocaleDateString()} - ${new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
                        
                        ${sub.status === 'active' && sub.nextPayment ? `
                            <div class="payment-info">
                                <h4>Next Payment Due: ${new Date(sub.nextPayment.dueDate).toLocaleDateString()}</h4>
                                <p><strong>Amount:</strong> ${sub.nextPayment.amount} ${sub.nextPayment.coin.toUpperCase()}</p>
                                <p><strong>Payment Address:</strong></p>
                                <div class="payment-address">${sub.nextPayment.paymentAddress}</div>
                                <button class="btn btn-primary" onclick="this.copyAddress('${sub.nextPayment.paymentAddress}')">Copy Address</button>
                                <button class="btn btn-success" onclick="this.showQRCode('${sub.nextPayment.paymentAddress}', '${sub.nextPayment.amount}')">Show QR Code</button>
                            </div>
                        ` : ''}
                        
                        <div style="margin-top: 15px;">
                            <button class="btn btn-primary" onclick="this.viewPaymentHistory('${sub.id}')">Payment History</button>
                            ${sub.status === 'active' ? `
                                <button class="btn btn-danger" onclick="this.cancelSubscription('${sub.id}')">Cancel Subscription</button>
                            ` : ''}
                        </div>
                    </div>
                `).join('');
            }

            setupEventListeners() {
                document.getElementById('subscription-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.createSubscription();
                });
            }

            async createSubscription() {
                const planId = document.getElementById('plan-select').value;
                const paymentMethodValue = document.getElementById('payment-method').value;
                
                if (!planId || !paymentMethodValue) {
                    alert('Please select both plan and payment method');
                    return;
                }

                const [network, coin] = paymentMethodValue.split('-');
                
                try {
                    const response = await fetch('/api/subscriptions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            customerId: this.customerId,
                            planId,
                            paymentMethod: { network, coin }
                        })
                    });

                    const result = await response.json();
                    
                    if (response.ok) {
                        alert('Subscription created successfully!');
                        await this.loadSubscriptions();
                        document.getElementById('subscription-form').reset();
                    } else {
                        alert(`Failed to create subscription: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Create subscription error:', error);
                    alert('Failed to create subscription');
                }
            }

            async cancelSubscription(subscriptionId) {
                if (!confirm('Are you sure you want to cancel this subscription?')) {
                    return;
                }

                try {
                    const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
                        method: 'POST'
                    });

                    if (response.ok) {
                        alert('Subscription cancelled successfully');
                        await this.loadSubscriptions();
                    } else {
                        alert('Failed to cancel subscription');
                    }
                } catch (error) {
                    console.error('Cancel subscription error:', error);
                    alert('Failed to cancel subscription');
                }
            }

            copyAddress(address) {
                navigator.clipboard.writeText(address).then(() => {
                    alert('Address copied to clipboard!');
                });
            }

            showQRCode(address, amount) {
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(address)}`;
                
                const popup = window.open('', 'QR Code', 'width=400,height=400');
                popup.document.write(`
                    <html>
                        <head><title>Payment QR Code</title></head>
                        <body style="text-align: center; padding: 20px;">
                            <h3>Scan to Pay</h3>
                            <p><strong>Amount:</strong> ${amount}</p>
                            <img src="${qrUrl}" alt="QR Code" />
                            <p style="word-break: break-all; font-family: monospace; background: #f5f5f5; padding: 10px;">${address}</p>
                        </body>
                    </html>
                `);
            }

            async viewPaymentHistory(subscriptionId) {
                try {
                    const response = await fetch(`/api/subscriptions/${subscriptionId}/payments`);
                    const payments = await response.json();
                    
                    // Show payment history in a modal or new page
                    this.showPaymentHistoryModal(payments);
                } catch (error) {
                    console.error('Failed to load payment history:', error);
                }
            }

            showPaymentHistoryModal(payments) {
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
                    z-index: 1000;
                `;
                
                modal.innerHTML = `
                    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 600px; max-height: 80%; overflow-y: auto;">
                        <h3>Payment History</h3>
                        <div>
                            ${payments.map(payment => `
                                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                                    <p><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Amount:</strong> ${payment.amount} ${payment.coin.toUpperCase()}</p>
                                    <p><strong>Status:</strong> ${payment.status}</p>
                                    ${payment.transactionHash ? `<p><strong>Transaction:</strong> ${payment.transactionHash}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                        <button onclick="document.body.removeChild(this.closest('div'))" class="btn btn-primary">Close</button>
                    </div>
                `;
                
                document.body.appendChild(modal);
            }
        }

        // Initialize dashboard
        new SubscriptionDashboard();
    </script>
</body>
</html>
```

## Key Features

### 1. Flexible Billing Intervals
- Monthly, quarterly, yearly, weekly billing
- Custom billing dates
- Prorated billing support

### 2. Payment Monitoring
- Real-time payment detection
- Automatic renewal processing
- Grace period handling

### 3. Subscription Management
- Easy cancellation
- Plan upgrades/downgrades
- Payment history tracking

### 4. Error Handling
- Insufficient payment handling
- Failed payment retry logic
- Automatic expiry management

### 5. Customer Experience
- Clear payment instructions
- QR code generation
- Email notifications
- Dashboard interface

This subscription billing system provides a complete solution for recurring cryptocurrency payments with proper error handling and customer management. 