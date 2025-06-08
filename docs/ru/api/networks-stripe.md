---
layout: page
---

<ApiDoc>
  <template #content>

# API Сетей

API сетей предоставляет функциональность для управления блокчейн сетями и их конфигурациями.

::: tip Интерактивное тестирование
Тестируйте API в реальном времени! Введите ваш API ключ и нажимайте кнопки "Тест" для отправки запросов на `https://cp-merch-dev.wsdemo.online/api`.
:::

## Обзор

API сетей позволяет:
- Получать информацию о поддерживаемых блокчейн сетях
- Конфигурировать параметры сетей (только админ)
- Отслеживать последние обработанные номера блоков

<ApiMethod 
  method="GET"
  endpoint="/v1/networks"
  title="Получить сети"
  description="Возвращает список всех поддерживаемых блокчейн сетей с их конфигурациями."
  :responses="[
    { status: '200 OK', description: 'Список сетей получен' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/networks/{network}"
  title="Получить сеть"
  description="Возвращает информацию о конкретной блокчейн сети."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Слаг сети (например, bitcoin, ethereum, tron, bsc)' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Информация о сети получена' },
    { status: '400 Bad Request', description: 'Неверный слаг сети' }
  ]"
/>

<ApiMethod 
  method="GET"
  endpoint="/v1/networks/last-number-block/{network}"
  title="Получить номер последнего блока"
  description="Возвращает номер последнего обработанного блока для указанной сети."
  :parameters="[
    { name: 'network', type: 'string', required: true, description: 'Слаг сети' }
  ]"
  :responses="[
    { status: '200 OK', description: 'Номер последнего блока получен' }
  ]"
/>

<ApiMethod 
  method="POST"
  endpoint="/v1/networks/tron/stake"
  title="Застейкать TRX"
  description="Стейкает указанное количество TRX для получения пропускной способности или энергии. Только для админов."
  :parameters="[
    { name: 'amount', type: 'string', required: true, description: 'Количество TRX для стейкинга' },
    { name: 'resource', type: 'string', required: true, description: 'Тип ресурса: BANDWIDTH или ENERGY' }
  ]"
  :responses="[
    { status: '201 Created', description: 'TRX успешно застейкан' }
  ]"
/>

  </template>

  <template #examples>

<div class="example-block" data-lang="curl">

### Получить сети

<div class="api-demo">
  <div class="demo-controls">
    <label for="api-key">API Ключ:</label>
    <input type="text" id="api-key" placeholder="Введите ваш API ключ" />
    <button onclick="testGetNetworks()" class="test-button">Тест</button>
    <button onclick="copyCurlCommand('/networks', {method: 'GET'})" class="copy-curl-button">📋 Копировать curl</button>
  </div>
</div>

```bash
curl -X GET "https://cp-merch-dev.wsdemo.online/api/v1/networks" \
  -H "Authorization: Bearer YOUR_API_KEY"
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
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    
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
const getNetworks = async () => {
  const response = await fetch('https://cp-merch-dev.wsdemo.online/api/v1/networks', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const networks = await response.json();
  console.log('Сети:', networks);
};

getNetworks();
```

</div>

<div class="example-block" data-lang="python">

### Python Requests

```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get('https://cp-merch-dev.wsdemo.online/api/v1/networks', 
                       headers=headers)

if response.status_code == 200:
    networks = response.json()
    print(f"Найдено {len(networks)} сетей")
else:
    print(f"Ошибка: {response.status_code}")
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
    'Authorization: Bearer ' . $apiKey
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $networks = json_decode($response, true);
    echo "Найдено " . count($networks) . " сетей\n";
}
?>
```

</div>

  </template>
</ApiDoc> 