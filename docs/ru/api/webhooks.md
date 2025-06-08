# API Webhooks

Webhooks позволяют получать уведомления в реальном времени о событиях в вашем платежном шлюзе.

## Обзор

Webhooks - это HTTP POST запросы, отправляемые на указанный вами эндпоинт при возникновении определенных событий. Это позволяет:

- Обрабатывать платежи в реальном времени
- Автоматически обновлять статусы заказов
- Отслеживать подтверждения транзакций
- Обрабатывать завершение выводов

## События Webhook

### События транзакций

#### `transaction.confirmed`
Срабатывает, когда транзакция получает достаточное количество подтверждений.

```json
{
  "event": "transaction.confirmed",
  "data": {
    "id": "tx_1234567890",
    "address_id": "addr_abcdef123456",
    "hash": "0x1234567890abcdef...",
    "amount": "100.50",
    "coin": "usdt",
    "network": "ethereum",
    "confirmations": 12,
    "status": "confirmed",
    "created_at": "2025-01-01T12:00:00Z",
    "confirmed_at": "2025-01-01T12:15:00Z"
  }
}
```

#### `transaction.failed`
Срабатывает, когда транзакция не удалась или была отклонена.

```json
{
  "event": "transaction.failed",
  "data": {
    "id": "tx_1234567890",
    "address_id": "addr_abcdef123456",
    "hash": "0x1234567890abcdef...",
    "amount": "100.50",
    "coin": "usdt",
    "network": "ethereum",
    "status": "failed",
    "error": "Insufficient gas",
    "created_at": "2025-01-01T12:00:00Z",
    "failed_at": "2025-01-01T12:05:00Z"
  }
}
```

### События адресов

#### `address.balance_updated`
Срабатывает при изменении баланса адреса.

```json
{
  "event": "address.balance_updated",
  "data": {
    "id": "addr_abcdef123456",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "network": "ethereum",
    "coin": "usdt",
    "balance": {
      "total": "250.75",
      "confirmed": "200.25",
      "unconfirmed": "50.50"
    },
    "previous_balance": {
      "total": "150.25",
      "confirmed": "150.25",
      "unconfirmed": "0.00"
    },
    "updated_at": "2025-01-01T12:00:00Z"
  }
}
```

### События выводов

#### `withdrawal.completed`
Срабатывает при успешной обработке вывода.

```json
{
  "event": "withdrawal.completed",
  "data": {
    "id": "wd_1234567890",
    "amount": "100.00",
    "coin": "usdt",
    "network": "ethereum",
    "to_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "hash": "0x1234567890abcdef...",
    "fee": "2.50",
    "status": "completed",
    "created_at": "2025-01-01T12:00:00Z",
    "completed_at": "2025-01-01T12:10:00Z"
  }
}
```

## Безопасность Webhook

### Проверка подписи

Все webhooks включают подпись в заголовке `X-Gateway-Signature`. Проверяйте эту подпись, чтобы убедиться, что webhook от нашего сервиса.

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}

// Использование
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-gateway-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Обработка webhook
  const { event, data } = req.body;
  // ... обработка события
  
  res.status(200).send('OK');
});
```

## Управление Webhooks

### Создание Webhook

```http
POST /api/v1/webhooks
```

```json
{
  "url": "https://your-domain.com/webhook",
  "events": [
    "transaction.confirmed",
    "transaction.failed",
    "address.balance_updated",
    "withdrawal.completed"
  ],
  "description": "Основной webhook эндпоинт",
  "active": true
}
```

### Список Webhooks

```http
GET /api/v1/webhooks
```

### Обновление Webhook

```http
PUT /api/v1/webhooks/{webhook_id}
```

### Удаление Webhook

```http
DELETE /api/v1/webhooks/{webhook_id}
```

## Лучшие практики

### Идемпотентность
Обрабатывайте дублирующиеся webhooks корректно, реализуя проверки идемпотентности:

```javascript
const processedEvents = new Set();

app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  const eventId = data.id;
  
  if (processedEvents.has(eventId)) {
    return res.status(200).send('Already processed');
  }
  
  // Обработка события
  processEvent(event, data);
  processedEvents.add(eventId);
  
  res.status(200).send('OK');
});
```

### Обработка ошибок
Возвращайте соответствующие HTTP коды статуса:

- `200` - Успех
- `400` - Неверный запрос
- `401` - Не авторизован
- `500` - Ошибка сервера

### Логика повторов
Мы реализуем экспоненциальную задержку для неудачных webhooks:

- Первый повтор: 1 секунда
- Второй повтор: 2 секунды
- Третий повтор: 4 секунды
- Максимум повторов: 5 попыток

### Таймаут
Webhook эндпоинты должны отвечать в течение 30 секунд.

## Тестирование Webhooks

### Локальная разработка
Используйте инструменты вроде ngrok для доступа к локальному серверу:

```bash
# Установка ngrok
npm install -g ngrok

# Открытие локального порта
ngrok http 3000

# Используйте предоставленный URL для настройки webhook
```

### Инструмент тестирования Webhook
Мы предоставляем инструмент тестирования webhook в вашей панели управления для отправки тестовых событий на ваши эндпоинты.

## Устранение неполадок

### Распространенные проблемы

1. **Webhook не получен**
   - Проверьте настройки брандмауэра
   - Убедитесь в доступности URL
   - Проверьте конфигурацию webhook

2. **Проверка подписи не удалась**
   - Убедитесь, что используете правильный webhook секрет
   - Проверьте, что payload не изменен
   - Проверьте регистр имени заголовка

3. **Дублирующиеся события**
   - Реализуйте проверки идемпотентности
   - Используйте ID событий для дедупликации

### Логи Webhook
Просматривайте логи доставки webhook в вашей панели управления для отладки проблем.

## Ограничения скорости

- Максимум 1000 webhooks в минуту на эндпоинт
- Максимум 10 одновременных доставок webhook на эндпоинт

## Связанные ресурсы

- [Аутентификация](./authentication.md)
- [Обработка ошибок](../guide/error-handling.md)
- [Примеры](../examples/webhooks.md) 