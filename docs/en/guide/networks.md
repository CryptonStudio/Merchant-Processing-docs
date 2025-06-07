# Networks & Coins

The Crypto Payment Gateway supports multiple blockchain networks and their native coins and tokens. This section covers network configuration, supported assets, and network-specific features.

## Supported Networks

### Bitcoin Network
- **Network ID**: `bitcoin`
- **Native Coin**: BTC
- **Type**: UTXO-based blockchain
- **Confirmations Required**: 6 blocks
- **Features**: 
  - Native Bitcoin transactions
  - SegWit support
  - Multi-signature wallets

### Ethereum Network
- **Network ID**: `ethereum`
- **Native Coin**: ETH
- **Type**: Account-based blockchain
- **Confirmations Required**: 12 blocks
- **Features**:
  - Smart contracts
  - ERC-20 tokens
  - Gas fee optimization

### Tron Network
- **Network ID**: `tron`
- **Native Coin**: TRX
- **Type**: Account-based blockchain
- **Confirmations Required**: 19 blocks
- **Features**:
  - TRC-20 tokens
  - Energy/bandwidth system
  - Fast transactions

### Binance Smart Chain (BSC)
- **Network ID**: `bsc`
- **Native Coin**: BNB
- **Type**: EVM-compatible
- **Confirmations Required**: 15 blocks
- **Features**:
  - BEP-20 tokens
  - Low transaction fees
  - Ethereum compatibility

### Polygon Network
- **Network ID**: `polygon`
- **Native Coin**: MATIC
- **Type**: EVM-compatible Layer 2
- **Confirmations Required**: 20 blocks
- **Features**:
  - Polygon tokens
  - Fast and cheap transactions
  - Ethereum bridge

### Arbitrum Network
- **Network ID**: `arbitrum`
- **Native Coin**: ETH
- **Type**: Ethereum Layer 2
- **Confirmations Required**: 10 blocks
- **Features**:
  - Optimistic rollups
  - Ethereum compatibility
  - Lower gas fees

### Fantom Network
- **Network ID**: `fantom`
- **Native Coin**: FTM
- **Type**: EVM-compatible
- **Confirmations Required**: 12 blocks
- **Features**:
  - Fast finality
  - Low transaction costs
  - DeFi ecosystem

### Litecoin Network
- **Network ID**: `litecoin`
- **Native Coin**: LTC
- **Type**: UTXO-based (Bitcoin fork)
- **Confirmations Required**: 6 blocks
- **Features**:
  - Faster block times
  - Scrypt mining
  - SegWit support

## Supported Coins and Tokens

### Native Coins
| Network | Coin | Symbol | Decimals |
|---------|------|--------|----------|
| Bitcoin | Bitcoin | BTC | 8 |
| Ethereum | Ether | ETH | 18 |
| Tron | Tron | TRX | 6 |
| BSC | BNB | BNB | 18 |
| Polygon | Polygon | MATIC | 18 |
| Arbitrum | Ether | ETH | 18 |
| Fantom | Fantom | FTM | 18 |
| Litecoin | Litecoin | LTC | 8 |

### Stablecoins
| Token | Networks | Contract Addresses |
|-------|----------|-------------------|
| USDT | Ethereum, Tron, BSC, Polygon, Arbitrum | Various |
| USDC | Ethereum, BSC, Polygon, Arbitrum | Various |
| BUSD | BSC, Ethereum | Various |
| DAI | Ethereum, BSC, Polygon | Various |

## Network Configuration

### Adding New Networks

To add a new network, configure the following parameters:

```json
{
  "slug": "network_name",
  "name": "Network Display Name",
  "chainId": 1,
  "rpcUrl": "https://rpc.network.com",
  "wsUrl": "wss://ws.network.com",
  "explorerUrl": "https://explorer.network.com",
  "confirmationBlocks": 12,
  "gasLimit": 21000,
  "features": ["evm", "tokens"]
}
```

### Network Features

#### EVM Compatibility
Networks marked as EVM-compatible support:
- Smart contracts
- Token standards (ERC-20, BEP-20, etc.)
- Cross-network address compatibility
- Gas-based fee system

#### UTXO Networks
Bitcoin-based networks feature:
- Unspent Transaction Output model
- Multi-input/output transactions
- Script-based conditions
- Fee-per-byte pricing

## Token Management

### Adding New Tokens

```http
POST /api/v1/coins
{
  "slug": "token_symbol",
  "name": "Token Name",
  "symbol": "TOKEN",
  "network": "ethereum",
  "contractAddress": "0x...",
  "decimals": 18,
  "type": "token"
}
```

### Token Standards

#### ERC-20 (Ethereum)
- Standard interface for fungible tokens
- Transfer, approve, and allowance functions
- Event logging for transfers

#### TRC-20 (Tron)
- Tron's token standard
- Similar to ERC-20
- Energy-efficient transfers

#### BEP-20 (BSC)
- Binance Smart Chain token standard
- ERC-20 compatible
- Lower transaction fees

## Network Monitoring

### Block Scanning
The gateway continuously scans blocks for:
- New transactions to monitored addresses
- Transaction confirmations
- Network reorganizations
- Failed transactions

### Health Monitoring
Each network connection is monitored for:
- RPC endpoint availability
- Block synchronization status
- Transaction pool status
- Network latency

## Gas and Fee Management

### Dynamic Fee Calculation
The system automatically adjusts fees based on:
- Network congestion
- Transaction priority
- Historical fee data
- User preferences

### Fee Optimization Strategies

#### Ethereum Networks
- EIP-1559 fee structure
- Base fee + priority fee
- Gas limit optimization
- MEV protection

#### Bitcoin Networks
- Fee-per-byte calculation
- UTXO consolidation
- RBF (Replace-by-Fee) support
- Batch transactions

## Network-Specific Features

### Ethereum Features
- Smart contract interactions
- Token approvals and transfers
- Gas estimation
- Nonce management

### Bitcoin Features
- UTXO selection algorithms
- Multi-signature support
- SegWit transactions
- Lightning Network preparation

### Tron Features
- Energy and bandwidth management
- TRC-20 token transfers
- Resource optimization
- Stake/unstake operations

## Troubleshooting

### Common Network Issues

#### RPC Connection Problems
```bash
# Test RPC connectivity
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://rpc.network.com
```

#### Block Synchronization Issues
- Check network status
- Verify RPC endpoint health
- Monitor block lag metrics
- Review error logs

#### Transaction Failures
- Insufficient gas/fees
- Network congestion
- Invalid transaction data
- Nonce conflicts

### Monitoring Commands

```bash
# Check network status
GET /api/v1/networks

# Monitor specific network
GET /api/v1/networks/ethereum/status

# View recent blocks
GET /api/v1/networks/ethereum/blocks?limit=10
```

## Best Practices

### Network Selection
1. Choose networks based on transaction volume
2. Consider fee structures for your use case
3. Evaluate confirmation times
4. Assess ecosystem maturity

### Fee Management
1. Implement dynamic fee calculation
2. Monitor network congestion
3. Use appropriate confirmation requirements
4. Consider batch processing for efficiency

### Security Considerations
1. Validate all network configurations
2. Monitor for network forks
3. Implement proper key management
4. Use secure RPC endpoints

This comprehensive guide covers all supported networks and their specific features, helping you make informed decisions about which networks to use for your cryptocurrency payment processing needs. 