# Начало интеграции

Пошаговое руководство по интеграции криптоплатежного шлюза в ваше приложение.

## Предварительные требования

- Node.js 16+ или Python 3.8+ или Go 1.19+
- Аккаунт в системе и API ключи
- Базовые знания REST API

## Шаг 1: Получение API ключей

1. Зарегистрируйтесь в системе
2. Перейдите в раздел "API Keys"
3. Создайте новый API ключ для тестирования
4. Сохраните ключи в безопасном месте

```bash
# Тестовые ключи
GATEWAY_API_KEY=sk_test_your_test_key_here
WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Продакшн ключи
GATEWAY_API_KEY=sk_live_your_live_key_here
WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Шаг 2: Установка SDK

### JavaScript/TypeScript

```bash
npm install @gateway/crypto-payment-sdk
# или
yarn add @gateway/crypto-payment-sdk
```

### Python

```bash
pip install gateway-crypto-payment
# или
poetry add gateway-crypto-payment
```

### Go

```bash
go get github.com/gateway/crypto-payment-go
```

## Шаг 3: Базовая настройка

### JavaScript

```javascript
const { Gateway } = require('@gateway/crypto-payment-sdk');

const gateway = new Gateway({
  apiKey: process.env.GATEWAY_API_KEY,
  environment: 'test', // 'test' или 'production'
  timeout: 30000,
  retries: 3
});
```

### Python

```python
from gateway import Gateway

gateway = Gateway(
    api_key=os.getenv('GATEWAY_API_KEY'),
    environment='test',  # 'test' или 'production'
    timeout=30,
    max_retries=3
)
```

### Go

```go
package main

import (
    "os"
    "github.com/gateway/crypto-payment-go"
)

func main() {
    client := gateway.NewClient(&gateway.Config{
        APIKey:      os.Getenv("GATEWAY_API_KEY"),
        Environment: "test", // "test" или "production"
        Timeout:     30,
        MaxRetries:  3,
    })
}
```

## Шаг 4: Первый запрос

Проверим подключение, получив список поддерживаемых сетей:

### JavaScript

```javascript
async function testConnection() {
  try {
    const networks = await gateway.networks.list();
    console.log('Подключение успешно!');
    console.log('Доступные сети:', networks.data.map(n => n.name));
  } catch (error) {
    console.error('Ошибка подключения:', error.message);
  }
}

testConnection();
```

### Python

```python
async def test_connection():
    try:
        networks = await gateway.networks.list()
        print('Подключение успешно!')
        print('Доступные сети:', [n.name for n in networks.data])
    except Exception as error:
        print(f'Ошибка подключения: {error}')

# Запуск
import asyncio
asyncio.run(test_connection())
```

### Go

```go
func testConnection(client *gateway.Client) {
    networks, err := client.Networks.List(context.Background())
    if err != nil {
        log.Printf("Ошибка подключения: %v", err)
        return
    }
    
    fmt.Println("Подключение успешно!")
    for _, network := range networks.Data {
        fmt.Printf("Сеть: %s\n", network.Name)
    }
}
```

## Шаг 5: Создание первого адреса

```javascript
async function createFirstAddress() {
  try {
    const address = await gateway.addresses.create({
      network: 'ethereum',
      coin: 'usdt',
      type: 'user',
      metadata: {
        purpose: 'test_integration',
        created_at: new Date().toISOString()
      }
    });
    
    console.log('Адрес создан:', address.data.address);
    console.log('ID адреса:', address.data.id);
    
    return address.data;
  } catch (error) {
    console.error('Ошибка создания адреса:', error);
  }
}
```

## Шаг 6: Настройка webhook

Webhook позволяют получать уведомления о событиях в реальном времени.

### Создание endpoint

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-gateway-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Неверная подпись');
  }
  
  const { event, data } = req.body;
  
  console.log(`Получено событие: ${event}`);
  console.log('Данные:', data);
  
  // Обработка событий
  switch (event) {
    case 'transaction.confirmed':
      handleTransactionConfirmed(data);
      break;
    case 'address.balance_updated':
      handleBalanceUpdated(data);
      break;
    default:
      console.log('Неизвестное событие:', event);
  }
  
  res.status(200).send('OK');
});

function handleTransactionConfirmed(transaction) {
  console.log(`Транзакция подтверждена: ${transaction.id}`);
  console.log(`Сумма: ${transaction.amount} ${transaction.coin}`);
  
  // Ваша логика обработки
}

function handleBalanceUpdated(address) {
  console.log(`Баланс обновлен для адреса: ${address.address}`);
  console.log(`Новый баланс: ${address.balance.total}`);
  
  // Ваша логика обработки
}

app.listen(3000, () => {
  console.log('Webhook сервер запущен на порту 3000');
});
```

### Регистрация webhook

```javascript
async function registerWebhook() {
  try {
    const webhook = await gateway.webhooks.create({
      url: 'https://your-domain.com/webhook',
      events: [
        'transaction.confirmed',
        'transaction.failed',
        'address.balance_updated',
        'withdrawal.completed'
      ],
      description: 'Main webhook endpoint'
    });
    
    console.log('Webhook зарегистрирован:', webhook.data.id);
    return webhook.data;
  } catch (error) {
    console.error('Ошибка регистрации webhook:', error);
  }
}
```

## Шаг 7: Тестирование интеграции

### Полный тестовый сценарий

```javascript
async function fullIntegrationTest() {
  console.log('🚀 Начинаем тест интеграции...');
  
  try {
    // 1. Проверка подключения
    console.log('1. Проверка подключения...');
    const networks = await gateway.networks.list();
    console.log('✅ Подключение успешно');
    
    // 2. Создание адреса
    console.log('2. Создание тестового адреса...');
    const address = await gateway.addresses.create({
      network: 'ethereum',
      coin: 'usdt',
      type: 'user',
      metadata: { test: true }
    });
    console.log(`✅ Адрес создан: ${address.data.address}`);
    
    // 3. Проверка баланса
    console.log('3. Проверка баланса...');
    const addressInfo = await gateway.addresses.get(address.data.id);
    console.log(`✅ Баланс: ${addressInfo.data.balance.total} USDT`);
    
    // 4. Получение транзакций
    console.log('4. Получение транзакций...');
    const transactions = await gateway.transactions.list({
      address_id: address.data.id,
      limit: 5
    });
    console.log(`✅ Найдено транзакций: ${transactions.data.data.length}`);
    
    console.log('🎉 Тест интеграции завершен успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка в тесте:', error.message);
  }
}

// Запуск теста
fullIntegrationTest();
```

## Следующие шаги

1. **Изучите документацию API** - [API Reference](/ru/api/overview)
2. **Реализуйте обработку платежей** - [Примеры](/ru/examples/basic-usage)
3. **Настройте мониторинг** - [Руководство по развертыванию](/ru/guide/deployment)
4. **Протестируйте в тестовой среде** перед переходом на продакшн

## Получение помощи

- 📖 [Полная документация](/ru/guide/introduction)
- 💬 [Техническая поддержка](mailto:support@gateway.com)
- 🐛 [Сообщить об ошибке](https://github.com/your-org/merchant-processing/issues)

Теперь вы готовы к интеграции криптоплатежного шлюза!
