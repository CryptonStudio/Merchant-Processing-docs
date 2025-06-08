---
layout: page
---

<ApiDoc>
  <template #content>

# API Выводов

API выводов предоставляет функциональность для инициации выводов криптовалют и управления запросами на вывод.

::: tip Интерактивное тестирование
Тестируйте API в реальном времени! Введите ваш API ключ и нажимайте кнопки "Тест" для отправки запросов на `https://cp-merch-dev.wsdemo.online/api`.
:::

## Обзор

API выводов позволяет:
- Инициировать выводы криптовалют
- Управлять запросами на вывод (только админ)
- Обрабатывать мультисиг операции вывода

<ApiMethod 
  method="POST"
  endpoint="/v1/withdraws"
  title="Инициировать вывод"
  description="Инициирует вывод криптовалюты на указанный адрес."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Слаг сети (например, bitcoin, ethereum, tron)' },
    { name: 'coin', type: 'string', required: true, description: 'Слаг монеты (например, btc, eth, usdt)' },
    { name: 'address', type: 'string', required: true, description: 'Адрес назначения' },
    { name: 'amount', type: 'string', required: true, description: 'Сумма для вывода' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Вывод успешно инициирован' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/withdraws/requests"
  title="Получить запросы на вывод"
  description="Возвращает список ожидающих запросов на вывод. Только для админов."
  :parameters="[
    { name: 'page', type: 'number', required: false, description: 'Номер страницы для пагинации' },
    { name: 'limit', type: 'number', required: false, description: 'Количество элементов на странице' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Запросы на вывод получены' }
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

### Инициировать вывод

<div class="api-demo">
  <div class="demo-controls">
    <label for="withdraw-network">Сеть:</label>
    <select id="withdraw-network">
      <option value="ethereum" selected>Ethereum</option>
      <option value="bitcoin">Bitcoin</option>
    </select>
    <label for="withdraw-amount">Сумма:</label>
    <input type="number" id="withdraw-amount" value="100" />
    <div class="button-group">
      <button onclick="testInitiateWithdraw()" class="test-button">Тест</button>
      <button onclick="copyCurlCommand('/withdraws', {method: 'POST', body: JSON.stringify({network: 'ethereum', coin: 'usdt', address: '0x123...', amount: '100'})})" class="copy-curl-button">📋 Копировать curl</button>
    </div>
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
const initiateWithdrawal = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/withdraws', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'YOUR_API_KEY',
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
  console.log('Вывод инициирован:', withdrawal);
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
    'X-Api-Key': 'YOUR_API_KEY',
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
    print(f"Вывод инициирован: {withdrawal['id']}")
else:
    print(f"Ошибка: {response.status_code}")
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
    echo "Вывод инициирован: " . $withdrawal['id'] . "\n";
}
?>
```

</div>

  </template>
</ApiDoc> 