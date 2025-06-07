# Deployment Guide

This guide covers the deployment and configuration of the Crypto Payment Gateway in production environments.

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended)
- **CPU**: 4+ cores
- **RAM**: 8GB+ (16GB recommended)
- **Storage**: 100GB+ SSD
- **Network**: Stable internet connection

### Software Dependencies
- **Node.js**: 20.x LTS
- **pnpm**: Latest version
- **PostgreSQL**: 14+
- **Redis**: 6+
- **RabbitMQ**: 3.8+
- **Docker**: 20.10+ (optional)
- **Docker Compose**: 2.0+ (optional)

## Installation Methods

### Method 1: Docker Compose (Recommended)

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/merchant-processing.git
cd merchant-processing
```

#### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
nano .env
```

#### 3. Start Services
```bash
# Start infrastructure services
docker-compose up -d redis rabbitmq postgres

# Initialize the system
./init.sh -e mainnet

# Start all services
docker-compose up -d
```

### Method 2: Manual Installation

#### 1. Install Dependencies
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Redis
sudo apt-get install redis-server

# Install RabbitMQ
sudo apt-get install rabbitmq-server
```

#### 2. Setup Database
```bash
sudo -u postgres createuser gateway
sudo -u postgres createdb gateway_db
sudo -u postgres psql -c "ALTER USER gateway PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gateway_db TO gateway;"
```

#### 3. Clone and Build
```bash
git clone https://github.com/your-org/merchant-processing.git
cd merchant-processing
pnpm install
pnpm build
```

#### 4. Configure Environment
```bash
cp .env.example .env
# Edit configuration
nano .env
```

#### 5. Initialize System
```bash
./init.sh -e mainnet
```

#### 6. Start Services
```bash
# Start each service in separate terminals or use process manager
pnpm --filter gateway start &
pnpm --filter merchant start &
pnpm --filter storage start &
pnpm --filter tracking start &
# ... other services
```

## Environment Configuration

### Core Configuration (.env)
```bash
# Database
DATABASE_URL=postgresql://gateway:password@localhost:5432/gateway_db
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=gateway
DATABASE_PASSWORD=your_password
DATABASE_NAME=gateway_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# API Configuration
API_PORT=3000
API_HOST=0.0.0.0
API_PREFIX=/api/v1

# Security
JWT_SECRET=your_jwt_secret_key
API_KEY_SECRET=your_api_key_secret
ENCRYPTION_KEY=your_encryption_key

# Address Mode
ADDRESSES_MODE=common  # single, common, cross

# Withdrawal Aggregation
WITHDRAWAL_AGGREGATION_MODE=batch  # none, batch
WITHDRAWAL_AGGR_TIMEOUT=10
WITHDRAWALS_AGGR_INTERVAL=20

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### Network Configuration
```bash
# Bitcoin
BITCOIN_RPC_URL=https://bitcoin-rpc.example.com
BITCOIN_RPC_USERNAME=rpc_user
BITCOIN_RPC_PASSWORD=rpc_password

# Ethereum
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_project_id
ETHEREUM_WS_URL=wss://mainnet.infura.io/ws/v3/your_project_id

# Tron
TRON_RPC_URL=https://api.trongrid.io
TRON_API_KEY=your_tron_api_key

# BSC
BSC_RPC_URL=https://bsc-dataseed.binance.org
BSC_WS_URL=wss://bsc-ws-node.nariox.org:443

# Polygon
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGON_WS_URL=wss://polygon-ws.com

# Arbitrum
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
ARBITRUM_WS_URL=wss://arb1.arbitrum.io/ws
```

## Service Configuration

### Gateway Service
```yaml
# apps/gateway/config/production.yml
server:
  port: 3000
  host: '0.0.0.0'
  cors:
    origin: ['https://your-domain.com']
    credentials: true

rate_limiting:
  general: 1000  # requests per hour
  addresses: 100
  withdrawals: 50

security:
  api_key_required: true
  ip_whitelist: []
  max_request_size: '10mb'
```

