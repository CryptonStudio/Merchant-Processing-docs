---
layout: page
---

<ApiDoc>
  <template #content>

# Coins API

The coins API provides functionality for managing cryptocurrency coins and tokens across different blockchain networks.

::: tip Interactive Testing
Test the API in real time! Enter your API key and click "Test" buttons to send requests to `https://cp-merch-dev.wsdemo.online/api`.
:::

## Overview

The coins API allows you to:
- Create new coins and tokens
- Precreate tokens from contract addresses
- Edit coin settings and status
- Retrieve coin information and configurations

<ApiMethod 
  method="POST"
  endpoint="/v1/coins"
  title="Create Coin"
  description="Creates a new coin or token. Admin access only."
  :parameters="[
    { name: 'coin', type: 'string', required: false, description: 'Unique coin identifier (auto-generated if not provided)' },
    { name: 'name', type: 'string', required: false, description: 'Coin or token name (auto-detected from contract if not provided)' },
    { name: 'contractAddress', type: 'string', required: false, description: 'Token contract address (for tokens only)' },
    { name: 'network', type: 'string', required: true, description: 'Network slug (e.g., ethereum, bitcoin, tron)' },
    { name: 'useUsdLimits', type: 'boolean', required: false, description: 'Use USD limits for settlements and transactions' },
    { name: 'collectThreshold', type: 'number', required: false, description: 'Minimum amount for transfer to service wallet' },
    { name: 'collectServiceToColdThreshold', type: 'number', required: false, description: 'Minimum amount for transfer from service to cold wallet' },
    { name: 'collectPercentageHot', type: 'number', required: false, description: 'Percentage of coins collected on hot wallet' },
    { name: 'approveThreshold', type: 'number', required: false, description: 'Confidence volume for transfers to service wallet' },
    { name: 'minValue', type: 'number', required: false, description: 'Minimum possible amount for one-time withdrawal' },
    { name: 'maxValue', type: 'number', required: false, description: 'Maximum possible amount for one-time withdrawal' },
    { name: 'maxValueDaily', type: 'number', required: false, description: 'Maximum possible withdrawal in 24 hours' },
    { name: 'minDepositAmount', type: 'number', required: false, description: 'Minimum amount for deposit' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Coin created successfully' },
    { status: '400 Bad Request', description: 'Invalid parameters' }
  ]"
/>

<ApiMethod 
  method="PUT"
  endpoint="/v1/coins/precreate-token"
  title="Precreate Token"
  description="Precreates a token by analyzing its contract address. Admin access only."
  :parameters="[
    { name: 'contractAddress', type: 'string', required: true, description: 'Token contract address' },
    { name: 'network', type: 'string', required: true, description: 'Network slug (e.g., ethereum, bsc, polygon)' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Token precreated successfully' },
    { status: '400 Bad Request', description: 'Invalid contract address or network' }
  ]"
/>

