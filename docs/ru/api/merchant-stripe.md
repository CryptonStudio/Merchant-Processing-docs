---
layout: page
---

<ApiDoc>
  <template #content>

# API Мерчанта - Инвойсы

Блок merchant предоставляет API для управления инвойсами (счетами) - создание, получение, изменение статуса и настройка параметров.

::: tip Интерактивное тестирование
На этой странице вы можете протестировать API в реальном времени! Введите ваш API ключ в поле ниже и нажимайте кнопки "Тестировать" для отправки запросов к серверу `https://cp-merch-dev.wsdemo.online/api`.

**Если возникает CORS ошибка:**
- Используйте кнопки "📋 Копировать curl" для получения готовых команд
- Выполните команды в терминале или используйте Postman
- Установите расширение браузера для отключения CORS (например, "CORS Unblock")
:::

## Обзор

API инвойсов позволяет:
- Создавать новые инвойсы для приема платежей
- Получать информацию об инвойсах
- Изменять статус инвойсов
- Получать сводную статистику
- Настраивать параметры инвойсов

## Аутентификация

Все запросы к API требуют аутентификации через Bearer токен в заголовке Authorization.

<ApiMethod 
  method="POST"
  endpoint="/v1/invoices"
  title="Создать инвойс"
  description="Создает новый инвойс с адресом для приема платежа с указанными параметрами."
  :parameters="[
    { name: 'currency', type: 'string', required: true, description: 'Уникальный идентификатор монеты (например, eth, btc)' },
    { name: 'amount', type: 'number', required: true, description: 'Количество монет в инвойсе' },
    { name: 'externalId', type: 'string', required: false, description: 'Внешний ID инвойса' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Инвойс успешно создан' },
    { status: '400 Bad Request', description: 'Неверные параметры запроса' }
  ]"
/>