### Tracking Service
```yaml
# apps/tracking/config/production.yml
blockchain:
  confirmation_blocks:
    bitcoin: 6
    ethereum: 12
    tron: 19
    bsc: 15
    polygon: 20

scanning:
  batch_size: 100
  interval: 5000  # milliseconds
  max_reorg_depth: 50

monitoring:
  health_check_interval: 30000
  alert_thresholds:
    block_lag: 10
    rpc_errors: 5
```

## Security Configuration

### SSL/TLS Setup
```bash
# Install Certbot
sudo apt-get install certbot

# Generate SSL certificate
sudo certbot certonly --standalone -d api.your-domain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/gateway
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall Configuration
```bash
# Configure UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL
sudo ufw allow from 10.0.0.0/8 to any port 6379  # Redis
sudo ufw allow from 10.0.0.0/8 to any port 5672  # RabbitMQ
```

## Process Management

### Using PM2
```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'gateway',
      cwd: './apps/gateway',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'merchant',
      cwd: './apps/merchant',
      script: 'dist/main.js',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'storage',
      cwd: './apps/storage',
      script: 'dist/main.js',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'tracking',
      cwd: './apps/tracking',
      script: 'dist/main.js',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

# Start services
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Using Systemd
```bash
# Create service file for each app
sudo nano /etc/systemd/system/gateway.service
```

```ini
[Unit]
Description=Gateway Service
After=network.target

[Service]
Type=simple
User=gateway
WorkingDirectory=/opt/merchant-processing/apps/gateway
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start services
sudo systemctl enable gateway
sudo systemctl start gateway
sudo systemctl status gateway
```

## Monitoring and Logging

### Log Configuration
```yaml
# config/logging.yml
logging:
  level: info
  format: json
  outputs:
    - type: file
      path: /var/log/gateway/app.log
      rotation:
        max_size: 100MB
        max_files: 10
    - type: console
      format: pretty
```

### Health Checks
```bash
# Create health check script
cat > health-check.sh << EOF
#!/bin/bash
curl -f http://localhost:3000/health || exit 1
EOF

chmod +x health-check.sh
```

### Monitoring with Prometheus
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'gateway'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

## Backup and Recovery

### Database Backup
```bash
# Create backup script
cat > backup.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U gateway gateway_db > /backups/gateway_db_$DATE.sql
find /backups -name "gateway_db_*.sql" -mtime +7 -delete
EOF

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### Configuration Backup
```bash
# Backup configuration files
tar -czf config_backup_$(date +%Y%m%d).tar.gz \
  .env \
  apps/*/config/ \
  docker-compose.yml
```

## Scaling and Load Balancing

### Horizontal Scaling
```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  gateway:
    deploy:
      replicas: 3
    ports:
      - "3000-3002:3000"

  tracking:
    deploy:
      replicas: 2
```

### Load Balancer Configuration
```nginx
upstream gateway_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://gateway_backend;
    }
}
```

## Troubleshooting

### Common Issues

**Service Won't Start**
```bash
# Check logs
journalctl -u gateway -f
pm2 logs gateway

# Check configuration
node -c apps/gateway/dist/main.js
```

**Database Connection Issues**
```bash
# Test connection
psql -h localhost -U gateway -d gateway_db

# Check PostgreSQL status
sudo systemctl status postgresql
```

**RPC Connection Problems**
```bash
# Test RPC endpoints
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  $ETHEREUM_RPC_URL
```

### Performance Optimization

**Database Optimization**
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_addresses_network ON addresses(network);
CREATE INDEX CONCURRENTLY idx_transactions_hash ON transactions(hash);
CREATE INDEX CONCURRENTLY idx_balances_address_coin ON balances(address_id, coin);
```

**Redis Optimization**
```bash
# Configure Redis for production
echo "maxmemory 2gb" >> /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lru" >> /etc/redis/redis.conf
```

## Security Hardening

### System Security
```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Configure fail2ban
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
```

### Application Security
```bash
# Set proper file permissions
chmod 600 .env
chown gateway:gateway .env

# Secure private keys
chmod 400 keys/*
chown gateway:gateway keys/*
```

### Network Security
```bash
# Configure iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -j DROP
```

This deployment guide provides a comprehensive approach to setting up the Crypto Payment Gateway in production. Always test deployments in a staging environment first and follow security best practices. 