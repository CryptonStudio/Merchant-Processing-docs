---
layout: page
---

<ApiDoc>
  <template #content>

# Networks API

The networks API provides functionality for managing blockchain networks, their configurations, and Tron-specific operations.

::: tip Interactive Testing
Test the API in real time! Enter your API key and click "Test" buttons to send requests to `https://cp-merch-dev.wsdemo.online/api`.
:::

## Overview

The networks API allows you to:
- Get information about supported blockchain networks
- Configure network parameters (admin only)
- Monitor last processed block numbers
- Manage Tron staking and resources

<ApiMethod 
  method="GET"
  endpoint="/v1/networks"
  title="Get Networks"
  description="Returns list of all supported blockchain networks with their configurations."
  :responses="[
    { status: '200 OK', description: 'Networks list retrieved' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/networks/{network}"
  title="Get Network"
  description="Returns information about a specific blockchain network."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug (e.g., bitcoin, ethereum, tron, bsc)' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Network information retrieved' },
    { status: '400 Bad Request', description: 'Invalid network slug' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/networks/last-number-block/{network}"
  title="Get Last Block Number"
  description="Returns the last processed block number for specified network."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Network slug' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Last block number retrieved' }
  ]"
/>

<ApiMethod 
  method="POST"
  endpoint="/v1/networks/tron/stake"
  title="Stake TRX"
  description="Stakes provided amount of TRX to obtain bandwidth or energy. Admin access only."
  :parameters="[
    { name: 'amount', type: 'string', required: true, description: 'Amount of TRX to stake' },
    { name: 'resource', type: 'string', required: true, description: 'Resource type: BANDWIDTH or ENERGY' }
  ]"
  :responses="[
    { status: '201 Created', description: 'TRX staked successfully' }
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

### Get Networks

<div class="api-demo">
  <div class="demo-controls">
    <div class="button-group">
      <button onclick="testGetNetworks()" class="test-button">Test</button>
      <button onclick="copyCurlCommand('/networks', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
    </div>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/networks" \
  -H "X-Api-Key: YOUR_API_KEY"
```

</div>

<div class="example-block" data-lang="go">

### Go HTTP Client

```go
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    req, _ := http.NewRequest("GET", "https://cp-merch-dev.wsdemo.online/api/v1/networks", nil)
    req.Header.Set("X-Api-Key", "YOUR_API_KEY")
    
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
const getNetworks = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/networks', {
    headers: {
      'X-Api-Key': 'YOUR_API_KEY'
    }
  });
  
  const networks = await response.json();
  console.log('Networks:', networks);
};

getNetworks();
```

</div>

<div class="example-block" data-lang="python">

### Python Requests

```python
import requests

headers = {
    'X-Api-Key': 'YOUR_API_KEY'
}

response = requests.get('https://cp-merch-dev.wsdemo.online/api/v1/networks', 
                       headers=headers)

if response.status_code == 200:
    networks = response.json()
    print(f"Found {len(networks)} networks")
else:
    print(f"Error: {response.status_code}")
```

</div>

<div class="example-block" data-lang="php">

### PHP cURL

```php
<?php
$apiKey = 'YOUR_API_KEY';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://cp-merch-dev.wsdemo.online/api/v1/networks');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-Api-Key: ' . $apiKey
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $networks = json_decode($response, true);
    echo "Found " . count($networks) . " networks\n";
}
?>
```

</div>

  </template>
</ApiDoc> 