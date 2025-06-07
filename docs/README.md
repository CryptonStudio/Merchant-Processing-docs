# Crypto Payment Gateway Documentation

Comprehensive documentation for the Crypto Payment Gateway - a complete solution for accepting and processing cryptocurrency payments.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker

```bash
# Build and run with Docker
docker build -t gateway-docs .
docker run -p 3000:3000 gateway-docs
```

## 📚 Documentation Structure

### English Documentation (`/en`)
- **Guide**: Getting started, architecture, core concepts
- **API Reference**: Complete API documentation
- **Integration**: SDK guides and examples
- **Examples**: Code samples and use cases

### Russian Documentation (`/ru`)
- **Руководство**: Начало работы, архитектура, основные концепции
- **API Справочник**: Полная документация API
- **Интеграция**: Руководства по SDK и примеры
- **Примеры**: Образцы кода и случаи использования

## 🛠 Technology Stack

- **VitePress**: Static site generator
- **Vue 3**: Frontend framework
- **TypeScript**: Type safety
- **Mermaid**: Diagrams and flowcharts
- **Docker**: Containerization

## 📖 Content Overview

### Core Features Documented

- ✅ **Architecture Overview**: Complete system architecture
- ✅ **Address Management**: All address types and modes
- ✅ **API Reference**: Full REST API documentation
- ✅ **Deployment Guide**: Production deployment instructions
- ✅ **Integration Examples**: Real-world code examples
- ✅ **Security Guidelines**: Best practices and security measures

### Supported Networks

- Bitcoin (BTC)
- Ethereum (ETH) + ERC-20 tokens
- Tron (TRX) + TRC-20 tokens
- Binance Smart Chain (BSC) + BEP-20 tokens
- Polygon (MATIC) + tokens
- Arbitrum + tokens
- Fantom + tokens
- Litecoin (LTC)

### Supported Features

- Custodial and non-custodial wallets
- Multi-signature support
- Withdrawal aggregation
- Real-time transaction monitoring
- KYT (Know Your Transaction) compliance
- Webhook notifications
- Multiple address modes
- Hot/cold wallet management

## 🔧 Configuration

### Environment Variables

```bash
# VitePress configuration
VITE_API_URL=https://api.your-gateway.com
VITE_DOCS_VERSION=v1.0.0
VITE_GITHUB_REPO=your-org/merchant-processing
```

### VitePress Config

The documentation is configured in `docs/.vitepress/config.ts` with:

- Multi-language support (EN/RU)
- Custom theme configuration
- Navigation structure
- Search functionality
- Social links

## 📝 Contributing

### Adding New Documentation

1. **Create new markdown files** in appropriate language directories
2. **Update navigation** in `.vitepress/config.ts`
3. **Add cross-references** between related documents
4. **Include code examples** where applicable
5. **Test locally** before submitting

### Documentation Standards

- Use clear, concise language
- Include practical examples
- Maintain consistent formatting
- Add diagrams for complex concepts
- Keep both language versions synchronized

### File Structure

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress configuration
│   └── components/        # Custom Vue components
├── en/                    # English documentation
│   ├── guide/            # User guides
│   ├── api/              # API reference
│   ├── integration/      # Integration guides
│   └── examples/         # Code examples
├── ru/                   # Russian documentation
│   ├── guide/            # Руководства
│   ├── api/              # API справочник
│   ├── integration/      # Интеграция
│   └── examples/         # Примеры
└── index.md              # Homepage
```

## 🚀 Deployment

### GitHub Pages

```yaml
# .github/workflows/docs.yml
name: Deploy Documentation
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "docs/.vitepress/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

## 🔍 Search

The documentation includes built-in search functionality powered by VitePress. Search indexes:

- All markdown content
- Code examples
- API endpoints
- Configuration options

## 📊 Analytics

### Google Analytics

Add to `.vitepress/config.ts`:

```typescript
export default defineConfig({
  head: [
    ['script', { 
      async: true, 
      src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' 
    }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    `]
  ]
})
```

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Links Not Working**
- Check file paths are correct
- Ensure `.md` extension is included
- Verify navigation config matches file structure

**Images Not Loading**
- Place images in `docs/public/` directory
- Reference with `/image-name.png` (leading slash)

**Mermaid Diagrams Not Rendering**
- Check diagram syntax
- Ensure proper code block formatting
- Verify mermaid plugin is enabled

## 📞 Support

### Documentation Issues

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share ideas
- **Wiki**: Community-maintained additional documentation

### API Support

- **Email**: support@your-gateway.com
- **Documentation**: This site
- **Status Page**: status.your-gateway.com

## 📄 License

This documentation is licensed under [MIT License](LICENSE).

## 🔗 Links

- **Main Repository**: [GitHub](https://github.com/your-org/merchant-processing)
- **API Documentation**: [/en/api/overview](/en/api/overview)
- **Getting Started**: [/en/guide/introduction](/en/guide/introduction)
- **Examples**: [/en/examples/basic-usage](/en/examples/basic-usage) 