<ApiMethod 
  method="PUT"
  endpoint="/v1/invoices"
  title="Изменить статус инвойса"
  description="Изменяет статус указанного инвойса."
  :parameters="[
    { name: 'invoiceId', type: 'string', required: true, description: 'ID инвойса' },
    { name: 'status', type: 'string', required: true, description: 'Новый статус инвойса' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Статус успешно изменен' },
    { status: '400 Bad Request', description: 'Неверные параметры запроса' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices/getAll"
  title="Получить список инвойсов"
  description="Возвращает список всех инвойсов с возможностью фильтрации и пагинации."
  :parameters="[
    { name: 'page', type: 'number', required: false, description: 'Номер страницы (по умолчанию 1)' },
    { name: 'perPage', type: 'number', required: false, description: 'Количество элементов на странице (по умолчанию 20)' },
    { name: 'status', type: 'array', required: false, description: 'Фильтр по статусу' },
    { name: 'address', type: 'string', required: false, description: 'Фильтр по адресу' },
    { name: 'currency', type: 'string', required: false, description: 'Фильтр по валюте' },
    { name: 'from', type: 'string', required: false, description: 'Дата начала фильтра (YYYY-MM-DD)' },
    { name: 'to', type: 'string', required: false, description: 'Дата окончания фильтра (YYYY-MM-DD)' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Список инвойсов получен' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices"
  title="Получить инвойс"
  description="Возвращает информацию о конкретном инвойсе по его ID."
  :parameters="[
    { name: 'id', type: 'string', required: true, description: 'ID инвойса' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Информация об инвойсе получена' },
    { status: '400 Bad Request', description: 'Неверный ID инвойса' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices/getByExternalId"
  title="Получить инвойс по внешнему ID"
  description="Возвращает информацию о конкретном инвойсе по его внешнему ID."
  :parameters="[
    { name: 'externalId', type: 'string', required: true, description: 'Внешний ID инвойса' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Информация об инвойсе получена' },
    { status: '400 Bad Request', description: 'Неверный внешний ID' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices/summary"
  title="Получить сводку"
  description="Возвращает информацию с суммой всех выставленных инвойсов и суммой всех полученных средств."
  :responses="[
    { status: '200 OK', description: 'Сводная информация получена' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/invoices/configureSettings"
  title="Получить настройки инвойсов"
  description="Получает текущие настройки конфигурации инвойсов."
  :responses="[
    { status: '200 OK', description: 'Настройки получены' }
  ]"
/>

<ApiMethod 
  method="PUT"
  endpoint="/v1/invoices/configureSettings"
  title="Настроить параметры инвойсов"
  description="Настраивает параметры инвойсов для различных сетей и валют."
  :parameters="[
    { name: 'settings', type: 'object', required: true, description: 'Объект с настройками инвойсов' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Настройки успешно обновлены' },
    { status: '400 Bad Request', description: 'Неверные параметры' }
  ]"
/>

  </template>

  <template #examples>

<div class="example-block" data-lang="curl">

### Создать инвойс

<div class="api-demo">
  <div class="demo-controls">
    <label for="api-key">API Key:</label>
    <input type="text" id="api-key" placeholder="Введите ваш API ключ" />
    <label for="invoice-currency">Валюта:</label>
    <select id="invoice-currency">
      <option value="btc">BTC</option>
      <option value="eth" selected>ETH</option>
      <option value="usdt">USDT</option>
      <option value="trx">TRX</option>
    </select>
    <label for="invoice-amount">Сумма:</label>
    <input type="number" id="invoice-amount" value="0.001" step="0.000001" />
    <button onclick="testCreateInvoice()" class="test-button">Тестировать</button>
    <button onclick="copyCurlCommand('/invoices', {method: 'POST', body: JSON.stringify({currency: 'eth', amount: 0.001, externalId: 'demo_123'})})" class="copy-curl-button">📋 Копировать curl</button>
  </div>
</div>

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/invoices" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "eth",
    "amount": 0.001,
    "externalId": "demo_123"
  }'
```

**Ответ:**
```json
{
  "id": "inv_abc123def456",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "amount": "0.001",
  "currency": "eth",
  "externalId": "demo_123"
}
```

### Получить список инвойсов

<div class="api-demo">
  <div class="demo-controls">
    <label for="invoices-page">Страница:</label>
    <input type="number" id="invoices-page" value="1" min="1" />
    <label for="invoices-perPage">На странице:</label>
    <select id="invoices-perPage">
      <option value="10">10</option>
      <option value="20" selected>20</option>
      <option value="50">50</option>
    </select>
    <label for="invoices-currency">Валюта:</label>
    <select id="invoices-currency">
      <option value="">Все</option>
      <option value="btc">BTC</option>
      <option value="eth">ETH</option>
      <option value="usdt">USDT</option>
    </select>
    <button onclick="testGetInvoices()" class="test-button">Тестировать</button>
    <button onclick="copyCurlCommand('/invoices/getAll?page=1&perPage=20', {method: 'GET'})" class="copy-curl-button">📋 Копировать curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/getAll?page=1&perPage=20" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Ответ:**
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

### Получить инвойс по ID

<div class="api-demo">
  <div class="demo-controls">
    <label for="invoice-id">ID инвойса:</label>
    <input type="text" id="invoice-id" placeholder="inv_abc123def456" />
    <button onclick="testGetInvoice()" class="test-button">Тестировать</button>
    <button onclick="copyCurlCommand('/invoices?id=inv_abc123def456', {method: 'GET'})" class="copy-curl-button">📋 Копировать curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices?id=inv_abc123def456" \
  -H "X-Api-Key: YOUR_API_KEY"
```

### Получить инвойс по внешнему ID

<div class="api-demo">
  <div class="demo-controls">
    <label for="external-id">Внешний ID:</label>
    <input type="text" id="external-id" placeholder="demo_123" />
    <button onclick="testGetInvoiceByExternalId()" class="test-button">Тестировать</button>
    <button onclick="copyCurlCommand('/invoices/getByExternalId?externalId=demo_123', {method: 'GET'})" class="copy-curl-button">📋 Копировать curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/getByExternalId?externalId=demo_123" \
  -H "X-Api-Key: YOUR_API_KEY"
```

### Получить сводку

<div class="api-demo">
  <div class="demo-controls">
    <button onclick="testGetSummary()" class="test-button">Тестировать</button>
    <button onclick="copyCurlCommand('/invoices/summary', {method: 'GET'})" class="copy-curl-button">📋 Копировать curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/summary" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Ответ:**
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

### Изменить статус инвойса

<div class="api-demo">
  <div class="demo-controls">
    <label for="status-invoice-id">ID инвойса:</label>
    <input type="text" id="status-invoice-id" placeholder="inv_abc123def456" />
    <label for="new-status">Новый статус:</label>
    <select id="new-status">
      <option value="pending">pending</option>
      <option value="completed">completed</option>
      <option value="cancelled">cancelled</option>
      <option value="expired">expired</option>
    </select>
    <button onclick="testChangeInvoiceStatus()" class="test-button">Тестировать</button>
    <button onclick="copyCurlCommand('/invoices', {method: 'PUT', body: JSON.stringify({invoiceId: 'inv_abc123def456', status: 'completed'})})" class="copy-curl-button">📋 Копировать curl</button>
  </div>
</div>

```bash
curl -X PUT "https://cp-merch-dev.wsdemo.online/api/v1/invoices" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "inv_abc123def456",
    "status": "completed"
  }'
```

### Получить настройки инвойсов

<div class="api-demo">
  <div class="demo-controls">
    <button onclick="testGetInvoiceSettings()" class="test-button">Тестировать</button>
    <button onclick="copyCurlCommand('/invoices/configureSettings', {method: 'GET'})" class="copy-curl-button">📋 Копировать curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/invoices/configureSettings" \
  -H "X-Api-Key: YOUR_API_KEY"
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
    // Создать новый инвойс
    payload := map[string]interface{}{
        "currency":   "eth",
        "amount":     0.001,
        "externalId": "demo_123",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "https://cp-merch-dev.wsdemo.online/api/v1/invoices", bytes.NewBuffer(jsonData))
    req.Header.Set("X-Api-Key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    fmt.Printf("Создан инвойс: %s\n", body)
    
    // Получить список инвойсов
    req2, _ := http.NewRequest("GET", "https://cp-merch-dev.wsdemo.online/api/v1/invoices/getAll?page=1&perPage=20", nil)
    req2.Header.Set("X-Api-Key", "YOUR_API_KEY")
    
    resp2, err := client.Do(req2)
    if err != nil {
        panic(err)
    }
    defer resp2.Body.Close()
    
    body2, _ := io.ReadAll(resp2.Body)
    fmt.Printf("Список инвойсов: %s\n", body2)
}
```

### Структуры данных

```go
// Запрос на создание инвойса
type CreateInvoiceRequest struct {
    Currency   string  `json:"currency"`
    Amount     float64 `json:"amount"`
    ExternalID string  `json:"externalId,omitempty"`
}

// Ответ при создании инвойса
type CreatedInvoiceResponse struct {
    ID         string `json:"id"`
    Address    string `json:"address"`
    Amount     string `json:"amount"`
    Currency   string `json:"currency"`
    ExternalID string `json:"externalId"`
}

// Информация об инвойсе
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

// Транзакция
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

// Сводка
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
// Создать новый инвойс
const createInvoice = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/invoices', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currency: 'eth',
      amount: 0.001,
      externalId: 'demo_123'
    })
  });
  
  const invoice = await response.json();
  console.log('Создан инвойс:', invoice);
  
  // Получить список инвойсов
  const listResponse = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/invoices/getAll?page=1&perPage=20', {
    headers: {
      'X-Api-Key': 'YOUR_API_KEY'
    }
  });
  
  const invoicesList = await listResponse.json();
  console.log('Найдено инвойсов:', invoicesList.count);
  
  // Получить инвойс по ID
  const invoiceResponse = await fetch(`https://cp-merch-dev.wsdemo.online/api/v1/invoices?id=${invoice.id}`, {
    headers: {
      'X-Api-Key': 'YOUR_API_KEY'
    }
  });
  
  const invoiceDetails = await invoiceResponse.json();
  console.log('Статус инвойса:', invoiceDetails.status);
  
  // Получить сводку
  const summaryResponse = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/invoices/summary', {
    headers: {
      'X-Api-Key': 'YOUR_API_KEY'
    }
  });
  
  const summary = await summaryResponse.json();
  summary.forEach(s => {
    console.log(`Валюта ${s.currencySlug}: выставлено ${s.totalAmount}, получено ${s.totalReceived}`);
  });
};

