# TypeScript SDK

The TypeScript SDK provides type-safe integration with the Crypto Payment Gateway API, offering excellent developer experience with IntelliSense and compile-time error checking.

## Installation

```bash
npm install @gateway/crypto-payment-sdk
# or
yarn add @gateway/crypto-payment-sdk
```

## Quick Start

### Basic Setup

```typescript
import { Gateway, GatewayConfig } from '@gateway/crypto-payment-sdk';

const config: GatewayConfig = {
  apiKey: process.env.GATEWAY_API_KEY!,
  environment: 'test', // or 'production'
  timeout: 30000, // 30 seconds
  retries: 3
};

const gateway = new Gateway(config);
```

### Environment Configuration

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    GATEWAY_API_KEY: string;
    GATEWAY_ENVIRONMENT: 'test' | 'production';
    WEBHOOK_SECRET: string;
  }
}

// config/gateway.ts
export const gatewayConfig: GatewayConfig = {
  apiKey: process.env.GATEWAY_API_KEY,
  environment: process.env.GATEWAY_ENVIRONMENT || 'test',
  baseUrl: process.env.GATEWAY_BASE_URL,
  timeout: 30000,
  retries: 3,
  debug: process.env.NODE_ENV === 'development'
};
```

## Type Definitions

### Core Types

```typescript
// Address Types
interface Address {
  id: string;
  address: string;
  network: string;
  coin: string;
  type: 'user' | 'hot' | 'cold' | 'tokens_collector';
  mode: 'single' | 'common' | 'cross';
  status: 'active' | 'inactive' | 'suspended';
  balance: {
    confirmed: string;
    unconfirmed: string;
    total: string;
  };
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Transaction Types
interface Transaction {
  id: string;
  hash: string;
  type: 'incoming' | 'outgoing' | 'internal';
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  network: string;
  coin: string;
  amount: string;
  fee: string;
  from_address: string;
  to_address: string;
  confirmations: number;
  block_number?: number;
  block_hash?: string;
  metadata?: Record<string, any>;
  created_at: string;
  confirmed_at?: string;
}

// Withdrawal Types
interface Withdrawal {
  id: string;
  status: 'pending' | 'processing' | 'broadcasting' | 'confirming' | 'confirmed' | 'failed' | 'cancelled';
  network: string;
  coin: string;
  amount: string;
  fee: string;
  to_address: string;
  from_address: string;
  transaction_hash?: string;
  confirmations?: number;
  metadata?: Record<string, any>;
  created_at: string;
  confirmed_at?: string;
}
```

### Request/Response Types

```typescript
// Address Requests
interface CreateAddressRequest {
  network: string;
  coin: string;
  type: 'user' | 'hot' | 'cold' | 'tokens_collector';
  mode?: 'single' | 'common' | 'cross';
  metadata?: Record<string, any>;
}

interface ListAddressesRequest {
  page?: number;
  limit?: number;
  network?: string;
  coin?: string;
  type?: string;
  status?: string;
}

// Withdrawal Requests
interface CreateWithdrawalRequest {
  network: string;
  coin: string;
  amount: string;
  to_address: string;
  from_address_id?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

// API Response Wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## SDK Usage

### Address Management

```typescript
import { Gateway, CreateAddressRequest, Address } from '@gateway/crypto-payment-sdk';

class AddressService {
  constructor(private gateway: Gateway) {}

  async createPaymentAddress(
    customerId: string,
    orderId: string,
    network: string = 'ethereum',
    coin: string = 'usdt'
  ): Promise<Address> {
    const request: CreateAddressRequest = {
      network,
      coin,
      type: 'user',
      metadata: {
        customer_id: customerId,
        order_id: orderId,
        created_by: 'payment_service'
      }
    };

    const response = await this.gateway.addresses.create(request);
    return response.data;
  }

  async getAddressBalance(addressId: string): Promise<Address['balance']> {
    const response = await this.gateway.addresses.get(addressId);
    return response.data.balance;
  }

  async listCustomerAddresses(customerId: string): Promise<Address[]> {
    const response = await this.gateway.addresses.list({
      limit: 100,
      metadata: { customer_id: customerId }
    });
    return response.data.data;
  }
}
```

### Transaction Monitoring

```typescript
import { Transaction, ListTransactionsRequest } from '@gateway/crypto-payment-sdk';

class TransactionService {
  constructor(private gateway: Gateway) {}

  async getTransactionHistory(
    addressId: string,
    options: {
      status?: Transaction['status'];
      fromDate?: Date;
      toDate?: Date;
      limit?: number;
    } = {}
  ): Promise<Transaction[]> {
    const request: ListTransactionsRequest = {
      address_id: addressId,
      status: options.status,
      from_date: options.fromDate?.toISOString(),
      to_date: options.toDate?.toISOString(),
      limit: options.limit || 50
    };

    const response = await this.gateway.transactions.list(request);
    return response.data.data;
  }

  async waitForConfirmation(
    transactionId: string,
    requiredConfirmations: number = 12,
    timeoutMs: number = 600000 // 10 minutes
  ): Promise<Transaction> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const response = await this.gateway.transactions.get(transactionId);
      const transaction = response.data;
      
      if (transaction.confirmations >= requiredConfirmations) {
        return transaction;
      }
      
      // Wait 30 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
    
    throw new Error(`Transaction ${transactionId} not confirmed within timeout`);
  }
}
```

### Withdrawal Management

```typescript
import { Withdrawal, CreateWithdrawalRequest } from '@gateway/crypto-payment-sdk';

class WithdrawalService {
  constructor(private gateway: Gateway) {}

  async createWithdrawal(
    amount: string,
    toAddress: string,
    options: {
      network?: string;
      coin?: string;
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      metadata?: Record<string, any>;
    } = {}
  ): Promise<Withdrawal> {
    const request: CreateWithdrawalRequest = {
      network: options.network || 'ethereum',
      coin: options.coin || 'usdt',
      amount,
      to_address: toAddress,
      priority: options.priority || 'normal',
      metadata: options.metadata
    };

    const response = await this.gateway.withdrawals.create(request);
    return response.data;
  }

  async batchWithdrawal(
    withdrawals: Array<{
      amount: string;
      to_address: string;
      metadata?: Record<string, any>;
    }>,
    options: {
      network?: string;
      coin?: string;
      priority?: 'low' | 'normal' | 'high' | 'urgent';
    } = {}
  ): Promise<{ batch_id: string; withdrawals: Withdrawal[] }> {
    const request = {
      network: options.network || 'ethereum',
      coin: options.coin || 'usdt',
      priority: options.priority || 'normal',
      outputs: withdrawals
    };

    const response = await this.gateway.withdrawals.batch(request);
    return response.data;
  }

  async cancelWithdrawal(withdrawalId: string): Promise<void> {
    await this.gateway.withdrawals.cancel(withdrawalId);
  }
}
```

## Error Handling

### Custom Error Types

```typescript
// Custom error classes
export class GatewayError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GatewayError';
  }
}

export class InsufficientBalanceError extends GatewayError {
  constructor(requested: string, available: string, coin: string) {
    super(
      'INSUFFICIENT_BALANCE',
      `Insufficient balance: requested ${requested} ${coin}, available ${available} ${coin}`,
      { requested, available, coin }
    );
  }
}

export class InvalidAddressError extends GatewayError {
  constructor(address: string, network: string) {
    super(
      'INVALID_ADDRESS',
      `Invalid address ${address} for network ${network}`,
      { address, network }
    );
  }
}

export class RateLimitError extends GatewayError {
  constructor(limit: number, resetAt: string) {
    super(
      'RATE_LIMIT_EXCEEDED',
      `Rate limit exceeded: ${limit} requests per minute`,
      { limit, resetAt }
    );
  }
}
```

### Error Handling Service

```typescript
class ErrorHandler {
  static handle(error: any): never {
    if (error.response?.data?.error) {
      const { code, message, details } = error.response.data.error;
      
      switch (code) {
        case 'INSUFFICIENT_BALANCE':
          throw new InsufficientBalanceError(
            details.requested,
            details.available,
            details.coin
          );
        case 'INVALID_ADDRESS':
          throw new InvalidAddressError(details.address, details.network);
        case 'RATE_LIMIT_EXCEEDED':
          throw new RateLimitError(details.limit, details.reset_at);
        default:
          throw new GatewayError(code, message, details);
      }
    }
    
    throw error;
  }
}

// Usage with try-catch
try {
  const withdrawal = await withdrawalService.createWithdrawal('1000', '0x123...');
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    console.log(`Not enough funds: ${error.details.available} available`);
  } else if (error instanceof InvalidAddressError) {
    console.log(`Invalid address: ${error.details.address}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Webhook Integration

### Webhook Types

```typescript
// Webhook event types
interface WebhookEvent<T = any> {
  event: string;
  data: T;
  timestamp: string;
}

interface TransactionWebhook extends WebhookEvent<Transaction> {
  event: 'transaction.detected' | 'transaction.confirmed' | 'transaction.failed';
}

interface WithdrawalWebhook extends WebhookEvent<Withdrawal> {
  event: 'withdrawal.created' | 'withdrawal.confirmed' | 'withdrawal.failed';
}

interface AddressWebhook extends WebhookEvent<Address> {
  event: 'address.created' | 'address.balance_updated';
}

type GatewayWebhook = TransactionWebhook | WithdrawalWebhook | AddressWebhook;
```

### Webhook Handler

```typescript
import express from 'express';
import crypto from 'crypto';

class WebhookHandler {
  constructor(private webhookSecret: string) {}

  verifySignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }

  createHandler() {
    return (req: express.Request, res: express.Response) => {
      const signature = req.headers['x-gateway-signature'] as string;
      const payload = JSON.stringify(req.body);

      if (!this.verifySignature(payload, signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const webhook: GatewayWebhook = req.body;
      
      try {
        this.processWebhook(webhook);
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Processing failed' });
      }
    };
  }

  private processWebhook(webhook: GatewayWebhook): void {
    switch (webhook.event) {
      case 'transaction.confirmed':
        this.handleTransactionConfirmed(webhook as TransactionWebhook);
        break;
      case 'withdrawal.confirmed':
        this.handleWithdrawalConfirmed(webhook as WithdrawalWebhook);
        break;
      case 'address.balance_updated':
        this.handleBalanceUpdated(webhook as AddressWebhook);
        break;
      default:
        console.log(`Unhandled webhook event: ${webhook.event}`);
    }
  }

  private handleTransactionConfirmed(webhook: TransactionWebhook): void {
    const transaction = webhook.data;
    console.log(`Transaction confirmed: ${transaction.hash}`);
    
    // Process the confirmed transaction
    // Update order status, send notifications, etc.
  }

  private handleWithdrawalConfirmed(webhook: WithdrawalWebhook): void {
    const withdrawal = webhook.data;
    console.log(`Withdrawal confirmed: ${withdrawal.id}`);
    
    // Update withdrawal status in your system
  }

  private handleBalanceUpdated(webhook: AddressWebhook): void {
    const address = webhook.data;
    console.log(`Balance updated for address: ${address.address}`);
    
    // Update cached balance information
  }
}
```

## Advanced Features

### Retry Logic with Exponential Backoff

```typescript
class RetryableGateway {
  constructor(private gateway: Gateway) {}

  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  async createAddressWithRetry(request: CreateAddressRequest): Promise<Address> {
    return this.withRetry(() => this.gateway.addresses.create(request));
  }
}
```

### Connection Pool and Rate Limiting

```typescript
import pLimit from 'p-limit';

class RateLimitedGateway {
  private limit = pLimit(10); // Max 10 concurrent requests
  
  constructor(private gateway: Gateway) {}

  async createAddress(request: CreateAddressRequest): Promise<Address> {
    return this.limit(() => this.gateway.addresses.create(request));
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.limit(() => this.gateway.transactions.get(id));
  }
}
```

### Caching Layer

```typescript
import NodeCache from 'node-cache';

class CachedGateway {
  private cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL
  
  constructor(private gateway: Gateway) {}

  async getAddress(id: string): Promise<Address> {
    const cacheKey = `address:${id}`;
    const cached = this.cache.get<Address>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const response = await this.gateway.addresses.get(id);
    const address = response.data;
    
    this.cache.set(cacheKey, address);
    return address;
  }

  async getNetworkStatus(network: string): Promise<any> {
    const cacheKey = `network:${network}:status`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const response = await this.gateway.networks.getStatus(network);
    const status = response.data;
    
    // Cache for shorter time due to dynamic nature
    this.cache.set(cacheKey, status, 60); // 1 minute
    return status;
  }
}
```

## Testing

### Mock Gateway for Testing

```typescript
// __mocks__/@gateway/crypto-payment-sdk.ts
export class MockGateway {
  addresses = {
    create: jest.fn().mockResolvedValue({
      data: {
        id: 'addr_test_123',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
        network: 'ethereum',
        coin: 'usdt',
        type: 'user',
        status: 'active'
      }
    }),
    get: jest.fn(),
    list: jest.fn()
  };

  transactions = {
    get: jest.fn(),
    list: jest.fn()
  };

  withdrawals = {
    create: jest.fn(),
    get: jest.fn(),
    cancel: jest.fn()
  };
}
```

### Unit Tests

```typescript
import { AddressService } from '../services/AddressService';
import { MockGateway } from '@gateway/crypto-payment-sdk';

jest.mock('@gateway/crypto-payment-sdk');

describe('AddressService', () => {
  let addressService: AddressService;
  let mockGateway: MockGateway;

  beforeEach(() => {
    mockGateway = new MockGateway();
    addressService = new AddressService(mockGateway as any);
  });

  it('should create payment address', async () => {
    const address = await addressService.createPaymentAddress(
      'customer_123',
      'order_456'
    );

    expect(mockGateway.addresses.create).toHaveBeenCalledWith({
      network: 'ethereum',
      coin: 'usdt',
      type: 'user',
      metadata: {
        customer_id: 'customer_123',
        order_id: 'order_456',
        created_by: 'payment_service'
      }
    });

    expect(address.id).toBe('addr_test_123');
  });
});
```

## Best Practices

### 1. Type Safety
- Always use TypeScript interfaces for API requests/responses
- Enable strict mode in TypeScript configuration
- Use generic types for reusable components

### 2. Error Handling
- Create custom error classes for different error types
- Implement proper error boundaries
- Log errors with sufficient context

### 3. Performance
- Use connection pooling for high-throughput applications
- Implement caching for frequently accessed data
- Use rate limiting to avoid API limits

### 4. Security
- Store API keys in environment variables
- Validate webhook signatures
- Use HTTPS for all communications

This TypeScript SDK documentation provides comprehensive guidance for type-safe integration with the Crypto Payment Gateway. 