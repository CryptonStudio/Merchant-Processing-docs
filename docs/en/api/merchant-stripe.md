---
layout: page
---

<ApiDoc>
  <template #content>

# Merchant API - Invoices

The merchant block provides API for managing invoices - creation, retrieval, status changes, and configuration.

::: tip Interactive Testing
On this page you can test the API in real time! Enter your API key in the field below and click the "Test" buttons to send requests to the server `https://cp-merch-dev.wsdemo.online/api`.

**If you encounter CORS errors:**
- Use the "📋 Copy curl" buttons to get ready-to-use commands
- Execute commands in terminal or use Postman
- Install a browser extension to disable CORS (e.g., "CORS Unblock")
:::

## Overview

The invoices API allows you to:
- Create new invoices for payment acceptance
- Retrieve invoice information
- Change invoice status
- Get summary statistics
- Configure invoice parameters

## Authentication

All API requests require authentication via Bearer token in the Authorization header.

<ApiMethod 
  method="POST"
  endpoint="/v1/invoices"
  title="Create Invoice"
  description="Creates a new invoice with a payment address with specified parameters."
  :parameters="[
    { name: 'currency', type: 'string', required: true, description: 'Unique coin identifier (e.g., eth, btc)' },
    { name: 'amount', type: 'number', required: true, description: 'Number of coins in the invoice' },
    { name: 'externalId', type: 'string', required: false, description: 'External ID of the invoice' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Invoice successfully created' },
    { status: '400 Bad Request', description: 'Invalid request parameters' }
  ]"
/>