<ApiMethod 
  method="PUT"
  endpoint="/v1/coins"
  title="Edit Coin"
  description="Edits coin or token settings and status. Can be used to activate/deactivate coins. Admin access only."
  :parameters="[
    { name: 'coin', type: 'string', required: true, description: 'Unique coin identifier' },
    { name: 'name', type: 'string', required: false, description: 'Coin or token name' },
    { name: 'status', type: 'string', required: false, description: 'Coin status (ACTIVE, INACTIVE)' },
    { name: 'useUsdLimits', type: 'boolean', required: false, description: 'Use USD limits for settlements and transactions' },
    { name: 'collectThreshold', type: 'number', required: false, description: 'Minimum amount for transfer to service wallet' },
    { name: 'collectServiceToColdThreshold', type: 'number', required: false, description: 'Minimum amount for transfer from service to cold wallet' },
    { name: 'collectPercentageHot', type: 'number', required: false, description: 'Percentage of coins collected on hot wallet' },
    { name: 'approveThreshold', type: 'number', required: false, description: 'Confidence volume for transfers to service wallet' },
    { name: 'minValue', type: 'number', required: false, description: 'Minimum possible amount for one-time withdrawal' },
    { name: 'maxValue', type: 'number', required: false, description: 'Maximum possible amount for one-time withdrawal' },
    { name: 'maxValueDaily', type: 'number', required: false, description: 'Maximum possible withdrawal in 24 hours' },
    { name: 'minDepositAmount', type: 'number', required: false, description: 'Minimum amount for deposit' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Coin updated successfully' },
    { status: '400 Bad Request', description: 'Invalid parameters' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/coins"
  title="Get Coins"
  description="Returns list of all available coins and tokens."
  :responses="[
    { status: '200 OK', description: 'Coins list retrieved' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/coins/{coin}"
  title="Get Coin"
  description="Returns information about a specific coin or token."
  :parameters="[
    { name: 'coin', type: 'string', required: true, description: 'Coin slug (e.g., btc, eth, usdt)' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Coin information retrieved' },
    { status: '400 Bad Request', description: 'Invalid coin slug' }
  ]"
/>

  </template>

  <template #examples>

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

<div class="example-block" data-lang="curl">

### Create Coin

<div class="api-demo">
  <div class="demo-controls">
    <label for="api-key">API Key:</label>
    <input type="text" id="api-key" value="sk_test_demo_key_12345" placeholder="Enter your API key" />
    <label for="coin-network">Network:</label>
    <select id="coin-network">
      <option value="ethereum" selected>Ethereum</option>
      <option value="bitcoin">Bitcoin</option>
      <option value="tron">Tron</option>
      <option value="bsc">BSC</option>
    </select>
    <label for="coin-name">Coin Name:</label>
    <input type="text" id="coin-name" placeholder="My Token" />
    <div class="button-group">
      <button onclick="testCreateCoin()" class="test-button">Test</button>
      <button onclick="copyCurlCommand('/coins', {method: 'POST', body: JSON.stringify({network: 'ethereum', name: 'My Token'})})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/coins" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "name": "My Token",
    "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "collectThreshold": 0.001,
    "minValue": 0.0001,
    "maxValue": 1000
  }'
```

**Response:**
```json
{
  "message": "Coin created successfully"
}
```

### Precreate Token

<div class="api-demo">
  <div class="demo-controls">
    <label for="contract-address">Contract Address:</label>
    <input type="text" id="contract-address" placeholder="0xdAC17F958D2ee523a2206206994597C13D831ec7" />
    <label for="precreate-network">Network:</label>
    <select id="precreate-network">
      <option value="ethereum" selected>Ethereum</option>
      <option value="bsc">BSC</option>
      <option value="polygon">Polygon</option>
    </select>
    <div class="button-group">
      <button onclick="testPrecreateToken()" class="test-button">Test</button>
      <button onclick="copyCurlCommand('/coins/precreate-token', {method: 'PUT', body: JSON.stringify({contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', network: 'ethereum'})})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```bash
curl -X PUT "https://cp-merch-dev.wsdemo.online/api/v1/coins/precreate-token" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "network": "ethereum"
  }'
```

**Response:**
```json
{
  "coin": "usdt_erc20",
  "symbol": "USDT",
  "name": "Tether USD",
  "decimals": 6
}
```

### Get Coins

<div class="api-demo">
  <div class="demo-controls">
    <div class="button-group">
      <button onclick="testGetCoins()" class="test-button">Test</button>
      <button onclick="copyCurlCommand('/coins', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/coins" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Response:**
```json
[
  {
    "coin": "btc",
    "name": "Bitcoin",
    "type": "NATIVE",
    "decimals": 8,
    "contractAddress": null,
    "status": "ACTIVE",
    "settings": {
      "useUsdLimits": true,
      "collectThreshold": 0.001,
      "collectServiceToColdThreshold": 1,
      "collectPercentageHot": 10,
      "approveThreshold": 1000000,
      "minValue": 0.0001,
      "maxValue": 10,
      "maxValueDaily": 100,
      "minDepositAmount": 0.0001
    },
    "network": {
      "network": "bitcoin"
    }
  },
  {
    "coin": "eth",
    "name": "Ethereum",
    "type": "NATIVE",
    "decimals": 18,
    "contractAddress": null,
    "status": "ACTIVE",
    "settings": {
      "useUsdLimits": false,
      "collectThreshold": 0.01,
      "collectServiceToColdThreshold": 10,
      "collectPercentageHot": 15,
      "approveThreshold": 1000000,
      "minValue": 0.001,
      "maxValue": 100,
      "maxValueDaily": 1000,
      "minDepositAmount": 0.001
    },
    "network": {
      "network": "ethereum"
    }
  }
]
```

### Get Specific Coin

<div class="api-demo">
  <div class="demo-controls">
    <label for="get-coin-slug">Coin Slug:</label>
    <input type="text" id="get-coin-slug" placeholder="btc" value="btc" />
    <div class="button-group">
      <button onclick="testGetCoin()" class="test-button">Test</button>
      <button onclick="copyCurlCommand('/coins/btc', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/coins/btc" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Response:**
```json
{
  "coin": "btc",
  "name": "Bitcoin",
  "type": "NATIVE",
  "decimals": 8,
  "contractAddress": null,
  "status": "ACTIVE",
  "settings": {
    "useUsdLimits": true,
    "collectThreshold": 0.001,
    "collectServiceToColdThreshold": 1,
    "collectPercentageHot": 10,
    "approveThreshold": 1000000,
    "minValue": 0.0001,
    "maxValue": 10,
    "maxValueDaily": 100,
    "minDepositAmount": 0.0001,
    "collectThresholdUSD": 50,
    "collectServiceToColdThresholdUSD": 50000,
    "approveThresholdUSD": 1000000,
    "minValueUSD": 5,
    "maxValueUSD": 500000,
    "maxValueDailyUSD": 5000000,
    "minDepositAmountUSD": 5
  },
  "network": {
    "network": "bitcoin"
  }
}
```

### Edit Coin

<div class="api-demo">
  <div class="demo-controls">
    <label for="edit-coin-slug">Coin Slug:</label>
    <input type="text" id="edit-coin-slug" placeholder="btc" value="btc" />
    <label for="edit-coin-status">Status:</label>
    <select id="edit-coin-status">
      <option value="ACTIVE" selected>Active</option>
      <option value="INACTIVE">Inactive</option>
    </select>
    <label for="edit-min-value">Min Value:</label>
    <input type="number" id="edit-min-value" placeholder="0.0001" step="0.0001" />
    <div class="button-group">
      <button onclick="testEditCoin()" class="test-button">Test</button>
      <button onclick="copyCurlCommand('/coins', {method: 'PUT', body: JSON.stringify({coin: 'btc', status: 'ACTIVE', minValue: 0.0001})})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```bash
curl -X PUT "https://cp-merch-dev.wsdemo.online/api/v1/coins" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "coin": "btc",
    "status": "ACTIVE",
    "minValue": 0.0001,
    "maxValue": 10,
    "collectThreshold": 0.001
  }'
