---
layout: home

hero:
  name: "Crypto Payment Gateway"
  text: "Complete Payment Processing Solution"
  tagline: Accept and process cryptocurrency payments with ease
  image:
    src: /hero-image.svg
    alt: Crypto Payment Gateway
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/introduction
    - theme: alt
      text: API Reference
      link: /en/api/overview
    - theme: alt
      text: Русская версия
      link: /ru/guide/introduction

features:
  - icon: 🔐
    title: Secure & Reliable
    details: Enterprise-grade security with multi-signature wallets and advanced encryption
  - icon: 🌐
    title: Multi-Network Support
    details: Support for Bitcoin, Ethereum, Tron, Polygon, BSC, Arbitrum, Fantom, and Litecoin
  - icon: ⚡
    title: Fast Integration
    details: RESTful API with SDKs for Go, TypeScript, and Python
  - icon: 💰
    title: Cost Effective
    details: Optimized withdrawal aggregation to minimize transaction fees
  - icon: 🔄
    title: Real-time Processing
    details: Instant transaction notifications and real-time balance updates
  - icon: 🛠️
    title: Developer Friendly
    details: Comprehensive documentation, code examples, and interactive API explorer
  - icon: 🧪
    title: Demo Environment
    details: Test with our demo API at cp-merch-dev.wsdemo.online/api/openapi/
  - icon: 🌙
    title: Dark Theme Support
    details: Beautiful dark theme with automatic system preference detection and manual toggle
---

## Supported Networks

- **Bitcoin** – the original cryptocurrency
- **Ethereum** – smart contracts and ERC-20 tokens  
- **Tron** – high throughput blockchain
- **Polygon** – layer 2 scaling solution
- **BSC** – binance Smart Chain
- **Arbitrum** – ethereum Layer 2
- **Fantom** – high-speed blockchain
- **Litecoin** – fast and lightweight
- **TON** – fast and scalable blockchain platform

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/merchant-processing.git

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env

# Initialize networks
./init.sh -e testnet

# Start the gateway
pnpm start
```

<style>
.network-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.network-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.network-item:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.network-item img {
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
}

.network-item span {
  font-weight: 500;
  color: var(--vp-c-text-1);
}
</style> 