# Crypto Payment Gateway Documentation

Complete documentation for cryptocurrency payment processing system with support for multiple blockchain networks.

## 🚀 Features

- **Multi-Network Support**: Bitcoin, Ethereum, Tron, BSC, Polygon, Arbitrum, Fantom, Litecoin
- **Comprehensive API**: RESTful API for payment processing, address management, and withdrawals
- **Real-time Testing**: Interactive API testing with live examples
- **Multiple Languages**: Documentation available in English and Russian
- **Stripe-style Documentation**: Modern, developer-friendly interface

## 📖 Documentation

Visit our comprehensive documentation at: **[https://cryptonstudio.github.io/Merchant-Processing-docs/](https://cryptonstudio.github.io/Merchant-Processing-docs/)**

### Quick Links

- **[API Reference](https://cryptonstudio.github.io/Merchant-Processing-docs/en/api/overview)** - Complete API documentation
- **[Getting Started](https://cryptonstudio.github.io/Merchant-Processing-docs/en/guide/introduction)** - Quick start guide
- **[Architecture](https://cryptonstudio.github.io/Merchant-Processing-docs/en/guide/architecture)** - System architecture overview
- **[Integration Examples](https://cryptonstudio.github.io/Merchant-Processing-docs/en/examples/basic-usage)** - Code examples

## 🛠 API Endpoints

### Core APIs
- **Merchant API** - Invoice management and merchant operations
- **Addresses API** - Cryptocurrency address generation and management
- **Networks API** - Blockchain network information and operations
- **Withdrawals API** - Cryptocurrency withdrawal processing

### Supported Operations
- Create and manage invoices
- Generate cryptocurrency addresses
- Process payments across multiple networks
- Handle withdrawals and transfers
- Real-time transaction monitoring
- Webhook notifications

## 🌐 Supported Networks

| Network | Native Coin | Tokens Supported |
|---------|-------------|------------------|
| Bitcoin | BTC | - |
| Ethereum | ETH | USDT, USDC, DAI, and more |
| Tron | TRX | USDT-TRC20, and more |
| BSC | BNB | USDT-BEP20, BUSD, and more |
| Polygon | MATIC | USDT, USDC, and more |
| Arbitrum | ETH | USDT, USDC, and more |
| Fantom | FTM | USDT, and more |
| Litecoin | LTC | - |

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/CryptonStudio/Merchant-Processing-docs.git
cd Merchant-Processing-docs

# Install dependencies
npm install

# Start development server
cd docs && npm run dev

# Build for production
npm run build
```

### Project Structure

```
├── docs/
│   ├── .vitepress/          # VitePress configuration
│   │   ├── components/      # Vue components
│   │   ├── theme/          # Custom theme files
│   │   └── config.ts       # Main configuration
│   ├── en/                 # English documentation
│   │   ├── api/           # API reference
│   │   ├── guide/         # User guides
│   │   └── examples/      # Code examples
│   └── ru/                # Russian documentation
├── .github/workflows/      # GitHub Actions
└── README.md              # This file
```

## 📝 API Examples

### Create Invoice

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/invoices" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "eth",
    "amount": 0.001,
    "externalId": "order_123"
  }'
```

### Generate Address

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/addresses" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "coin": "eth"
  }'
```

### Get Networks

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/networks" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 🔐 Authentication

All API requests require authentication using Bearer tokens:

```
Authorization: Bearer YOUR_API_KEY
```

Contact your system administrator to obtain API credentials.

## 🌍 Internationalization

Documentation is available in multiple languages:

- **English** - `/en/`
- **Russian** - `/ru/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About Crypton Studio

This documentation is maintained by **Crypton Studio LLC** - a leading provider of cryptocurrency payment processing solutions.

- **Website**: [https://cryptonstudio.com](https://cryptonstudio.com)
- **Support**: Contact your system administrator
- **Documentation**: [https://cryptonstudio.github.io/Merchant-Processing-docs/](https://cryptonstudio.github.io/Merchant-Processing-docs/)

---

© 2016-2025 Crypton Studio LLC. All rights reserved.