```

**Response:**
```json
{
  "message": "Coin updated successfully"
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
    // Create coin
    payload := map[string]interface{}{
        "network":         "ethereum",
        "name":           "My Token",
        "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "collectThreshold": 0.001,
        "minValue":       0.0001,
        "maxValue":       1000,
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "https://cp-merch-dev.wsdemo.online/api/v1/coins", bytes.NewBuffer(jsonData))
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
    
    // Get coins list
    req2, _ := http.NewRequest("GET", "https://cp-merch-dev.wsdemo.online/api/v1/coins", nil)
    req2.Header.Set("X-Api-Key", "YOUR_API_KEY")
    
    resp2, err := client.Do(req2)
    if err != nil {
        panic(err)
    }
    defer resp2.Body.Close()
    
    body2, _ := io.ReadAll(resp2.Body)
    fmt.Printf("Coins list: %s\n", body2)
}
```

</div>

<div class="example-block" data-lang="javascript">

### JavaScript Fetch

```javascript
// Create coin
const createCoin = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      network: 'ethereum',
      name: 'My Token',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      collectThreshold: 0.001,
      minValue: 0.0001,
      maxValue: 1000
    })
  });
  
  const result = await response.json();
  console.log('Created coin:', result);
  
  // Get coins list
  const coinsResponse = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
    headers: {
      'X-Api-Key': 'YOUR_API_KEY'
    }
  });
  
  const coins = await coinsResponse.json();
  console.log('Coins list:', coins);
  
  // Get specific coin
  const coinResponse = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins/btc', {
    headers: {
      'X-Api-Key': 'YOUR_API_KEY'
    }
  });
  
  const coin = await coinResponse.json();
  console.log('Bitcoin info:', coin);
  
  // Edit coin
  const editResponse = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
    method: 'PUT',
    headers: {
      'X-Api-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coin: 'btc',
      status: 'ACTIVE',
      minValue: 0.0001
    })
  });
  
  const editResult = await editResponse.json();
  console.log('Edit result:', editResult);
};

createCoin();
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

# Create coin
payload = {
    'network': 'ethereum',
    'name': 'My Token',
    'contractAddress': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'collectThreshold': 0.001,
    'minValue': 0.0001,
    'maxValue': 1000
}

response = requests.post(f'{API_BASE}/coins', 
                        headers=headers, 
                        json=payload)

if response.status_code == 201:
    result = response.json()
    print(f"Created coin: {result['message']}")
    
    # Get coins list
    coins_response = requests.get(f'{API_BASE}/coins', headers=headers)
    
    if coins_response.status_code == 200:
        coins = coins_response.json()
        print(f"Found {len(coins)} coins")
        
        # Get specific coin
        coin_response = requests.get(f'{API_BASE}/coins/btc', headers=headers)
        
        if coin_response.status_code == 200:
            coin = coin_response.json()
            print(f"Bitcoin: {coin['name']}, Status: {coin['status']}")
            
            # Edit coin
            edit_payload = {
                'coin': 'btc',
                'status': 'ACTIVE',
                'minValue': 0.0001
            }
            
            edit_response = requests.put(f'{API_BASE}/coins', 
                                       headers=headers, 
                                       json=edit_payload)
            
            if edit_response.status_code == 200:
                edit_result = edit_response.json()
                print(f"Edit result: {edit_result['message']}")
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

