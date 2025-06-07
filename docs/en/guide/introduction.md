# Introduction

Welcome to the Crypto Payment Gateway documentation! This comprehensive guide will help you integrate cryptocurrency payment processing into your applications.

## What is Crypto Payment Gateway?

Crypto Payment Gateway is a robust, enterprise-grade solution for accepting and processing cryptocurrency payments. It supports multiple blockchain networks and provides a unified API for managing digital asset transactions.

## Key Features

### 🔐 **Security First**
- Multi-signature wallet support
- Hardware security module (HSM) integration
- Advanced encryption and key management
- Comprehensive audit trails

### 🌐 **Multi-Network Support**
- **Bitcoin** - The original cryptocurrency
- **Ethereum** - Smart contracts and ERC-20 tokens
- **Tron** - High throughput blockchain
- **Polygon** - Layer 2 scaling solution
- **BSC** - Binance Smart Chain
- **Arbitrum** - Ethereum Layer 2
- **Fantom** - High-speed blockchain
- **Litecoin** - Fast and lightweight

### ⚡ **High Performance**
- Real-time transaction processing
- Optimized withdrawal aggregation
- Scalable microservices architecture
- Redis caching for fast responses

### 💰 **Cost Optimization**
- Intelligent fee management
- Batch transaction processing
- Withdrawal aggregation to reduce fees
- Dynamic gas price optimization

## Architecture Overview

The gateway follows a modular microservices architecture with separate services for:

- **API Gateway** - Central entry point for all requests
- **Address Service** - Manages cryptocurrency addresses and wallets
- **Network Service** - Handles blockchain network interactions
- **Withdrawal Service** - Processes cryptocurrency withdrawals
- **Transaction Service** - Tracks and manages transactions

## Address Management Modes

The gateway supports three different address management modes:

### 1. Single Mode
- One address per coin per network
- Maximum control and isolation
- Ideal for high-value transactions

### 2. Common Mode  
- One address for all coins within a network
- Simplified management
- Automatic balance tracking for new coins

### 3. Cross Mode
- One address across compatible networks
- Maximum efficiency
- Reduced operational complexity

## Withdrawal Modes

### Standard Mode
- Individual withdrawal processing
- Immediate transaction execution
- Higher transaction fees

### Aggregation Mode
- Batch multiple withdrawals
- Optimized fee structure
- Configurable timing and thresholds

## Getting Started

Ready to integrate? Check out our [Quick Start Guide](./quick-start.md) to begin your integration journey.

## Need Help?

- 📖 Browse our [API Reference](../api/overview.md)
- 💻 Check out [Code Examples](../examples/basic-usage.md)
- 🔧 Follow our [Integration Guides](../integration/getting-started.md)

---

*Next: [Quick Start Guide](./quick-start.md)* 