<ApiMethod 
  method="PUT"
  endpoint="/v1/invoices"
  title="Change Invoice Status"
  description="Changes the status of the specified invoice."
  :parameters="[
    { name: 'invoiceId', type: 'string', required: true, description: 'Invoice ID' },
    { name: 'status', type: 'string', required: true, description: 'New invoice status' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Status successfully changed' },
    { status: '400 Bad Request', description: 'Invalid request parameters' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices/getAll"
  title="Get Invoice List"
  description="Returns a list of all invoices with filtering and pagination options."
  :parameters="[
    { name: 'page', type: 'number', required: false, description: 'Page number (default 1)' },
    { name: 'perPage', type: 'number', required: false, description: 'Items per page (default 20)' },
    { name: 'status', type: 'array', required: false, description: 'Filter by status' },
    { name: 'address', type: 'string', required: false, description: 'Filter by address' },
    { name: 'currency', type: 'string', required: false, description: 'Filter by currency' },
    { name: 'from', type: 'string', required: false, description: 'Start date filter (YYYY-MM-DD)' },
    { name: 'to', type: 'string', required: false, description: 'End date filter (YYYY-MM-DD)' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Invoice list retrieved' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices"
  title="Get Invoice"
  description="Returns information about a specific invoice by its ID."
  :parameters="[
    { name: 'id', type: 'string', required: true, description: 'Invoice ID' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Invoice information retrieved' },
    { status: '400 Bad Request', description: 'Invalid invoice ID' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices/getByExternalId"
  title="Get Invoice by External ID"
  description="Returns information about a specific invoice by its external ID."
  :parameters="[
    { name: 'externalId', type: 'string', required: true, description: 'External invoice ID' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Invoice information retrieved' },
    { status: '400 Bad Request', description: 'Invalid external ID' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices/summary"
  title="Get Summary"
  description="Returns information with the sum of all issued invoices and the sum of all received funds."
  :responses="[
    { status: '200 OK', description: 'Summary information retrieved' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices/configureSettings"
  title="Get Invoice Settings"
  description="Retrieves current invoice configuration settings."
  :responses="[
    { status: '200 OK', description: 'Settings retrieved' }
  ]"
/>

<ApiMethod 
  method="PUT"
  endpoint="/v1/invoices/configureSettings"
  title="Configure Invoice Parameters"
  description="Configures invoice parameters for various networks and currencies."
  :parameters="[
    { name: 'settings', type: 'object', required: true, description: 'Object with invoice settings' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Settings successfully updated' },
    { status: '400 Bad Request', description: 'Invalid parameters' }
  ]"
/>

  </template>

  <template #examples>

<div class="example-block" data-lang="curl">

### Create Invoice

<div class="api-demo">
  <div class="demo-controls">
    <label for="api-key">API Key:</label>
    <input type="text" id="api-key" placeholder="Enter your API key" />
    <label for="invoice-currency">Currency:</label>
    <select id="invoice-currency">
      <option value="btc">BTC</option>
      <option value="eth" selected>ETH</option>
      <option value="usdt">USDT</option>
      <option value="trx">TRX</option>
    </select>
    <label for="invoice-amount">Amount:</label>
    <input type="number" id="invoice-amount" value="0.001" step="0.000001" />
    <button onclick="testCreateInvoice()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/invoices', {method: 'POST', body: JSON.stringify({currency: 'eth', amount: 0.001, externalId: 'demo_123'})})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/invoices" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "eth",
    "amount": 0.001,
    "externalId": "demo_123"
  }'
```

**Response:**
```json
{
  "id": "inv_abc123def456",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "amount": "0.001",
  "currency": "eth",
  "externalId": "demo_123"
}
```

### Get Invoice List

<div class="api-demo">
  <div class="demo-controls">
    <label for="invoices-page">Page:</label>
    <input type="number" id="invoices-page" value="1" min="1" />
    <label for="invoices-perPage">Per Page:</label>
    <select id="invoices-perPage">
      <option value="10">10</option>
      <option value="20" selected>20</option>
      <option value="50">50</option>
    </select>
    <label for="invoices-currency">Currency:</label>
    <select id="invoices-currency">
      <option value="">All</option>
      <option value="btc">BTC</option>
      <option value="eth">ETH</option>
      <option value="usdt">USDT</option>
    </select>
    <button onclick="testGetInvoices()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/invoices/getAll?page=1&perPage=20', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/getAll?page=1&perPage=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "count": 150,
  "data": [
    {
      "id": "inv_abc123def456",
      "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      "amount": "0.001",
      "received": "0.001",
      "currency": "eth",
      "symbol": "ETH",
      "network": "ethereum",
      "status": "completed",
      "createdAt": "2025-01-15T10:30:00Z",
      "externalId": "demo_123",
      "transactions": [
        {
          "id": "tx_123",
          "from": "0x123...",
          "to": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
          "amount": "0.001",
          "hash": "0xabc123...",
          "status": "confirmed",
          "block": 18500000
        }
      ]
    }
  ]
}
```

### Get Invoice by ID

<div class="api-demo">
  <div class="demo-controls">
    <label for="invoice-id">Invoice ID:</label>
    <input type="text" id="invoice-id" placeholder="inv_abc123def456" />
    <button onclick="testGetInvoice()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/invoices?id=inv_abc123def456', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices?id=inv_abc123def456" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Get Invoice by External ID

<div class="api-demo">
  <div class="demo-controls">
    <label for="external-id">External ID:</label>
    <input type="text" id="external-id" placeholder="demo_123" />
    <button onclick="testGetInvoiceByExternalId()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/invoices/getByExternalId?externalId=demo_123', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/getByExternalId?externalId=demo_123" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Get Summary

<div class="api-demo">
  <div class="demo-controls">
    <button onclick="testGetSummary()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/invoices/summary', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/summary" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
[
  {
    "totalAmount": "10.5",
    "totalReceived": "8.3",
    "currencySlug": "btc"
  },
  {
    "totalAmount": "150.0",
    "totalReceived": "142.5",
    "currencySlug": "eth"
  }
]
```

### Change Invoice Status

<div class="api-demo">
  <div class="demo-controls">
    <label for="status-invoice-id">Invoice ID:</label>
    <input type="text" id="status-invoice-id" placeholder="inv_abc123def456" />
    <label for="new-status">New Status:</label>
    <select id="new-status">
      <option value="pending">pending</option>
      <option value="completed">completed</option>
      <option value="cancelled">cancelled</option>
      <option value="expired">expired</option>
    </select>
    <button onclick="testChangeInvoiceStatus()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/invoices', {method: 'PUT', body: JSON.stringify({invoiceId: 'inv_abc123def456', status: 'completed'})})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X PUT "https://cp-merch-dev.wsdemo.online/api/v1/invoices" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "inv_abc123def456",
    "status": "completed"
  }'
```

### Get Invoice Settings

<div class="api-demo">
  <div class="demo-controls">
    <button onclick="testGetInvoiceSettings()" class="test-button">Test</button>
    <button onclick="copyCurlCommand('/invoices/configureSettings', {method: 'GET'})" class="copy-curl-button">📋 Copy curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/configureSettings" \
  -H "Authorization: Bearer YOUR_API_KEY"
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
    "time"
)

func main() {
    // Create new invoice
    payload := map[string]interface{}{
        "currency":   "eth",
        "amount":     0.001,
        "externalId": "demo_123",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "https://cp-merch-dev.wsdemo.online/api/v1/invoices", bytes.NewBuffer(jsonData))
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    fmt.Printf("Created invoice: %s\n", body)
    
    // Get invoice list
    req2, _ := http.NewRequest("GET", "https://cp-merch-dev.wsdemo.online/api/v1/invoices/getAll?page=1&perPage=20", nil)
    req2.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    
    resp2, err := client.Do(req2)
    if err != nil {
        panic(err)
    }
    defer resp2.Body.Close()
    
    body2, _ := io.ReadAll(resp2.Body)
    fmt.Printf("Invoice list: %s\n", body2)
}
```

### Data Structures

```go
// Create invoice request
type CreateInvoiceRequest struct {
    Currency   string  `json:"currency"`
    Amount     float64 `json:"amount"`
    ExternalID string  `json:"externalId,omitempty"`
}

// Created invoice response
type CreatedInvoiceResponse struct {
    ID         string `json:"id"`
    Address    string `json:"address"`
    Amount     string `json:"amount"`
    Currency   string `json:"currency"`
    ExternalID string `json:"externalId"`
}

// Invoice information
type InvoiceResponse struct {
    ID          string        `json:"id"`
    Address     string        `json:"address"`
    Amount      string        `json:"amount"`
    Received    string        `json:"received"`
    Overpayment string        `json:"overpayment,omitempty"`
    Currency    string        `json:"currency"`
    Symbol      string        `json:"symbol"`
    Network     string        `json:"network"`
    Status      string        `json:"status"`
    CreatedAt   time.Time     `json:"createdAt"`
    ExternalID  string        `json:"externalId,omitempty"`
    Transactions []Transaction `json:"transactions"`
}

// Transaction
type Transaction struct {
    ID          string    `json:"id"`
    From        string    `json:"from"`
    To          string    `json:"to"`
    Amount      string    `json:"amount"`
    Hash        string    `json:"hash"`
    Status      string    `json:"status"`
    RateUSD     float64   `json:"rate_USD"`
    Block       int64     `json:"block"`
    CreatedDate time.Time `json:"createdDate"`
}

// Summary
type SummaryResponse struct {
    TotalAmount   string `json:"totalAmount"`
    TotalReceived string `json:"totalReceived"`
    CurrencySlug  string `json:"currencySlug"`
}
```

</div>

<div class="example-block" data-lang="javascript">

### JavaScript Fetch

```javascript
// Create new invoice
const createInvoice = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/invoices', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currency: 'eth',
      amount: 0.001,
      externalId: 'demo_123'
    })
  });
  
  const invoice = await response.json();
  console.log('Created invoice:', invoice);
  
  // Get invoice list
  const listResponse = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/invoices/getAll?page=1&perPage=20', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const invoicesList = await listResponse.json();
  console.log('Found invoices:', invoicesList.count);
  
  // Get invoice by ID
  const invoiceResponse = await fetch(`https://cp-merch-dev.wsdemo.online/api/v1/invoices?id=${invoice.id}`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const invoiceDetails = await invoiceResponse.json();
  console.log('Invoice status:', invoiceDetails.status);
  
  // Get summary
  const summaryResponse = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/invoices/summary', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const summary = await summaryResponse.json();
  summary.forEach(s => {
    console.log(`Currency ${s.currencySlug}: issued ${s.totalAmount}, received ${s.totalReceived}`);
  });
};

createInvoice();
```

### Error Handling

```javascript
try {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/invoices', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currency: 'eth',
      amount: 0.001
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const invoice = await response.json();
  console.log(invoice);
} catch (error) {
  console.error('API error:', error.message);
}
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
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Create new invoice
payload = {
    'currency': 'eth',
    'amount': 0.001,
    'externalId': 'demo_123'
}

response = requests.post(f'{API_BASE}/invoices', 
                        headers=headers, 
                        json=payload)

if response.status_code == 201:
    invoice = response.json()
    print(f"Created invoice: {invoice['id']}, address: {invoice['address']}")
    
    # Get invoice list
    list_response = requests.get(f'{API_BASE}/invoices/getAll?page=1&perPage=20', 
                                headers=headers)
    
    if list_response.status_code == 200:
        invoices_list = list_response.json()
        print(f"Found invoices: {invoices_list['count']}")
    
    # Get invoice by ID
    invoice_response = requests.get(f'{API_BASE}/invoices?id={invoice["id"]}', 
                                   headers=headers)
    
    if invoice_response.status_code == 200:
        invoice_details = invoice_response.json()
        print(f"Invoice status: {invoice_details['status']}")
    
    # Get summary
    summary_response = requests.get(f'{API_BASE}/invoices/summary', 
                                   headers=headers)
    
    if summary_response.status_code == 200:
        summary = summary_response.json()
        for s in summary:
            print(f"Currency {s['currencySlug']}: issued {s['totalAmount']}, received {s['totalReceived']}")
else:
    print(f"Error: {response.status_code}")
```

### Error Handling

```python
try:
    response = requests.post(f'{API_BASE}/invoices', 
                            headers=headers, 
                            json={
                                'currency': 'eth',
                                'amount': 0.001
                            })
    
    response.raise_for_status()  # Raises an HTTPError for bad responses
    invoice = response.json()
    print(invoice)
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except requests.exceptions.RequestException as e:
    print(f"Request error: {e}")
```

</div>

<div class="example-block" data-lang="php">

### PHP cURL

```php
<?php
$apiKey = 'YOUR_API_KEY';
$baseUrl = 'https://cp-merch-dev.wsdemo.online/api/v1';

// Create new invoice
$payload = json_encode([
    'currency' => 'eth',
    'amount' => 0.001,
    'externalId' => 'demo_123'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/invoices');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 201) {
    $invoice = json_decode($response, true);
    echo "Created invoice: " . $invoice['id'] . ", address: " . $invoice['address'] . "\n";
    
    // Get invoice list
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_URL, $baseUrl . '/invoices/getAll?page=1&perPage=20');
    curl_setopt($ch2, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey
    ]);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    
    $listResponse = curl_exec($ch2);
    $listHttpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    curl_close($ch2);
    
    if ($listHttpCode === 200) {
        $invoicesList = json_decode($listResponse, true);
        echo "Found invoices: " . $invoicesList['count'] . "\n";
    }
    
    // Get summary
    $ch3 = curl_init();
    curl_setopt($ch3, CURLOPT_URL, $baseUrl . '/invoices/summary');
    curl_setopt($ch3, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey
    ]);
    curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
    
    $summaryResponse = curl_exec($ch3);
    $summaryHttpCode = curl_getinfo($ch3, CURLINFO_HTTP_CODE);
    curl_close($ch3);
    
    if ($summaryHttpCode === 200) {
        $summary = json_decode($summaryResponse, true);
        foreach ($summary as $s) {
            echo "Currency {$s['currencySlug']}: issued {$s['totalAmount']}, received {$s['totalReceived']}\n";
        }
    }
} else {
    echo "Error: " . $httpCode . "\n";
}
?>
```

### Error Handling

```php
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/invoices');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'currency' => 'eth',
    'amount' => 0.001
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo 'cURL error: ' . curl_error($ch) . "\n";
} elseif ($httpCode >= 400) {
    echo "HTTP error: " . $httpCode . "\n";
    echo "Response: " . $response . "\n";
} else {
    $invoice = json_decode($response, true);
    print_r($invoice);
}

curl_close($ch);
?>
```

</div>

  </template>
</ApiDoc> 