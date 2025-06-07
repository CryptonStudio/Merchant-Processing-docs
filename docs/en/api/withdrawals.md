# Withdrawals API

The Withdrawals API enables secure transfer of cryptocurrency from gateway-controlled addresses to external destinations.

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/withdrawals` | Create a new withdrawal |
| GET | `/api/v1/withdrawals` | List withdrawals |
| GET | `/api/v1/withdrawals/{id}` | Get withdrawal details |
| DELETE | `/api/v1/withdrawals/{id}` | Cancel withdrawal |
| POST | `/api/v1/withdrawals/batch` | Create batch withdrawal |
| POST | `/api/v1/withdrawals/{id}/approve` | Approve withdrawal |

## Create Withdrawal

Create a new withdrawal request to send cryptocurrency to an external address.

```http
POST /api/v1/withdrawals
```

### Request Body

```json
{
  "network": "ethereum",
  "coin": "usdt",
  "amount": "100.50",
  "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "from_address_id": "addr_123456",
  "priority": "normal",
  "metadata": {
    "customer_id": "cust_789",
    "order_id": "order_456",
    "description": "Customer withdrawal request"
  }
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network slug (e.g., `ethereum`, `bitcoin`) |
| `coin` | string | Yes | Coin slug (e.g., `usdt`, `btc`) |
| `amount` | string | Yes | Amount to withdraw (decimal string) |
| `to_address` | string | Yes | Destination address |
| `from_address_id` | string | No | Source address ID (auto-selected if not provided) |
| `priority` | string | No | Fee priority (`low`, `normal`, `high`, `urgent`) |
| `metadata` | object | No | Additional metadata |

### Response

```json
{
  "success": true,
  "data": {
    "id": "withdrawal_123456789",
    "status": "pending",
    "network": "ethereum",
    "coin": "usdt",
    "amount": "100.50",
    "fee": "0.002",
    "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "from_address": "0x456...",
    "priority": "normal",
    "estimated_confirmation_time": "2024-01-15T12:35:00Z",
    "metadata": {
      "customer_id": "cust_789",
      "order_id": "order_456",
      "description": "Customer withdrawal request"
    },
    "created_at": "2024-01-15T12:30:00Z"
  }
}
```

## List Withdrawals

Retrieve a list of withdrawals with optional filtering.

```http
GET /api/v1/withdrawals
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20, max: 100) |
| `status` | string | No | Filter by status |
| `network` | string | No | Filter by network |
| `coin` | string | No | Filter by coin |
| `from_date` | string | No | Start date (ISO 8601) |
| `to_date` | string | No | End date (ISO 8601) |
| `address_id` | string | No | Filter by source address |
| `customer_id` | string | No | Filter by customer ID (from metadata) |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "withdrawal_123456789",
      "status": "confirmed",
      "network": "ethereum",
      "coin": "usdt",
      "amount": "100.50",
      "fee": "0.002",
      "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      "from_address": "0x456...",
      "transaction_hash": "0xabc123...",
      "confirmations": 15,
      "block_number": 18500000,
      "created_at": "2024-01-15T12:30:00Z",
      "confirmed_at": "2024-01-15T12:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Get Withdrawal Details

Retrieve detailed information about a specific withdrawal.

```http
GET /api/v1/withdrawals/{id}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Withdrawal ID |

### Response

```json
{
  "success": true,
  "data": {
    "id": "withdrawal_123456789",
    "status": "confirmed",
    "network": "ethereum",
    "coin": "usdt",
    "amount": "100.50",
    "fee": "0.002",
    "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "from_address": "0x456...",
    "from_address_id": "addr_123456",
    "priority": "normal",
    "transaction_hash": "0xabc123...",
    "confirmations": 15,
    "block_number": 18500000,
    "block_hash": "0xblock123...",
    "gas_used": "21000",
    "gas_price": "25000000000",
    "nonce": 123,
    "status_history": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T12:30:00Z"
      },
      {
        "status": "processing",
        "timestamp": "2024-01-15T12:30:30Z"
      },
      {
        "status": "broadcasting",
        "timestamp": "2024-01-15T12:31:00Z"
      },
      {
        "status": "confirming",
        "timestamp": "2024-01-15T12:31:30Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-01-15T12:35:00Z"
      }
    ],
    "metadata": {
      "customer_id": "cust_789",
      "order_id": "order_456",
      "description": "Customer withdrawal request"
    },
    "created_at": "2024-01-15T12:30:00Z",
    "confirmed_at": "2024-01-15T12:35:00Z"
  }
}
```

## Cancel Withdrawal

Cancel a pending withdrawal before it's processed.

```http
DELETE /api/v1/withdrawals/{id}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Withdrawal ID |

### Response

```json
{
  "success": true,
  "data": {
    "id": "withdrawal_123456789",
    "status": "cancelled",
    "cancelled_at": "2024-01-15T12:32:00Z"
  }
}
```

## Batch Withdrawal

Create multiple withdrawals in a single transaction to optimize fees.

```http
POST /api/v1/withdrawals/batch
```

### Request Body

```json
{
  "network": "ethereum",
  "coin": "usdt",
  "from_address_id": "addr_123456",
  "priority": "normal",
  "outputs": [
    {
      "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      "amount": "50.00",
      "metadata": {
        "customer_id": "cust_789"
      }
    },
    {
      "to_address": "0x123d35Cc6634C0532925a3b8D4C9db96590c6C87",
      "amount": "75.25",
      "metadata": {
        "customer_id": "cust_456"
      }
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "data": {
    "batch_id": "batch_987654321",
    "status": "pending",
    "network": "ethereum",
    "coin": "usdt",
    "total_amount": "125.25",
    "total_fee": "0.003",
    "from_address": "0x456...",
    "outputs_count": 2,
    "withdrawals": [
      {
        "id": "withdrawal_111111111",
        "amount": "50.00",
        "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
      },
      {
        "id": "withdrawal_222222222",
        "amount": "75.25",
        "to_address": "0x123d35Cc6634C0532925a3b8D4C9db96590c6C87"
      }
    ],
    "created_at": "2024-01-15T12:30:00Z"
  }
}
```

## Approve Withdrawal

Approve a withdrawal that requires manual approval (e.g., large amounts, multi-signature).

```http
POST /api/v1/withdrawals/{id}/approve
```

### Request Body

```json
{
  "signature": "0x1234567890abcdef...",
  "signer_id": "signer_123",
  "comment": "Approved by finance team"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "withdrawal_123456789",
    "status": "approved",
    "approvals": [
      {
        "signer_id": "signer_123",
        "signature": "0x1234567890abcdef...",
        "comment": "Approved by finance team",
        "approved_at": "2024-01-15T12:32:00Z"
      }
    ],
    "required_approvals": 2,
    "received_approvals": 1
  }
}
```

## Withdrawal Status

### Status Flow

| Status | Description |
|--------|-------------|
| `pending` | Withdrawal created, awaiting processing |
| `processing` | Validating and preparing transaction |
| `broadcasting` | Submitting transaction to network |
| `confirming` | Transaction broadcast, awaiting confirmations |
| `confirmed` | Transaction confirmed on blockchain |
| `failed` | Transaction failed or rejected |
| `cancelled` | Withdrawal cancelled before processing |
| `requires_approval` | Waiting for manual approval |

## Error Responses

### Insufficient Balance

```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance for withdrawal",
    "details": {
      "requested": "100.50",
      "available": "95.25",
      "coin": "usdt",
      "address_id": "addr_123456"
    }
  }
}
```

### Invalid Address

```json
{
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "Invalid destination address",
    "details": {
      "address": "invalid_address",
      "network": "ethereum"
    }
  }
}
```

### Daily Limit Exceeded

```json
{
  "error": {
    "code": "DAILY_LIMIT_EXCEEDED",
    "message": "Daily withdrawal limit exceeded",
    "details": {
      "limit": "5000.00",
      "used": "4500.00",
      "requested": "1000.00",
      "available": "500.00",
      "reset_at": "2024-01-16T00:00:00Z"
    }
  }
}
```

### Address Not Whitelisted

```json
{
  "error": {
    "code": "ADDRESS_NOT_WHITELISTED",
    "message": "Destination address is not whitelisted",
    "details": {
      "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      "network": "ethereum"
    }
  }
}
```

### Withdrawal Not Found

```json
{
  "error": {
    "code": "WITHDRAWAL_NOT_FOUND",
    "message": "Withdrawal not found",
    "details": {
      "withdrawal_id": "withdrawal_invalid"
    }
  }
}
```

### Cannot Cancel

```json
{
  "error": {
    "code": "CANNOT_CANCEL_WITHDRAWAL",
    "message": "Withdrawal cannot be cancelled in current status",
    "details": {
      "withdrawal_id": "withdrawal_123456789",
      "current_status": "broadcasting"
    }
  }
}
```

## Fee Calculation

### Dynamic Fees

Fees are calculated based on network conditions and priority:

```json
{
  "fee_calculation": {
    "network": "ethereum",
    "coin": "usdt",
    "priority": "normal",
    "gas_limit": 65000,
    "gas_price": "25000000000",
    "total_fee": "0.001625",
    "fee_in_usd": "4.06"
  }
}
```

### Fee Estimates

Get fee estimates before creating withdrawal:

```http
GET /api/v1/withdrawals/estimate-fee
```

**Parameters:**
- `network`: Network slug
- `coin`: Coin slug
- `amount`: Withdrawal amount
- `to_address`: Destination address
- `priority`: Fee priority

**Response:**
```json
{
  "success": true,
  "data": {
    "estimates": {
      "low": {
        "fee": "0.001",
        "confirmation_time": 1800,
        "probability": 85
      },
      "normal": {
        "fee": "0.002",
        "confirmation_time": 600,
        "probability": 95
      },
      "high": {
        "fee": "0.004",
        "confirmation_time": 300,
        "probability": 99
      }
    }
  }
}
```

## Rate Limits

Withdrawal API endpoints have the following rate limits:

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| Create Withdrawal | 10/min | 1 minute |
| List Withdrawals | 100/min | 1 minute |
| Get Withdrawal | 200/min | 1 minute |
| Cancel Withdrawal | 20/min | 1 minute |
| Batch Withdrawal | 5/min | 1 minute |

## Webhooks

### Withdrawal Status Updates

```json
{
  "event": "withdrawal.status_changed",
  "data": {
    "id": "withdrawal_123456789",
    "status": "confirmed",
    "previous_status": "confirming",
    "transaction_hash": "0xabc123...",
    "confirmations": 12,
    "block_number": 18500000,
    "timestamp": "2024-01-15T12:35:00Z"
  }
}
```

### Withdrawal Failed

```json
{
  "event": "withdrawal.failed",
  "data": {
    "id": "withdrawal_123456789",
    "status": "failed",
    "error_code": "INSUFFICIENT_GAS",
    "error_message": "Transaction failed due to insufficient gas",
    "timestamp": "2024-01-15T12:35:00Z"
  }
}
```

## Security Features

### Address Whitelisting

Only whitelisted addresses can receive withdrawals:

```http
POST /api/v1/whitelist/addresses
```

```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "network": "ethereum",
  "label": "Customer Wallet",
  "daily_limit": "1000.00",
  "monthly_limit": "10000.00"
}
```

### Multi-Signature Approval

Large withdrawals require multiple approvals:

```json
{
  "multisig_config": {
    "threshold_amount": "1000.00",
    "required_signatures": 2,
    "signers": ["signer_1", "signer_2", "signer_3"]
  }
}
```

## Best Practices

### Error Handling
- Always check withdrawal status before assuming success
- Implement retry logic for network errors
- Handle rate limiting with exponential backoff

### Fee Management
- Use appropriate priority levels based on urgency
- Consider batch withdrawals for multiple recipients
- Monitor network congestion for optimal timing

### Security
- Validate all addresses before withdrawal
- Implement proper access controls
- Monitor for unusual withdrawal patterns
- Use webhooks for real-time status updates

This comprehensive Withdrawals API documentation provides all the information needed to implement secure and efficient cryptocurrency withdrawals. 