# Networks API

The Networks API provides access to supported blockchain networks, their configurations, and real-time status information.

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/networks` | List all supported networks |
| GET | `/api/v1/networks/{network}` | Get specific network details |
| GET | `/api/v1/networks/{network}/status` | Get network status |
| GET | `/api/v1/networks/{network}/coins` | List network coins |
| GET | `/api/v1/networks/{network}/fees` | Get current fee estimates |

## List Networks

Get a list of all supported blockchain networks.

```http
GET /api/v1/networks
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `active` | boolean | No | Filter by active status |
| `type` | string | No | Filter by network type (`evm`, `utxo`, `account`) |

### Response

```json
{
  "success": true,
  "data": [
    {
      "slug": "ethereum",
      "name": "Ethereum",
      "type": "evm",
      "chain_id": 1,
      "native_coin": {
        "slug": "eth",
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
      },
      "confirmation_blocks": 12,
      "block_time": 12,
      "features": ["smart_contracts", "tokens", "eip1559"],
      "explorer_url": "https://etherscan.io",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "slug": "bitcoin",
      "name": "Bitcoin",
      "type": "utxo",
      "chain_id": null,
      "native_coin": {
        "slug": "btc",
        "name": "Bitcoin",
        "symbol": "BTC",
        "decimals": 8
      },
      "confirmation_blocks": 6,
      "block_time": 600,
      "features": ["segwit", "multisig"],
      "explorer_url": "https://blockstream.info",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "pages": 1
  }
}
```

## Get Network Details

Retrieve detailed information about a specific network.

