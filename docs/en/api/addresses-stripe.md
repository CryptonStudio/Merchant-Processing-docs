---
layout: page
---

<ApiDoc>
  <template #content>

# Addresses API

The addresses API provides functionality for managing cryptocurrency addresses, service wallets, and grey lists for various blockchain networks.

::: tip Interactive Testing
On this page you can test the API in real time! Enter your API key in the field below and click the "Test" buttons to send requests to the server `https://cp-merch-dev.wsdemo.online/api`.

**If you encounter CORS errors:**
- Use the "📋 Copy curl" buttons to get ready-to-use commands
- Execute commands in terminal or use Postman
- Install a browser extension to disable CORS (e.g., "CORS Unblock")
:::

## Overview

The addresses API allows you to:
- Create new addresses for specific networks and coins
- Retrieve address information and balances
- Manage service wallets (hot, cold, token collector)
- Handle grey list addresses for security
- Get balances for different wallet types

## Authentication

Different endpoints require different levels of authentication:
- **CLIENT_API_KEY**: For basic operations like creating addresses and checking balances
- **ADMIN_API_KEY**: For administrative operations like managing service wallets
- **Bearer token**: Alternative authentication method for all operations

<ApiMethod 
  method="POST"
  endpoint="/v1/addresses"
  title="Create Address"
  description="Creates a new address for a certain network and coin (optional). If coin is not provided then address will be generated for all coins of provided network."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug (e.g., bitcoin, ethereum, tron)' },
    { name: 'coin', type: 'string', required: false, description: 'Coin slug (optional, if not provided - generates for all network coins)' },
    { name: 'mode', type: 'string', required: false, description: 'Address mode: single, common, cross' },
    { name: 'type', type: 'string', required: false, description: 'Address type: user, hot, cold, collector' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Address successfully created' },
    { status: '400 Bad Request', description: 'Invalid request parameters' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/addresses/{address}"
  title="Get Address"
  description="Returns specified address with balance information."
  :parameters="[
    { name: 'address', type: 'string', required: true, description: 'The cryptocurrency address to retrieve' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Address information retrieved' },
    { status: '400 Bad Request', description: 'Invalid address format' },
    { status: '404 Not Found', description: 'Address not found' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/addresses/hot-wallet/{network}"
  title="Get Hot Wallet Balance"
  description="Returns the balance of the withdrawal (hot) wallet for specified network."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug (e.g., bitcoin, ethereum, tron)' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Hot wallet balance retrieved' },
    { status: '400 Bad Request', description: 'Invalid network' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/addresses/service-wallet/{network}"
  title="Get Service Wallet Balance"
  description="Returns the balance of the service (token collector) wallet for specified network."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug (e.g., bitcoin, ethereum, tron)' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Service wallet balance retrieved' },
    { status: '400 Bad Request', description: 'Invalid network' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/addresses/cold-wallet/{network}"
  title="Get Cold Wallet Balance"
  description="Returns the balance of the cold wallet for specified network."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug (e.g., bitcoin, ethereum, tron)' },
    { name: 'coin', type: 'string', required: false, description: 'Optional coin parameter to filter by specific coin' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Cold wallet balance retrieved' },
    { status: '400 Bad Request', description: 'Invalid network or coin' }
  ]"
/>

<ApiMethod 
  method="POST"
  endpoint="/v1/addresses/service-wallets"
  title="Register Service Wallet"
  description="Register a service wallet for a certain network. For cold wallet need provide only an address. For rest wallets may provide an address and private key, otherwise the wallet will be created and address and private key will be returned."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug' },
    { name: 'type', type: 'string', required: true, description: 'Wallet type: hot, cold, tokens_collector' },
    { name: 'address', type: 'string', required: false, description: 'Wallet address (required for cold wallets)' },
    { name: 'privateKey', type: 'string', required: false, description: 'Private key (optional, will be generated if not provided)' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Service wallet registered successfully' },
    { status: '400 Bad Request', description: 'Invalid parameters' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/addresses/grey-list"
  title="Get Grey List"
  description="Returns the list of grey-listed addresses for security monitoring."
  :responses="[
    { status: '200 OK', description: 'Grey list retrieved' }
  ]"
/>

<ApiMethod 
  method="POST"
  endpoint="/v1/addresses/grey-list"
  title="Register Grey Address"
  description="Register a grey address for a certain network for security monitoring."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug' },
    { name: 'address', type: 'string', required: true, description: 'Address to add to grey list' },
    { name: 'reason', type: 'string', required: false, description: 'Reason for grey listing' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Grey address registered' },
    { status: '400 Bad Request', description: 'Invalid parameters' }
  ]"
/>

<ApiMethod 
  method="DELETE"
  endpoint="/v1/addresses/grey-list"
  title="Delete Grey Address"
  description="Delete the grey address for a certain network."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug' },
    { name: 'address', type: 'string', required: true, description: 'Address to remove from grey list' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Grey address deleted' },
    { status: '400 Bad Request', description: 'Invalid parameters' },
    { status: '404 Not Found', description: 'Address not found in grey list' }
  ]"
/>

  </template>

  <template #examples>

<div class="example-block" data-lang="curl">

### Create Address

<div class="api-demo">
  <div class="demo-controls">
    <label for="api-key">API Key:</label>
    <input type="text" id="api-key" value="sk_test_demo_key_12345" placeholder="Enter your API key" />
    <label for="address-network">Network:</label>
    <select id="address-network">
      <option value="bitcoin">Bitcoin</option>
      <option value="ethereum" selected>Ethereum</option>
      <option value="tron">Tron</option>
      <option value="bsc">BSC</option>
      <option value="polygon">Polygon</option>
    </select>
    <label for="address-coin">Coin (optional):</label>
    <input type="text" id="address-coin" placeholder="e.g., usdt, eth" />
    <button onclick="testCreateAddress()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/addresses', {method: 'POST', body: JSON.stringify({network: 'ethereum', coin: 'eth'})})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/addresses" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "coin": "eth"
  }'
```

**Response:**
```json
{
  "id": "addr_abc123def456",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "network": "ethereum",
  "coin": "eth",
  "type": "user",
  "mode": "single",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### Get Address Information

<div class="api-demo">
  <div class="demo-controls">
    <label for="get-address">Address:</label>
    <input type="text" id="get-address" placeholder="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87" />
    <button onclick="testGetAddress()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/addresses/0x742d35Cc6634C0532925a3b8D4C9db96590c6C87', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/addresses/0x742d35Cc6634C0532925a3b8D4C9db96590c6C87" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "network": "ethereum",
  "balances": [
    {
      "coin": "eth",
      "balance": "1.234567890123456789",
      "balanceUSD": 2468.90
    },
    {
      "coin": "usdt",
      "balance": "1000.000000",
      "balanceUSD": 1000.00
    }
  ],
  "totalBalanceUSD": 3468.90
}
```

### Get Hot Wallet Balance

<div class="api-demo">
  <div class="demo-controls">
    <label for="hot-wallet-network">Network:</label>
    <select id="hot-wallet-network">
      <option value="bitcoin">Bitcoin</option>
      <option value="ethereum" selected>Ethereum</option>
      <option value="tron">Tron</option>
    </select>
    <button onclick="testGetHotWallet()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/addresses/hot-wallet/ethereum', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/addresses/hot-wallet/ethereum" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Response:**
```json
{
  "network": "ethereum",
  "walletType": "hot",
  "balances": [
    {
      "coin": "eth",
      "balance": "10.567890123456789",
      "balanceUSD": 21135.78
    },
    {
      "coin": "usdt",
      "balance": "50000.000000",
      "balanceUSD": 50000.00
    }
  ],
  "totalBalanceUSD": 71135.78
}
```

</div>

<div class="example-block" data-lang="go">

### Go HTTP Client

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

func main() {
    // Create address
    payload := map[string]string{
        "network": "ethereum",
        "coin":    "eth",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "https://cp-merch-dev.wsdemo.online/api/v1/addresses", bytes.NewBuffer(jsonData))
    req.Header.Set("X-Api-Key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    fmt.Printf("Response: %s\n", body)
}
```

</div>

<div class="example-block" data-lang="javascript">

### JavaScript Fetch

```javascript
// Create new address
const createAddress = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/addresses', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      network: 'ethereum',
      coin: 'eth'
    })
  });
  
  const address = await response.json();
  console.log('Created address:', address);
  
  // Get address information
  const addressResponse = await fetch(`https://cp-merch-dev.wsdemo.online/api/v1/addresses/${address.address}`, {
    headers: {
      'X-Api-Key': 'YOUR_API_KEY'
    }
  });
  
  const addressInfo = await addressResponse.json();
  console.log('Address info:', addressInfo);
};

createAddress();
```

</div>

<div class="example-block" data-lang="python">

### Python Requests

```python
import requests
import json

# API configuration
API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1'
headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Create new address
payload = {
    'network': 'ethereum',
    'coin': 'eth'
}

response = requests.post(f'{API_BASE}/addresses', 
                        headers=headers, 
                        json=payload)

if response.status_code == 201:
    address = response.json()
    print(f"Created address: {address['address']}")
    
    # Get address information
    addr_response = requests.get(f"{API_BASE}/addresses/{address['address']}", 
                                headers=headers)
    
    if addr_response.status_code == 200:
        address_info = addr_response.json()
        print(f"Address balances: {address_info['balances']}")
else:
    print(f"Error: {response.status_code}")
```

</div>

<div class="example-block" data-lang="php">

### PHP cURL

```php
<?php
$apiKey = 'YOUR_API_KEY';
$baseUrl = 'https://cp-merch-dev.wsdemo.online/api/v1';

// Create new address
$payload = json_encode([
    'network' => 'ethereum',
    'coin' => 'eth'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/addresses');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-Api-Key: ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 201) {
    $address = json_decode($response, true);
    echo "Created address: " . $address['address'] . "\n";
} else {
    echo "Error: " . $httpCode . "\n";
}
?>
```

</div>

  </template>
</ApiDoc> 