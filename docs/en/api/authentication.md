# Authentication

The Crypto Payment Gateway API uses API keys for authentication. This guide covers how to obtain, configure, and use API keys securely.

::: tip Interactive Testing
On this page you can test authentication methods in real time! Enter your API key in the field below and click the "Test" buttons to send requests to the server `https://cp-merch-dev.wsdemo.online/api`.

**If you encounter CORS errors:**
- Use the "📋 Copy curl" buttons to get ready-to-use commands
- Execute commands in terminal or use Postman
- Install a browser extension to disable CORS (e.g., "CORS Unblock")
:::

## API Key Types

### Production Keys
- **Environment**: Production
- **Rate Limits**: Standard production limits
- **Access**: Full API access
- **Security**: Enhanced security requirements

### Test Keys
- **Environment**: Sandbox/Testing
- **Rate Limits**: Reduced limits for testing
- **Access**: Full API access with test data
- **Security**: Standard security requirements

## Obtaining API Keys

### 1. Account Registration
Register for an account through the merchant portal:
```
https://portal.gateway.com/register
```

### 2. API Key Generation
Navigate to the API section in your dashboard:
1. Go to **Settings** → **API Keys**
2. Click **Generate New Key**
3. Select key type (Production/Test)
4. Set permissions and restrictions
5. Save the generated key securely

### 3. Key Configuration
Configure your API key with appropriate settings:

```json
{
  "key_id": "key_123456789",
  "name": "My Application Key",
  "type": "production",
  "permissions": [
    "addresses:read",
    "addresses:create",
    "transactions:read",
    "withdrawals:create",
    "withdrawals:read"
  ],
  "restrictions": {
    "ip_whitelist": ["192.168.1.100", "10.0.0.0/8"],
    "rate_limit": 1000,
    "daily_limit": 50000
  },
  "created_at": "2024-01-15T12:00:00Z",
  "expires_at": "2025-01-15T12:00:00Z"
}
```

## Authentication Methods

### API Key Authentication
The primary authentication method uses Bearer tokens in the Authorization header:

```http
GET /api/v1/addresses
X-Api-Key: sk_live_1234567890abcdef
Content-Type: application/json
```

### API Key Header
Alternative method using custom header:

```http
GET /api/v1/addresses
X-API-Key: sk_live_1234567890abcdef
Content-Type: application/json
```

## API Key Format

### Key Structure
API keys follow a specific format for easy identification:

```
sk_{environment}_{random_string}
```

**Examples:**
- Production: `sk_live_1234567890abcdef`
- Test: `sk_test_abcdef1234567890`

### Key Components
- **Prefix**: `sk_` (Secret Key)
- **Environment**: `live` or `test`
- **Random String**: 16-character alphanumeric string

## Security Best Practices

### Key Management

#### Secure Storage
```bash
# Environment variables (recommended)
export GATEWAY_API_KEY="sk_live_1234567890abcdef"

# Configuration file (secure permissions)
chmod 600 config/api_keys.conf
```

#### Key Rotation
Regularly rotate API keys:
1. Generate new key
2. Update applications
3. Test functionality
4. Revoke old key

```bash
# Example rotation script
#!/bin/bash
NEW_KEY=$(generate_new_api_key)
update_application_config "$NEW_KEY"
test_api_connectivity
revoke_old_key "$OLD_KEY"
```

### Access Control

#### IP Whitelisting
Restrict API access to specific IP addresses:

```json
{
  "ip_restrictions": {
    "enabled": true,
    "allowed_ips": [
      "192.168.1.100",
      "10.0.0.0/8",
      "203.0.113.0/24"
    ]
  }
}
```

#### Permission Scoping
Limit API key permissions to minimum required:

```json
{
  "permissions": [
    "addresses:read",
    "transactions:read"
  ]
}
```

### Rate Limiting

#### Request Limits
API keys are subject to rate limiting:

| Key Type | Requests/Minute | Requests/Hour | Requests/Day |
|----------|----------------|---------------|--------------|
| Test | 100 | 1,000 | 10,000 |
| Production | 1,000 | 10,000 | 100,000 |
| Enterprise | 5,000 | 50,000 | 500,000 |

#### Rate Limit Headers
Response headers indicate current limits:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
X-RateLimit-Window: 60
```

## Error Handling

### Authentication Errors

#### Invalid API Key
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid",
    "details": {
      "key_prefix": "sk_live_****"
    }
  }
}
```

#### Expired API Key
```json
{
  "error": {
    "code": "EXPIRED_API_KEY",
    "message": "The API key has expired",
    "details": {
      "expired_at": "2024-01-15T12:00:00Z"
    }
  }
}
```

#### Insufficient Permissions
```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "API key lacks required permissions",
    "details": {
      "required": "withdrawals:create",
      "available": ["addresses:read", "transactions:read"]
    }
  }
}
```