```http
GET /api/v1/networks/{network}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network slug (e.g., `ethereum`, `bitcoin`) |

### Response

```json
{
  "success": true,
  "data": {
    "slug": "ethereum",
    "name": "Ethereum",
    "type": "evm",
    "chain_id": 1,
    "native_coin": {
      "slug": "eth",
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "contract_address": null
    },
    "confirmation_blocks": 12,
    "block_time": 12,
    "features": ["smart_contracts", "tokens", "eip1559"],
    "explorer_url": "https://etherscan.io",
    "rpc_endpoints": [
      {
        "url": "https://mainnet.infura.io/v3/...",
        "type": "http",
        "priority": 1
      },
      {
        "url": "wss://mainnet.infura.io/ws/v3/...",
        "type": "websocket",
        "priority": 2
      }
    ],
    "address_format": {
      "type": "ethereum",
      "prefix": "0x",
      "length": 42,
      "checksum": true
    },
    "fee_structure": {
      "type": "gas",
      "unit": "gwei",
      "base_fee_enabled": true,
      "priority_fee_enabled": true
    },
    "limits": {
      "min_confirmation_blocks": 1,
      "max_confirmation_blocks": 100,
      "min_withdrawal_amount": "0.001",
      "max_withdrawal_amount": "1000"
    },
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

## Get Network Status

Get real-time status information for a specific network.

```http
GET /api/v1/networks/{network}/status
```

### Response

```json
{
  "success": true,
  "data": {
    "network": "ethereum",
    "status": "healthy",
    "current_block": 18500000,
    "synced_block": 18500000,
    "block_lag": 0,
    "last_block_time": "2024-01-15T12:30:00Z",
    "rpc_status": {
      "primary": "healthy",
      "secondary": "healthy",
      "websocket": "healthy"
    },
    "fee_estimates": {
      "slow": {
        "gas_price": "20000000000",
        "base_fee": "15000000000",
        "priority_fee": "2000000000",
        "confirmation_time": 300
      },
      "standard": {
        "gas_price": "25000000000",
        "base_fee": "15000000000",
        "priority_fee": "5000000000",
        "confirmation_time": 180
      },
      "fast": {
        "gas_price": "35000000000",
        "base_fee": "15000000000",
        "priority_fee": "15000000000",
        "confirmation_time": 60
      }
    },
    "mempool_size": 150000,
    "pending_transactions": 25,
    "health_score": 98,
    "last_updated": "2024-01-15T12:30:00Z"
  }
}
```

## List Network Coins

Get all coins and tokens supported on a specific network.

```http
GET /api/v1/networks/{network}/coins
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Filter by coin type (`native`, `token`) |
| `active` | boolean | No | Filter by active status |
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20, max: 100) |

### Response

```json
{
  "success": true,
  "data": [
    {
      "slug": "eth",
      "name": "Ether",
      "symbol": "ETH",
      "type": "native",
      "decimals": 18,
      "contract_address": null,
      "network": "ethereum",
      "status": "active",
      "icon_url": "https://assets.gateway.com/coins/eth.png",
      "market_data": {
        "price_usd": "2500.00",
        "market_cap": "300000000000",
        "volume_24h": "15000000000"
      },
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "slug": "usdt",
      "name": "Tether USD",
      "symbol": "USDT",
      "type": "token",
      "decimals": 6,
      "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "network": "ethereum",
      "status": "active",
      "icon_url": "https://assets.gateway.com/coins/usdt.png",
      "market_data": {
        "price_usd": "1.00",
        "market_cap": "95000000000",
        "volume_24h": "45000000000"
      },
      "created_at": "2024-01-01T00:00:00Z"
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

## Get Fee Estimates

Get current fee estimates for a specific network.

```http
GET /api/v1/networks/{network}/fees
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transaction_type` | string | No | Type of transaction (`transfer`, `token_transfer`, `contract`) |
| `priority` | string | No | Fee priority (`slow`, `standard`, `fast`) |

### Response

#### Ethereum-based Networks

```json
{
  "success": true,
  "data": {
    "network": "ethereum",
    "fee_type": "gas",
    "estimates": {
      "slow": {
        "gas_price": "20000000000",
        "base_fee": "15000000000",
        "priority_fee": "2000000000",
        "max_fee": "32000000000",
        "confirmation_time": 300,
        "probability": 85
      },
      "standard": {
        "gas_price": "25000000000",
        "base_fee": "15000000000",
        "priority_fee": "5000000000",
        "max_fee": "35000000000",
        "confirmation_time": 180,
        "probability": 95
      },
      "fast": {
        "gas_price": "35000000000",
        "base_fee": "15000000000",
        "priority_fee": "15000000000",
        "max_fee": "45000000000",
        "confirmation_time": 60,
        "probability": 99
      }
    },
    "gas_limits": {
      "eth_transfer": 21000,
      "token_transfer": 65000,
      "contract_interaction": 150000
    },
    "last_updated": "2024-01-15T12:30:00Z"
  }
}
```

#### Bitcoin-based Networks

```json
{
  "success": true,
  "data": {
    "network": "bitcoin",
    "fee_type": "sat_per_byte",
    "estimates": {
      "slow": {
        "fee_rate": 10,
        "confirmation_time": 3600,
        "probability": 85
      },
      "standard": {
        "fee_rate": 25,
        "confirmation_time": 1800,
        "probability": 95
      },
      "fast": {
        "fee_rate": 50,
        "confirmation_time": 600,
        "probability": 99
      }
    },
    "transaction_sizes": {
      "p2pkh": 226,
      "p2sh": 298,
      "p2wpkh": 141,
      "p2wsh": 169
    },
    "last_updated": "2024-01-15T12:30:00Z"
  }
}
```

## Network Types

### EVM Networks
Ethereum Virtual Machine compatible networks:
- **Features**: Smart contracts, tokens, gas-based fees
- **Examples**: Ethereum, BSC, Polygon, Arbitrum
- **Address Format**: 0x prefixed, 42 characters
- **Fee Structure**: Gas price × Gas limit

### UTXO Networks
Unspent Transaction Output based networks:
- **Features**: Multi-input/output, script-based
- **Examples**: Bitcoin, Litecoin
- **Address Format**: Various (P2PKH, P2SH, Bech32)
- **Fee Structure**: Satoshis per byte

### Account-based Networks
Account model networks:
- **Features**: Account balances, energy systems
- **Examples**: Tron
- **Address Format**: Base58 encoded
- **Fee Structure**: Energy/bandwidth or TRX

## Error Responses

### Network Not Found

```json
{
  "error": {
    "code": "NETWORK_NOT_FOUND",
    "message": "Network not found",
    "details": {
      "network": "invalid_network"
    }
  }
}
```

### Network Unavailable

```json
{
  "error": {
    "code": "NETWORK_UNAVAILABLE",
    "message": "Network is currently unavailable",
    "details": {
      "network": "ethereum",
      "status": "maintenance",
      "estimated_recovery": "2024-01-15T14:00:00Z"
    }
  }
}
```

### Invalid Parameters

```json
{
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid request parameters",
    "details": {
      "invalid_fields": ["type", "limit"]
    }
  }
}
```

## Rate Limits

Network API endpoints have the following rate limits:

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| List Networks | 100/min | 1 minute |
| Network Details | 200/min | 1 minute |
| Network Status | 500/min | 1 minute |
| Network Coins | 100/min | 1 minute |
| Fee Estimates | 1000/min | 1 minute |

## Webhooks

### Network Status Changes

Subscribe to network status change notifications:

```json
{
  "event": "network.status_changed",
  "data": {
    "network": "ethereum",
    "previous_status": "healthy",
    "current_status": "degraded",
    "block_lag": 5,
    "health_score": 75,
    "timestamp": "2024-01-15T12:30:00Z"
  }
}
```

### Fee Updates

Get notified when fee estimates change significantly:

```json
{
  "event": "network.fees_updated",
  "data": {
    "network": "ethereum",
    "fee_change": {
      "standard": {
        "previous": "25000000000",
        "current": "35000000000",
        "change_percent": 40
      }
    },
    "timestamp": "2024-01-15T12:30:00Z"
  }
}
```

## Best Practices

### Caching
- Cache network configurations for 1 hour
- Cache fee estimates for 1 minute
- Cache network status for 30 seconds

### Error Handling
- Implement retry logic for network unavailable errors
- Fall back to cached data when possible
- Monitor network status before critical operations

### Fee Management
- Update fee estimates regularly
- Use appropriate priority levels
- Consider network congestion

This comprehensive Networks API documentation provides all the information needed to interact with supported blockchain networks effectively. 