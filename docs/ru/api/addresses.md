# API Адресов

API адресов позволяет создавать, управлять и отслеживать криптовалютные адреса для приема и отправки платежей.

## Создание адреса

### `POST /api/v1/addresses`

Создает новый адрес для приема криптовалютных платежей.

#### Параметры запроса

```json
{
  "network": "ethereum",           // Обязательно: сеть блокчейна
  "coin": "usdt",                 // Обязательно в режиме single
  "type": "default",              // Опционально: тип адреса
  "label": "Клиент 123",          // Опционально: метка
  "metadata": {                   // Опционально: дополнительные данные
    "customer_id": "cust_123",
    "purpose": "payment"
  }
}
```

#### Параметры

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `network` | string | Да | Сеть блокчейна (ethereum, bitcoin, tron, etc.) |
| `coin` | string | Условно | Монета (обязательно в режиме single) |
| `type` | string | Нет | Тип адреса: default, hot, cold, tokens_collector |
| `label` | string | Нет | Человекочитаемая метка |
| `metadata` | object | Нет | Дополнительные метаданные |

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "id": "addr_123456789",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
    "network": "ethereum",
    "coin": "usdt",
    "type": "default",
    "label": "Клиент 123",
    "balances": [
      {
        "coin": "usdt",
        "balance": "0",
        "confirmed": "0",
        "unconfirmed": "0",
        "frozen": "0",
        "available": "0"
      }
    ],
    "metadata": {
      "customer_id": "cust_123",
      "purpose": "payment"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Коды ошибок

| Код | Описание |
|-----|----------|
| `INVALID_NETWORK` | Неподдерживаемая сеть |
| `INVALID_COIN` | Неподдерживаемая монета |
| `INVALID_TYPE` | Неверный тип адреса |
| `GENERATION_FAILED` | Ошибка генерации адреса |

## Получение адреса

### `GET /api/v1/addresses/{id}`

Получает информацию о конкретном адресе.

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "id": "addr_123456789",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
    "network": "ethereum",
    "coin": "usdt",
    "type": "default",
    "label": "Клиент 123",
    "balances": [
      {
        "coin": "usdt",
        "balance": "1000.50",
        "confirmed": "950.25",
        "unconfirmed": "50.25",
        "frozen": "0",
        "available": "950.25"
      }
    ],
    "metadata": {
      "customer_id": "cust_123",
      "purpose": "payment"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T12:45:00Z"
  }
}
```

## Список адресов

### `GET /api/v1/addresses`

Получает список адресов с возможностью фильтрации и пагинации.

#### Параметры запроса

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | integer | Номер страницы (по умолчанию: 1) |
| `limit` | integer | Количество записей (по умолчанию: 20, максимум: 100) |
| `network` | string | Фильтр по сети |
| `coin` | string | Фильтр по монете |
| `type` | string | Фильтр по типу |
| `label` | string | Поиск по метке |
| `created_after` | string | Созданы после даты (ISO 8601) |
| `created_before` | string | Созданы до даты (ISO 8601) |
| `sort` | string | Поле сортировки |
| `order` | string | Порядок сортировки (asc, desc) |

#### Пример запроса

```http
GET /api/v1/addresses?network=ethereum&type=default&page=1&limit=50&sort=created_at&order=desc
```

#### Пример ответа

```json
{
  "success": true,
  "data": [
    {
      "id": "addr_123456789",
      "address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
      "network": "ethereum",
      "coin": "usdt",
      "type": "default",
      "label": "Клиент 123",
      "balances": [
        {
          "coin": "usdt",
          "balance": "1000.50",
          "confirmed": "950.25",
          "unconfirmed": "50.25"
        }
      ],
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

## Обновление адреса

### `PUT /api/v1/addresses/{id}`

Обновляет метку и метаданные адреса.

#### Параметры запроса

```json
{
  "label": "Обновленная метка",
  "metadata": {
    "customer_id": "cust_456",
    "purpose": "subscription",
    "notes": "VIP клиент"
  }
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "id": "addr_123456789",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
    "network": "ethereum",
    "coin": "usdt",
    "type": "default",
    "label": "Обновленная метка",
    "metadata": {
      "customer_id": "cust_456",
      "purpose": "subscription",
      "notes": "VIP клиент"
    },
    "updated_at": "2024-01-15T14:20:00Z"
  }
}
```

## Балансы адреса

### `GET /api/v1/addresses/{id}/balances`

Получает балансы всех монет для конкретного адреса.

#### Пример ответа

```json
{
  "success": true,
  "data": [
    {
      "coin": "eth",
      "balance": "2.5",
      "confirmed": "2.5",
      "unconfirmed": "0",
      "frozen": "0",
      "available": "2.5"
    },
    {
      "coin": "usdt",
      "balance": "1000.50",
      "confirmed": "950.25",
      "unconfirmed": "50.25",
      "frozen": "0",
      "available": "950.25"
    },
    {
      "coin": "usdc",
      "balance": "500.00",
      "confirmed": "500.00",
      "unconfirmed": "0",
      "frozen": "0",
      "available": "500.00"
    }
  ]
}
```

### `GET /api/v1/addresses/{id}/balances/{coin}`

Получает баланс конкретной монеты для адреса.

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "coin": "usdt",
    "balance": "1000.50",
    "confirmed": "950.25",
    "unconfirmed": "50.25",
    "frozen": "0",
    "available": "950.25",
    "last_updated": "2024-01-15T12:45:00Z"
  }
}
```

## Транзакции адреса

### `GET /api/v1/addresses/{id}/transactions`

Получает историю транзакций для конкретного адреса.

#### Параметры запроса

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | integer | Номер страницы |
| `limit` | integer | Количество записей |
| `coin` | string | Фильтр по монете |
| `type` | string | Тип транзакции (incoming, outgoing) |
| `status` | string | Статус (pending, confirmed, failed) |
| `from_date` | string | Начальная дата |
| `to_date` | string | Конечная дата |

#### Пример ответа

```json
{
  "success": true,
  "data": [
    {
      "id": "tx_987654321",
      "hash": "0xabc123def456...",
      "type": "incoming",
      "status": "confirmed",
      "coin": "usdt",
      "amount": "100.50",
      "fee": "0.001",
      "from_address": "0x123...",
      "to_address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
      "confirmations": 15,
      "block_number": 18500000,
      "created_at": "2024-01-15T12:30:00Z",
      "confirmed_at": "2024-01-15T12:35:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

## Валидация адреса

### `POST /api/v1/addresses/validate`

Проверяет корректность адреса для конкретной сети.

#### Параметры запроса

```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
  "network": "ethereum"
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "valid": true,
    "network": "ethereum",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
    "checksum": "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C",
    "type": "externally_owned_account"
  }
}
```

## Удаление адреса

### `DELETE /api/v1/addresses/{id}`

Удаляет адрес (только если баланс равен нулю).

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "message": "Адрес успешно удален",
    "deleted_at": "2024-01-15T15:00:00Z"
  }
}
```

#### Коды ошибок

| Код | Описание |
|-----|----------|
| `ADDRESS_NOT_FOUND` | Адрес не найден |
| `NON_ZERO_BALANCE` | Баланс адреса не равен нулю |
| `ACTIVE_TRANSACTIONS` | Есть активные транзакции |

## Примеры использования

### Создание адреса для депозита

```bash
curl -X POST "https://api.your-gateway.com/api/v1/addresses" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "coin": "usdt",
    "label": "Депозит клиента 123",
    "metadata": {
      "customer_id": "cust_123",
      "order_id": "order_456"
    }
  }'
```

### Проверка баланса

```bash
curl -X GET "https://api.your-gateway.com/api/v1/addresses/addr_123456789/balances" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Получение транзакций

```bash
curl -X GET "https://api.your-gateway.com/api/v1/addresses/addr_123456789/transactions?coin=usdt&status=confirmed" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Фильтрация адресов

```bash
curl -X GET "https://api.your-gateway.com/api/v1/addresses?network=ethereum&type=default&limit=50" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Лимиты и ограничения

### Лимиты скорости

- **Создание адресов**: 100 запросов/час
- **Получение данных**: 1000 запросов/час
- **Обновление**: 500 запросов/час

### Ограничения

- Максимум 10,000 адресов на аккаунт
- Максимум 100 адресов в одном запросе списка
- Метка не может превышать 255 символов
- Метаданные не могут превышать 1KB

## Статусы и состояния

### Типы адресов

- `default`: Обычный пользовательский адрес
- `hot`: Горячий кошелек для выводов
- `cold`: Холодный кошелек для хранения
- `tokens_collector`: Сборщик токенов

### Статусы балансов

- `balance`: Общий баланс
- `confirmed`: Подтвержденный баланс
- `unconfirmed`: Неподтвержденный баланс
- `frozen`: Замороженный баланс
- `available`: Доступный для вывода

### Статусы транзакций

- `pending`: Ожидает подтверждения
- `confirmed`: Подтверждена
- `failed`: Неудачная транзакция 