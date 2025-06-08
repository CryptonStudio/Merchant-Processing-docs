---
layout: page
---

<ApiDoc>
  <template #content>

# Withdraws API

The withdraws API provides functionality for initiating cryptocurrency withdrawals and managing withdrawal requests.

::: tip Interactive Testing
Test the API in real time! Enter your API key and click "Test" buttons to send requests to `https://cp-merch-dev.wsdemo.online/api`.
:::

## Overview

The withdraws API allows you to:
- Initiate cryptocurrency withdrawals
- Manage withdrawal requests (admin only)
- Handle multisig withdrawal operations

<ApiMethod 
  method="POST"
  endpoint="/v1/withdraws"
  title="Initiate Withdrawal"
  description="Initiates a cryptocurrency withdrawal to a specified address."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug (e.g., bitcoin, ethereum, tron)' },
    { name: 'coin', type: 'string', required: true, description: 'Coin slug (e.g., btc, eth, usdt)' },
    { name: 'address', type: 'string', required: true, description: 'Destination address' },
    { name: 'amount', type: 'string', required: true, description: 'Amount to withdraw' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Withdrawal initiated successfully' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/withdraws/requests"
  title="Get Withdrawal Requests"
  description="Returns list of pending withdrawal requests. Admin access only."
  :parameters="[
    { name: 'page', type: 'number', required: false, description: 'Page number for pagination' },
    { name: 'limit', type: 'number', required: false, description: 'Number of items per page' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Withdrawal requests retrieved' }
  ]"
/>

  </template>

  <template #examples>

<div class="example-block" data-lang="curl">

### Initiate Withdrawal

<div class="api-demo">
  <div class="demo-controls">
    <label for="api-key">API Key:</label>
    <input type="text" id="api-key" placeholder="Enter your API key" />
    <label for="withdraw-network">Network:</label>
    <select id="withdraw-network">
      <option value="ethereum" selected>Ethereum</option>
      <option value="bitcoin">Bitcoin</option>
    </select>
    <label for="withdraw-amount">Amount:</label>
    <input type="number" id="withdraw-amount" value="100" />
    <button onclick="testInitiateWithdraw()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/withdraws', {method: 'POST', body: JSON.stringify({network: 'ethereum', coin: 'usdt', address: '0x123...', amount: '100'})})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/withdraws" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "coin": "usdt",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "amount": "100.00"
  }'
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
    payload := map[string]string{
        "network": "ethereum",
        "coin":    "usdt",
        "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        "amount":  "100.00",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "https://cp-merch-dev.wsdemo.online/api/v1/withdraws", bytes.NewBuffer(jsonData))
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
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
const initiateWithdrawal = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/withdraws', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      network: 'ethereum',
      coin: 'usdt',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      amount: '100.00'
    })
  });
  
  const withdrawal = await response.json();
  console.log('Withdrawal initiated:', withdrawal);
};

initiateWithdrawal();
```

</div>

<div class="example-block" data-lang="python">

### Python Requests

```python
import requests
import json

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

payload = {
    'network': 'ethereum',
    'coin': 'usdt',
    'address': '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    'amount': '100.00'
}

response = requests.post('https://cp-merch-dev.wsdemo.online/api/v1/withdraws', 
                        headers=headers, 
                        json=payload)

if response.status_code == 201:
    withdrawal = response.json()
    print(f"Withdrawal initiated: {withdrawal['id']}")
else:
    print(f"Error: {response.status_code}")
```

</div>

<div class="example-block" data-lang="php">

### PHP cURL

```php
<?php
$apiKey = 'YOUR_API_KEY';
$payload = json_encode([
    'network' => 'ethereum',
    'coin' => 'usdt',
    'address' => '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    'amount' => '100.00'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://cp-merch-dev.wsdemo.online/api/v1/withdraws');
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
    $withdrawal = json_decode($response, true);
    echo "Withdrawal initiated: " . $withdrawal['id'] . "\n";
}
?>
```

</div>

  </template>
</ApiDoc> 