#### Rate Limit Exceeded
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 1000,
      "window": 60,
      "reset_at": "2024-01-15T12:01:00Z"
    }
  }
}
```

#### IP Not Whitelisted
```json
{
  "error": {
    "code": "IP_NOT_WHITELISTED",
    "message": "Request IP is not whitelisted",
    "details": {
      "client_ip": "203.0.113.100",
      "whitelisted_ips": ["192.168.1.100", "10.0.0.0/8"]
    }
  }
}
```

## Implementation Examples

### cURL
```bash
curl -X GET "https://api.gateway.com/v1/addresses" \
  -H "X-Api-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json"
```

### JavaScript/Node.js
```javascript
const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.gateway.com/v1',
  headers: {
    'X-Api-Key': apiKey,
    'Content-Type': 'application/json'
  }
});

// Make authenticated request
const response = await apiClient.get('/addresses');
```

### Python
```python
import requests
import os

class GatewayAPI:
    def __init__(self):
        self.base_url = 'https://api.gateway.com/v1'
        self.headers = {
            'X-Api-Key': os.getenv('GATEWAY_API_KEY'),
            'Content-Type': 'application/json'
        }
    
    def get_addresses(self):
        response = requests.get(
            f'{self.base_url}/addresses',
            headers=self.headers
        )
        return response.json()
```

### Go
```go
package main

import (
    "fmt"
    "net/http"
    "os"
)

type GatewayClient struct {
    BaseURL string
    APIKey  string
    Client  *http.Client
}

func NewGatewayClient() *GatewayClient {
    return &GatewayClient{
        BaseURL: "https://api.gateway.com/v1",
        APIKey:  os.Getenv("GATEWAY_API_KEY"),
        Client:  &http.Client{},
    }
}

func (c *GatewayClient) makeRequest(method, endpoint string) (*http.Response, error) {
    req, err := http.NewRequest(method, c.BaseURL+endpoint, nil)
    if err != nil {
        return nil, err
    }
    
    req.Header.Set("X-Api-Key", c.APIKey)
    req.Header.Set("Content-Type", "application/json")
    
    return c.Client.Do(req)
}
```

### PHP
```php
<?php

class GatewayAPI {
    private $baseUrl = 'https://api.gateway.com/v1';
    private $apiKey;
    
    public function __construct() {
        $this->apiKey = getenv('GATEWAY_API_KEY');
    }
    
    private function makeRequest($method, $endpoint, $data = null) {
        $curl = curl_init();
        
        curl_setopt_array($curl, [
            CURLOPT_URL => $this->baseUrl . $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => [
                'X-Api-Key: ' . $this->apiKey,
                'Content-Type: application/json'
            ]
        ]);
        
        if ($data) {
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($curl);
        curl_close($curl);
        
        return json_decode($response, true);
    }
    
    public function getAddresses() {
        return $this->makeRequest('GET', '/addresses');
    }
}
```

## Webhook Authentication

### Webhook Signatures
Webhooks are signed using HMAC-SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
}

// Express.js middleware
app.use('/webhooks', (req, res, next) => {
    const signature = req.headers['x-gateway-signature'];
    const payload = JSON.stringify(req.body);
    
    if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }
    
    next();
});
```

## Testing Authentication

<!-- API Key Configuration Section -->
<div class="api-key-section">
  <h4>API Configuration</h4>
  <div class="api-key-controls">
    <div class="api-key-input-group">
      <label for="global-api-key">API Key:</label>
      <input type="text" id="global-api-key" class="api-key-input" placeholder="sk_test_demo_key_12345" />
    </div>
    <button onclick="setGlobalApiKey()" class="set-api-key-button">Set API Key</button>
  </div>
  <div class="api-key-status"></div>
</div>

### Test API Key
Use test keys for development and testing:

<div class="api-demo">
  <div class="demo-controls">
    <div class="button-group">
      <button onclick="testAuthKey()" class="test-button">Test Authentication</button>
      <button onclick="copyCurlCommand('/auth/test', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```bash
# Test environment
export GATEWAY_API_KEY="sk_test_abcdef1234567890"

# Test API call
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/auth/test" \
  -H "X-Api-Key: sk_test_abcdef1234567890"
```

### Authentication Test Endpoint
Verify your authentication setup:

```http
GET /api/v1/auth/test
X-Api-Key: sk_live_1234567890abcdef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "key_id": "key_123456789",
    "permissions": [
      "addresses:read",
      "addresses:create",
      "transactions:read"
    ],
    "rate_limits": {
      "remaining": 999,
      "reset_at": "2024-01-15T12:01:00Z"
    }
  }
}
```

## Troubleshooting

### Common Issues

#### 401 Unauthorized
- Check API key format
- Verify key is active
- Ensure proper Authorization header

#### 403 Forbidden
- Check IP whitelist settings
- Verify required permissions
- Review rate limit status

#### 429 Too Many Requests
- Implement exponential backoff
- Check rate limit headers
- Consider upgrading plan

### Debug Mode
Enable debug logging for authentication issues:

```javascript
const debug = require('debug')('gateway:auth');

axios.interceptors.request.use(request => {
    debug('Request:', {
        url: request.url,
        headers: request.headers,
        method: request.method
    });
    return request;
});

axios.interceptors.response.use(
    response => {
        debug('Response:', response.status);
        return response;
    },
    error => {
        debug('Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);
```

This comprehensive authentication guide ensures secure and proper access to the Crypto Payment Gateway API. 