// Create coin
$payload = json_encode([
    'network' => 'ethereum',
    'name' => 'My Token',
    'contractAddress' => '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'collectThreshold' => 0.001,
    'minValue' => 0.0001,
    'maxValue' => 1000
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/coins');
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
    $result = json_decode($response, true);
    echo "Created coin: " . $result['message'] . "\n";
    
    // Get coins list
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_URL, $baseUrl . '/coins');
    curl_setopt($ch2, CURLOPT_HTTPHEADER, [
        'X-Api-Key: ' . $apiKey
    ]);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    
    $coinsResponse = curl_exec($ch2);
    $coinsHttpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    curl_close($ch2);
    
    if ($coinsHttpCode === 200) {
        $coins = json_decode($coinsResponse, true);
        echo "Found " . count($coins) . " coins\n";
        
        // Get specific coin
        $ch3 = curl_init();
        curl_setopt($ch3, CURLOPT_URL, $baseUrl . '/coins/btc');
        curl_setopt($ch3, CURLOPT_HTTPHEADER, [
            'X-Api-Key: ' . $apiKey
        ]);
        curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
        
        $coinResponse = curl_exec($ch3);
        $coinHttpCode = curl_getinfo($ch3, CURLINFO_HTTP_CODE);
        curl_close($ch3);
        
        if ($coinHttpCode === 200) {
            $coin = json_decode($coinResponse, true);
            echo "Bitcoin: " . $coin['name'] . ", Status: " . $coin['status'] . "\n";
        }
    }
} else {
    echo "Error: " . $httpCode . "\n";
}
?>
```

</div>

  </template>
</ApiDoc>

<script>
if (typeof window !== 'undefined') {
  window.testCreateCoin = async function() {
    const apiKey = document.getElementById('api-key').value;
    const network = document.getElementById('coin-network').value;
    const name = document.getElementById('coin-name').value;
    
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }
    
    try {
      const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          network: network,
          name: name || 'My Token',
          collectThreshold: 0.001,
          minValue: 0.0001,
          maxValue: 1000
        })
      });
      
      const result = await response.json();
      alert(`Response (${response.status}): ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      handleApiError(error, '/coins', {method: 'POST', body: JSON.stringify({network: network, name: name || 'My Token'})});
    }
  };
  
  window.testPrecreateToken = async function() {
    const apiKey = document.getElementById('api-key').value;
    const contractAddress = document.getElementById('contract-address').value;
    const network = document.getElementById('precreate-network').value;
    
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }
    
    if (!contractAddress) {
      alert('Please enter contract address');
      return;
    }
    
    try {
      const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins/precreate-token', {
        method: 'PUT',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractAddress: contractAddress,
          network: network
        })
      });
      
      const result = await response.json();
      alert(`Response (${response.status}): ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      handleApiError(error, '/coins/precreate-token', {method: 'PUT', body: JSON.stringify({contractAddress: contractAddress, network: network})});
    }
  };
  
  window.testGetCoins = async function() {
    const apiKey = document.getElementById('api-key').value;
    
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }
    
    try {
      const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
        headers: {
          'X-Api-Key': apiKey
        }
      });
      
      const result = await response.json();
      alert(`Response (${response.status}): ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      handleApiError(error, '/coins', {method: 'GET'});
    }
  };
  
  window.testGetCoin = async function() {
    const apiKey = document.getElementById('api-key').value;
    const coinSlug = document.getElementById('get-coin-slug').value;
    
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }
    
    try {
      const response = await fetch(`https://cp-merch-dev.wsdemo.online/api/v1/coins/${coinSlug}`, {
        headers: {
          'X-Api-Key': apiKey
        }
      });
      
      const result = await response.json();
      alert(`Response (${response.status}): ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      handleApiError(error, `/coins/${coinSlug}`, {method: 'GET'});
    }
  };
  
  window.testEditCoin = async function() {
    const apiKey = document.getElementById('api-key').value;
    const coinSlug = document.getElementById('edit-coin-slug').value;
    const status = document.getElementById('edit-coin-status').value;
    const minValue = document.getElementById('edit-min-value').value;
    
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }
    
    const payload = {
      coin: coinSlug,
      status: status
    };
    
    if (minValue) {
      payload.minValue = parseFloat(minValue);
    }
    
    try {
      const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
        method: 'PUT',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      alert(`Response (${response.status}): ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      handleApiError(error, '/coins', {method: 'PUT', body: JSON.stringify(payload)});
    }
  };
}
</script> 