---
layout: page
---

<ApiDoc>
  <template #content>

# API Адресов

API адресов предоставляет функциональность для управления криптовалютными адресами и сервисными кошельками.

::: tip Интерактивное тестирование
Тестируйте API в реальном времени! Введите ваш API ключ и нажимайте кнопки "Тест" для отправки запросов на `https://cp-merch-dev.wsdemo.online/api`.
:::

## Обзор

API адресов позволяет:
- Создавать новые адреса для конкретных сетей и монет
- Получать информацию об адресах и балансах
- Управлять сервисными кошельками

<ApiMethod 
  method="POST"
  endpoint="/v1/addresses"
  title="Создать адрес"
  description="Создает новый адрес для определенной сети и монеты."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Слаг сети (например, bitcoin, ethereum, tron)' },
    { name: 'coin', type: 'string', required: false, description: 'Слаг монеты (опционально)' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Адрес успешно создан' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/addresses/{address}"
  title="Получить адрес"
  description="Возвращает информацию об адресе с балансом."
  :parameters="[
    { name: 'address', type: 'string', required: true, description: 'Криптовалютный адрес' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Информация об адресе получена' }
  ]"
/>

  </template>

  <template #examples>

<!-- API Key Configuration Section -->
<div class="api-key-section">
  <h4>Конфигурация API</h4>
  <div class="api-key-controls">
    <div class="api-key-input-group">
      <label for="global-api-key">API Ключ:</label>
      <input type="text" id="global-api-key" class="api-key-input" placeholder="sk_test_demo_key_12345" />
    </div>
    <button onclick="setGlobalApiKey()" class="set-api-key-button">Установить API Ключ</button>
  </div>
  <div class="api-key-status"></div>
</div>

<div class="example-block" data-lang="curl">

### Создать адрес

<div class="api-demo">
  <div class="demo-controls">
    <label for="address-network">Сеть:</label>
    <select id="address-network">
      <option value="ethereum" selected>Ethereum</option>
      <option value="bitcoin">Bitcoin</option>
    </select>
    <div class="button-group">
      <button onclick="testCreateAddress()" class="test-button">Тест</button>
      <button onclick="copyCurlCommand('/addresses', {method: 'POST', body: JSON.stringify({network: 'ethereum'})})" class="copy-curl-button">📋 Копировать curl</button>
    </div>
  </div>
</div>

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/addresses" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum"
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
    fmt.Printf("Ответ: %s\n", body)
}
```

</div>

<div class="example-block" data-lang="javascript">

### JavaScript Fetch

```javascript
const createAddress = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/addresses', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      network: 'ethereum'
    })
  });
  
  const address = await response.json();
  console.log('Создан адрес:', address);
};

createAddress();
```

</div>

<div class="example-block" data-lang="python">

### Python Requests

```python
import requests
import json

headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}

payload = {'network': 'ethereum'}

response = requests.post('https://cp-merch-dev.wsdemo.online/api/v1/addresses', 
                        headers=headers, 
                        json=payload)

if response.status_code == 201:
    address = response.json()
    print(f"Создан адрес: {address['address']}")
else:
    print(f"Ошибка: {response.status_code}")
```

</div>

<div class="example-block" data-lang="php">

### PHP cURL

```php
<?php
$apiKey = 'YOUR_API_KEY';
$payload = json_encode(['network' => 'ethereum']);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://cp-merch-dev.wsdemo.online/api/v1/addresses');
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
    echo "Создан адрес: " . $address['address'] . "\n";
}
?>
```

</div>

  </template>
</ApiDoc> 