---
layout: page
---

<ApiDoc>
  <template #content>

# API управления монетами

API управления монетами предоставляет функциональность для управления криптовалютными монетами и токенами в различных блокчейн-сетях.

::: tip Интерактивное тестирование
Тестируйте API в реальном времени! Введите ваш API ключ и нажимайте кнопки "Тест" для отправки запросов на `https://cp-merch-dev.wsdemo.online/api`.
:::

## Обзор

API управления монетами позволяет:
- Создавать новые монеты и токены
- Предварительно создавать токены из адресов контрактов
- Редактировать настройки и статус монет
- Получать информацию о монетах и их конфигурациях

<ApiMethod 
  method="POST"
  endpoint="/v1/coins"
  title="Создать монету"
  description="Создает новую монету или токен. Только для администраторов."
  :parameters="[
    { name: 'coin', type: 'string', required: false, description: 'Уникальный идентификатор монеты (генерируется автоматически, если не указан)' },
    { name: 'name', type: 'string', required: false, description: 'Название монеты или токена (определяется автоматически из контракта, если не указано)' },
    { name: 'contractAddress', type: 'string', required: false, description: 'Адрес контракта токена (только для токенов)' },
    { name: 'network', type: 'string', required: true, description: 'Слаг сети (например, ethereum, bitcoin, tron)' },
    { name: 'useUsdLimits', type: 'boolean', required: false, description: 'Использовать USD лимиты для расчетов и транзакций' },
    { name: 'collectThreshold', type: 'number', required: false, description: 'Минимальная сумма для перевода на сервисный кошелек' },
    { name: 'collectServiceToColdThreshold', type: 'number', required: false, description: 'Минимальная сумма для перевода с сервисного на холодный кошелек' },
    { name: 'collectPercentageHot', type: 'number', required: false, description: 'Процент монет, собираемых на горячем кошельке' },
    { name: 'approveThreshold', type: 'number', required: false, description: 'Объем подтверждения для переводов на сервисный кошелек' },
    { name: 'minValue', type: 'number', required: false, description: 'Минимально возможная сумма для разового вывода' },
    { name: 'maxValue', type: 'number', required: false, description: 'Максимально возможная сумма для разового вывода' },
    { name: 'maxValueDaily', type: 'number', required: false, description: 'Максимально возможный вывод за 24 часа' },
    { name: 'minDepositAmount', type: 'number', required: false, description: 'Минимальная сумма для депозита' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Монета успешно создана' },
    { status: '400 Bad Request', description: 'Неверные параметры' }
  ]"
/>

<ApiMethod 
  method="PUT"
  endpoint="/v1/coins/precreate-token"
  title="Предварительно создать токен"
  description="Предварительно создает токен, анализируя его адрес контракта. Только для администраторов."
  :parameters="[
    { name: 'contractAddress', type: 'string', required: true, description: 'Адрес контракта токена' },
    { name: 'network', type: 'string', required: true, description: 'Слаг сети (например, ethereum, bsc, polygon)' }
  ]"
  :responses="[
    { status: '201 Created', description: 'Токен успешно предварительно создан' },
    { status: '400 Bad Request', description: 'Неверный адрес контракта или сеть' }
  ]"
/>