createInvoice();
```

### Обработка ошибок

```javascript
try {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/invoices', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currency: 'eth',
      amount: 0.001
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ошибка! статус: ${response.status}`);
  }
  
  const invoice = await response.json();
  console.log(invoice);
} catch (error) {
  console.error('Ошибка API:', error.message);
}
```

</div>

<div class="example-block" data-lang="python">

### Python Requests

```python
import requests
import json

# Конфигурация API
API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1'
headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Создать новый инвойс
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
    print(f"Создан инвойс: {invoice['id']}, адрес: {invoice['address']}")
    
    # Получить список инвойсов
    list_response = requests.get(f'{API_BASE}/invoices/getAll?page=1&perPage=20', 
                                headers=headers)
    
    if list_response.status_code == 200:
        invoices_list = list_response.json()
        print(f"Найдено инвойсов: {invoices_list['count']}")
    
    # Получить инвойс по ID
    invoice_response = requests.get(f'{API_BASE}/invoices?id={invoice["id"]}', 
                                   headers=headers)
    
    if invoice_response.status_code == 200:
        invoice_details = invoice_response.json()
        print(f"Статус инвойса: {invoice_details['status']}")
    
    # Получить сводку
    summary_response = requests.get(f'{API_BASE}/invoices/summary', 
                                   headers=headers)
    
    if summary_response.status_code == 200:
        summary = summary_response.json()
        for s in summary:
            print(f"Валюта {s['currencySlug']}: выставлено {s['totalAmount']}, получено {s['totalReceived']}")
else:
    print(f"Ошибка: {response.status_code}")
```

### Обработка ошибок

```python
try:
    response = requests.post(f'{API_BASE}/invoices', 
                            headers=headers, 
                            json={
                                'currency': 'eth',
                                'amount': 0.001
                            })
    
    response.raise_for_status()  # Вызывает HTTPError для плохих ответов
    invoice = response.json()
    print(invoice)
except requests.exceptions.HTTPError as e:
    print(f"HTTP ошибка: {e}")
except requests.exceptions.RequestException as e:
    print(f"Ошибка запроса: {e}")
```

</div>

<div class="example-block" data-lang="php">

### PHP cURL

```php
<?php
$apiKey = 'YOUR_API_KEY';
$baseUrl = 'https://cp-merch-dev.wsdemo.online/api/v1';

// Создать новый инвойс
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
    'X-Api-Key: ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 201) {
    $invoice = json_decode($response, true);
    echo "Создан инвойс: " . $invoice['id'] . ", адрес: " . $invoice['address'] . "\n";
    
    // Получить список инвойсов
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_URL, $baseUrl . '/invoices/getAll?page=1&perPage=20');
    curl_setopt($ch2, CURLOPT_HTTPHEADER, [
        'X-Api-Key: ' . $apiKey
    ]);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    
    $listResponse = curl_exec($ch2);
    $listHttpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    curl_close($ch2);
    
    if ($listHttpCode === 200) {
        $invoicesList = json_decode($listResponse, true);
        echo "Найдено инвойсов: " . $invoicesList['count'] . "\n";
    }
    
    // Получить сводку
    $ch3 = curl_init();
    curl_setopt($ch3, CURLOPT_URL, $baseUrl . '/invoices/summary');
    curl_setopt($ch3, CURLOPT_HTTPHEADER, [
        'X-Api-Key: ' . $apiKey
    ]);
    curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
    
    $summaryResponse = curl_exec($ch3);
    $summaryHttpCode = curl_getinfo($ch3, CURLINFO_HTTP_CODE);
    curl_close($ch3);
    
    if ($summaryHttpCode === 200) {
        $summary = json_decode($summaryResponse, true);
        foreach ($summary as $s) {
            echo "Валюта {$s['currencySlug']}: выставлено {$s['totalAmount']}, получено {$s['totalReceived']}\n";
        }
    }
} else {
    echo "Ошибка: " . $httpCode . "\n";
}
?>
```

### Обработка ошибок

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
    'X-Api-Key: ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo 'cURL ошибка: ' . curl_error($ch) . "\n";
} elseif ($httpCode >= 400) {
    echo "HTTP ошибка: " . $httpCode . "\n";
    echo "Ответ: " . $response . "\n";
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