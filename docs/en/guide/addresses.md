# Addresses & Wallets

The Crypto Payment Gateway uses different types of addresses and wallets to manage cryptocurrency flows securely and efficiently.

## Address Types

### User Addresses (Default)
User addresses are the primary deposit addresses generated for receiving payments from customers.

**Characteristics:**
- Gateway controls the private keys
- Used for receiving deposits from external users
- Can receive both native coins and tokens
- Automatically monitored for incoming transactions

**Use Cases:**
- Customer deposit addresses
- Payment collection points
- Invoice-specific addresses

### Hot Wallets (`hot` type)
Hot wallets serve as the source for outgoing payments and withdrawals to users.

**Characteristics:**
- Gateway controls the private keys
- Used for sending payments to users
- Must maintain sufficient native coin balance for gas fees
- Actively used for withdrawal operations

**Requirements:**
- Adequate native coin balance for transaction fees
- Regular monitoring and replenishment
- Enhanced security measures

### Cold Wallets (`cold` type)
Cold wallets are secure storage destinations for long-term fund storage.

**Characteristics:**
- Gateway does NOT control the private keys
- Used for secure, long-term storage
- Funds are transferred here from user addresses
- Highest security level

**Security Features:**
- Offline key storage
- Multi-signature support
- Hardware security modules (HSM)
- Air-gapped systems

### Token Collectors (`tokens_collector` type)
Token collectors are intermediate wallets used for gathering tokens before transferring to cold storage.

**Characteristics:**
- Gateway controls the private keys
- Collects tokens from user addresses
- Requires native coin balance for gas fees
- Automated collection processes

**Process Flow:**
1. Collect tokens from user addresses
2. Aggregate collected tokens
3. Transfer to cold wallets
4. Maintain gas balance for operations

## Address Modes

The gateway supports three different address allocation modes controlled by the `ADDRESSES_MODE` environment variable.

### Single Mode (`ADDRESSES_MODE=single`)

In single mode, each address is created for a specific coin on a specific network.

**Features:**
- One address per coin per network
- Manual address creation required
- Granular control over address allocation
- Balance records created only for specified coin

**When to Use:**
- Need precise control over address allocation
- Different addresses for different cryptocurrencies
- Compliance requirements for address segregation

**Example:**
```bash
# Create Bitcoin address
POST /api/v1/addresses
{
  "network": "bitcoin",
  "coin": "btc"
}

# Create Ethereum USDT address  
POST /api/v1/addresses
{
  "network": "ethereum", 
  "coin": "usdt"
}
```

### Common Mode (`ADDRESSES_MODE=common`)

In common mode, one address per network handles all coins of that network.

**Features:**
- One address per network (all coins)
- Automatic balance creation for all network coins
- Simplified address management
- New coins automatically get balance records

**When to Use:**
- Simplified address management
- Support for multiple tokens on same network
- Reduced address proliferation

**Example:**
```bash
# Create Ethereum address (supports ETH, USDT, USDC, etc.)
POST /api/v1/addresses
{
  "network": "ethereum"
}
```

### Cross Mode (`ADDRESSES_MODE=cross`)

Cross mode creates addresses that work across compatible networks.

**Features:**
- One address for compatible networks
- Maximum address reuse
- Optimal for EVM-compatible chains
- Automatic cross-network balance creation

**When to Use:**
- EVM-compatible networks (Ethereum, BSC, Polygon, etc.)
- Maximum address efficiency
- Simplified user experience

**Compatible Networks:**
- Ethereum
- Binance Smart Chain
- Polygon
- Arbitrum
- Fantom

## Address Generation

### API Endpoint
```http
POST /api/v1/addresses
Content-Type: application/json

{
  "network": "ethereum",
  "coin": "usdt",        // Required in single mode
  "type": "default",     // Optional: default, hot, cold, tokens_collector
  "label": "Customer 1", // Optional: human-readable label
  "metadata": {}         // Optional: additional metadata
}
```

### Response
```json
{
  "id": "addr_123456789",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
  "network": "ethereum",
  "coin": "usdt",
  "type": "default",
  "label": "Customer 1",
  "balances": [
    {
      "coin": "usdt",
      "balance": "0",
      "confirmed": "0",
      "unconfirmed": "0"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Address Management

### Retrieving Addresses
```http
GET /api/v1/addresses
GET /api/v1/addresses/{addressId}
GET /api/v1/addresses?network=ethereum
GET /api/v1/addresses?type=hot
```

### Updating Address Labels
```http
PUT /api/v1/addresses/{addressId}
Content-Type: application/json

{
  "label": "Updated Label",
  "metadata": {
    "customer_id": "cust_123",
    "purpose": "payment"
  }
}
```

### Address Validation
```http
POST /api/v1/addresses/validate
Content-Type: application/json

{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
  "network": "ethereum"
}
```

## Balance Management

### Balance Structure
Each address maintains balances for supported coins:

```json
{
  "coin": "usdt",
  "balance": "1000.50",      // Total balance
  "confirmed": "950.25",     // Confirmed balance
  "unconfirmed": "50.25",    // Unconfirmed balance
  "frozen": "0",             // Frozen/locked balance
  "available": "950.25"      // Available for withdrawal
}
```

### Balance Updates
Balances are automatically updated when:
- Incoming transactions are detected
- Outgoing transactions are processed
- Tokens are collected or transferred
- Manual adjustments are made

### Balance Queries
```http
GET /api/v1/addresses/{addressId}/balances
GET /api/v1/addresses/{addressId}/balances/{coin}
```

## Security Considerations

### Private Key Management
- **User Addresses**: Keys stored in encrypted database
- **Hot Wallets**: Keys in secure key management system
- **Cold Wallets**: Keys stored offline or in HSM
- **Token Collectors**: Keys in encrypted storage with access controls

### Access Controls
- Role-based access to address operations
- API key authentication for address creation
- IP whitelisting for sensitive operations
- Audit logging for all address activities

### Monitoring
- Real-time balance monitoring
- Suspicious activity detection
- Large transaction alerts
- Automated security responses

## Best Practices

### Address Creation
1. Use appropriate address mode for your use case
2. Implement proper labeling and metadata
3. Monitor address generation rates
4. Validate addresses before use

### Balance Management
1. Regular balance reconciliation
2. Monitor for unexpected changes
3. Implement balance thresholds and alerts
4. Maintain adequate gas balances

### Security
1. Regular key rotation for hot wallets
2. Multi-signature for high-value operations
3. Segregation of duties
4. Regular security audits

### Performance
1. Batch address creation when possible
2. Use appropriate caching strategies
3. Monitor database performance
4. Implement proper indexing

## Troubleshooting

### Common Issues

**Address Generation Fails**
- Check network configuration
- Verify sufficient entropy
- Validate input parameters
- Check database connectivity

**Balance Discrepancies**
- Verify transaction confirmations
- Check for pending transactions
- Validate blockchain synchronization
- Review collection processes

**Missing Transactions**
- Verify address monitoring
- Check transaction confirmations
- Validate network connectivity
- Review tracking service logs

### Monitoring Commands
```bash
# Check address generation
curl -X GET "https://api.gateway.com/v1/addresses?limit=10"

# Verify balance accuracy
curl -X GET "https://api.gateway.com/v1/addresses/{id}/balances"

# Check transaction history
curl -X GET "https://api.gateway.com/v1/addresses/{id}/transactions"
``` 