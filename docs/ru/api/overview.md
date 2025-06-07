# Обзор API

Криптоплатежный шлюз предоставляет RESTful API для интеграции с вашими приложениями. API позволяет управлять адресами, обрабатывать платежи, отслеживать транзакции и выполнять выводы средств.

## Базовая информация

### Базовый URL
```
https://api.your-gateway.com/api/v1
```

### Версионирование
API использует версионирование через URL. Текущая версия: `v1`

### Формат данных
- **Запросы**: JSON
- **Ответы**: JSON
- **Кодировка**: UTF-8
- **Даты**: ISO 8601 (UTC)

## Аутентификация

### API ключи
Все запросы к API должны включать заголовок аутентификации:

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Получение API ключа
1. Зарегистрируйтесь в панели управления
2. Создайте новый API ключ
3. Настройте разрешения и ограничения
4. Сохраните ключ в безопасном месте

### Типы ключей
- **Только чтение**: Просмотр данных
- **Запись**: Создание и изменение данных
- **Полный доступ**: Все операции включая выводы

## Ограничения скорости

### Лимиты по умолчанию
- **Общие запросы**: 1000 запросов/час
- **Создание адресов**: 100 запросов/час
- **Выводы средств**: 50 запросов/час

### Заголовки ответа
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Превышение лимитов
При превышении лимитов API возвращает статус `429 Too Many Requests`:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Превышен лимит запросов",
    "details": {
      "limit": 1000,
      "reset_at": "2024-01-15T12:00:00Z"
    }
  }
}
```

## Структура ответов

### Успешные ответы
```json
{
  "success": true,
  "data": {
    // Данные ответа
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

### Ошибки
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ошибка валидации данных",
    "details": {
      "field": "network",
      "reason": "Неподдерживаемая сеть"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

## HTTP статус коды

| Код | Описание | Использование |
|-----|----------|---------------|
| 200 | OK | Успешный запрос |
| 201 | Created | Ресурс создан |
| 400 | Bad Request | Неверный запрос |
| 401 | Unauthorized | Не авторизован |
| 403 | Forbidden | Доступ запрещен |
| 404 | Not Found | Ресурс не найден |
| 429 | Too Many Requests | Превышен лимит |
| 500 | Internal Server Error | Внутренняя ошибка |

## Основные эндпоинты

### Адреса
```http
GET    /api/v1/addresses           # Список адресов
POST   /api/v1/addresses           # Создать адрес
GET    /api/v1/addresses/{id}      # Получить адрес
PUT    /api/v1/addresses/{id}      # Обновить адрес
DELETE /api/v1/addresses/{id}      # Удалить адрес
```

### Сети
```http
GET    /api/v1/networks            # Список сетей
GET    /api/v1/networks/{slug}     # Информация о сети
PUT    /api/v1/networks/{slug}     # Обновить сеть
```

### Монеты
```http
GET    /api/v1/coins               # Список монет
GET    /api/v1/coins/{slug}        # Информация о монете
POST   /api/v1/coins               # Добавить монету
PUT    /api/v1/coins/{slug}        # Обновить монету
```

### Транзакции
```http
GET    /api/v1/transactions        # Список транзакций
GET    /api/v1/transactions/{id}   # Детали транзакции
```

### Выводы
```http
POST   /api/v1/withdrawals         # Создать вывод
GET    /api/v1/withdrawals         # Список выводов
GET    /api/v1/withdrawals/{id}    # Статус вывода
```

### Балансы
```http
GET    /api/v1/balances            # Общие балансы
GET    /api/v1/addresses/{id}/balances  # Балансы адреса
```

## Пагинация

### Параметры запроса
```http
GET /api/v1/addresses?page=1&limit=50&sort=created_at&order=desc
```

### Параметры
- `page`: Номер страницы (по умолчанию: 1)
- `limit`: Количество записей (по умолчанию: 20, максимум: 100)
- `sort`: Поле для сортировки
- `order`: Порядок сортировки (`asc` или `desc`)

### Ответ с пагинацией
```json
{
  "success": true,
  "data": [
    // Массив данных
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

## Фильтрация

### Общие фильтры
```http
GET /api/v1/addresses?network=ethereum&type=hot&created_after=2024-01-01
```

### Поддерживаемые операторы
- `eq`: Равно (по умолчанию)
- `ne`: Не равно
- `gt`: Больше
- `gte`: Больше или равно
- `lt`: Меньше
- `lte`: Меньше или равно
- `in`: В списке
- `like`: Содержит (для строк)

### Примеры
```http
# Адреса созданные после определенной даты
GET /api/v1/addresses?created_at[gte]=2024-01-01

# Транзакции с суммой больше 100
GET /api/v1/transactions?amount[gt]=100

# Адреса определенных типов
GET /api/v1/addresses?type[in]=hot,cold
```

## Вебхуки

### Настройка вебхуков
```http
POST /api/v1/webhooks
{
  "url": "https://your-app.com/webhooks/crypto",
  "events": ["transaction.confirmed", "withdrawal.completed"],
  "secret": "your_webhook_secret"
}
```

### События
- `transaction.detected`: Транзакция обнаружена
- `transaction.confirmed`: Транзакция подтверждена
- `withdrawal.created`: Вывод создан
- `withdrawal.completed`: Вывод завершен
- `balance.updated`: Баланс обновлен

### Формат вебхука
```json
{
  "event": "transaction.confirmed",
  "data": {
    "id": "tx_123456789",
    "hash": "0xabc123...",
    "amount": "100.50",
    "coin": "usdt",
    "network": "ethereum",
    "address": "0x742d35...",
    "confirmations": 12
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## SDK и библиотеки

### Официальные SDK
- **Go**: `go get github.com/your-org/gateway-go`
- **TypeScript/JavaScript**: `npm install @your-org/gateway-js`
- **Python**: `pip install gateway-python`

### Примеры использования

#### Go
```go
import "github.com/your-org/gateway-go"

client := gateway.NewClient("your-api-key")
address, err := client.CreateAddress(gateway.CreateAddressRequest{
    Network: "ethereum",
    Coin:    "usdt",
})
```

#### TypeScript
```typescript
import { GatewayClient } from '@your-org/gateway-js';

const client = new GatewayClient('your-api-key');
const address = await client.createAddress({
  network: 'ethereum',
  coin: 'usdt'
});
```

#### Python
```python
from gateway_python import GatewayClient

client = GatewayClient('your-api-key')
address = client.create_address(
    network='ethereum',
    coin='usdt'
)
```

## Тестирование

### Тестовая среда
```
https://api-testnet.your-gateway.com/api/v1
```

### Тестовые данные
- Используйте тестовые сети (testnet)
- Тестовые API ключи имеют префикс `test_`
- Тестовые транзакции не требуют реальных средств

### Postman коллекция
Загрузите готовую коллекцию Postman для тестирования API:
```
https://api.your-gateway.com/postman/collection.json
```

## Поддержка

### Документация
- **API Reference**: Подробное описание всех эндпоинтов
- **Руководства**: Пошаговые инструкции
- **Примеры**: Готовые примеры кода

### Техническая поддержка
- **Email**: support@your-gateway.com
- **Документация**: https://docs.your-gateway.com
- **GitHub**: https://github.com/your-org/gateway-issues

### Статус сервиса
Проверьте текущий статус API:
```
https://status.your-gateway.com
``` 