<ApiMethod 
  method="PUT"
  endpoint="/v1/coins"
  title="Редактировать монету"
  description="Редактирует настройки и статус монеты или токена. Может использоваться для активации/деактивации монет. Только для администраторов."
  :parameters="[
    { name: 'coin', type: 'string', required: true, description: 'Уникальный идентификатор монеты' },
    { name: 'name', type: 'string', required: false, description: 'Название монеты или токена' },
    { name: 'status', type: 'string', required: false, description: 'Статус монеты (ACTIVE, INACTIVE)' },
    { name: 'useUsdLimits', type: 'boolean', required: false, description: 'Использовать USD лимиты для расчетов и транзакций' },
    { name: 'collectThreshold', type: 'number', required: false, description: 'Минимальная сумма для перевода на сервисный кошелек' },
    { name: 'collectServiceToColdThreshold', type: 'number', required: false, description: 'Минимальная сумма для перевода с сервисного на холодный кошелек' },
    { name: 'collectPercentageHot', type: 'number', required: false, description: 'Процент монет, собираемых на горячем кошельке' },
    { name: 'approveThreshold', type: 'number', required: false, description: 'Объем подтверждения для переводов на сервисный кошелек' },
    { name: 'minValue', type: 'number', required: false, description: 'Минимально возможная сумма для разового вывода' },
    { name: 'maxValue', type: 'number', required: false, description: 'Максимально возможная сумма для разового вывода' },
    { name: 'maxValueDaily', type: 'number', required: false, description: 'Максимально возможный вывод за 24 часа' },
    { name: 'minDepositAmount', type: 'number', required: false, description: 'Минимальная сумма для депозита' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Монета успешно обновлена' },
    { status: '400 Bad Request', description: 'Неверные параметры' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/coins"
  title="Получить монеты"
  description="Возвращает список всех доступных монет и токенов."
  :responses="[
    { status: '200 OK', description: 'Список монет получен' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/coins/{coin}"
  title="Получить монету"
  description="Возвращает информацию о конкретной монете или токене."
  :parameters="[
    { name: 'coin', type: 'string', required: true, description: 'Слаг монеты (например, btc, eth, usdt)' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Информация о монете получена' },
    { status: '400 Bad Request', description: 'Неверный слаг монеты' }
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

### Создать монету

<div class="api-demo">
  <div class="demo-controls">
    <label for="api-key">API ключ:</label>
    <input type="text" id="api-key" placeholder="Введите ваш API ключ" />
    <label for="coin-network">Сеть:</label>
    <select id="coin-network">
      <option value="ethereum" selected>Ethereum</option>
      <option value="bitcoin">Bitcoin</option>
      <option value="tron">Tron</option>
      <option value="bsc">BSC</option>
    </select>
    <label for="coin-name">Название монеты:</label>
    <input type="text" id="coin-name" placeholder="Мой токен" />
    <div class="button-group">
      <button onclick="testCreateCoin()" class="test-button">Тест</button>
      <button onclick="copyCurlCommand('/coins', {method: 'POST', body: JSON.stringify({network: 'ethereum', name: 'Мой токен'})})" class="copy-curl-button">📋 Копировать curl</button>
    </div>
  </div>
</div>

```bash
curl -X POST "https://cp-merch-dev.wsdemo.online/api/v1/coins" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "name": "Мой токен",
    "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "collectThreshold": 0.001,
    "minValue": 0.0001,
    "maxValue": 1000
  }'
```

**Ответ:**
```json
{
  "message": "Coin created successfully"
}
```

### Предварительно создать токен

<div class="api-demo">
  <div class="demo-controls">
    <label for="contract-address">Адрес контракта:</label>
    <input type="text" id="contract-address" placeholder="0xdAC17F958D2ee523a2206206994597C13D831ec7" />
    <label for="precreate-network">Сеть:</label>
    <select id="precreate-network">
      <option value="ethereum" selected>Ethereum</option>
      <option value="bsc">BSC</option>
      <option value="polygon">Polygon</option>
    </select>
    <div class="button-group">
      <button onclick="testPrecreateToken()" class="test-button">Тест</button>
      <button onclick="copyCurlCommand('/coins/precreate-token', {method: 'PUT', body: JSON.stringify({contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', network: 'ethereum'})})" class="copy-curl-button">📋 Копировать curl</button>
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

**Ответ:**
```json
{
  "coin": "usdt_erc20",
  "symbol": "USDT",
  "name": "Tether USD",
  "decimals": 6
}
```

### Получить монеты

<div class="api-demo">
  <div class="demo-controls">
    <div class="button-group">
      <button onclick="testGetCoins()" class="test-button">Тест</button>
      <button onclick="copyCurlCommand('/coins', {method: 'GET'})" class="copy-curl-button">📋 Копировать curl</button>
    </div>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/coins" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Ответ:**
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
  }
]
```

</div>

<div class="example-block" data-lang="javascript">

### JavaScript Fetch

```javascript
// Создать монету
const createCoin = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      network: 'ethereum',
      name: 'Мой токен',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      collectThreshold: 0.001,
      minValue: 0.0001,
      maxValue: 1000
    })
  });
  
  const result = await response.json();
  console.log('Создана монета:', result);
};

createCoin();
```

</div>

<div class="example-block" data-lang="python">

### Python Requests

```python
import requests

# Конфигурация API
API_BASE = 'https://cp-merch-dev.wsdemo.online/api/v1'
headers = {
    'X-Api-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Создать монету
payload = {
    'network': 'ethereum',
    'name': 'Мой токен',
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
    print(f"Создана монета: {result['message']}")
else:
    print(f"Ошибка: {response.status_code}")
```

</div>

<div class="example-block" data-lang="go">

### Go HTTP клиент

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
    // Создать монету
    payload := map[string]interface{}{
        "network":         "ethereum",
        "name":           "Мой токен",
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
    fmt.Printf("Ответ: %s\n", body)
}
```

</div>

<div class="example-block" data-lang="php">

### PHP cURL

```php
<?php
$apiKey = 'YOUR_API_KEY';
$baseUrl = 'https://cp-merch-dev.wsdemo.online/api/v1';

// Создать монету
$payload = json_encode([
    'network' => 'ethereum',
    'name' => 'Мой токен',
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
    echo "Создана монета: " . $result['message'] . "\n";
} else {
    echo "Ошибка: " . $httpCode . "\n";
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
      alert('Пожалуйста, введите ваш API ключ');
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
          name: name || 'Мой токен',
          collectThreshold: 0.001,
          minValue: 0.0001,
          maxValue: 1000
        })
      });
      
      const result = await response.json();
      alert(`Ответ (${response.status}): ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      handleApiError(error, '/coins', {method: 'POST', body: JSON.stringify({network: network, name: name || 'Мой токен'})});
    }
  };
  
  window.testPrecreateToken = async function() {
    const apiKey = document.getElementById('api-key').value;
    const contractAddress = document.getElementById('contract-address').value;
    const network = document.getElementById('precreate-network').value;
    
    if (!apiKey) {
      alert('Пожалуйста, введите ваш API ключ');
      return;
    }
    
    if (!contractAddress) {
      alert('Пожалуйста, введите адрес контракта');
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
      alert(`Ответ (${response.status}): ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      handleApiError(error, '/coins/precreate-token', {method: 'PUT', body: JSON.stringify({contractAddress: contractAddress, network: network})});
    }
  };
  
  window.testGetCoins = async function() {
    const apiKey = document.getElementById('api-key').value;
    
    if (!apiKey) {
      alert('Пожалуйста, введите ваш API ключ');
      return;
    }
    
    try {
      const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/coins', {
        headers: {
          'X-Api-Key': apiKey
        }
      });
      
      const result = await response.json();
      alert(`Ответ (${response.status}): ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      handleApiError(error, '/coins', {method: 'GET'});
    }
  };
}
</script>
