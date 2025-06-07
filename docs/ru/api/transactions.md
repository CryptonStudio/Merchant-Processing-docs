# API Транзакций

Полная документация по API для работы с транзакциями в системе криптоплатежного шлюза.

## Обзор

API транзакций позволяет:

- Получать информацию о транзакциях
- Отслеживать статус транзакций
- Получать историю транзакций
- Мониторить подтверждения

## Базовый URL

```
https://api.gateway.com/v1
```

## Аутентификация

Все запросы требуют API ключ в заголовке:

```http
Authorization: Bearer sk_live_your_api_key_here
```

## Получение транзакции

### GET /transactions/{transaction_id}

Получить информацию о конкретной транзакции.

#### Параметры пути

| Параметр | Тип | Описание |
|----------|-----|----------|
| `transaction_id` | string | Уникальный идентификатор транзакции |

#### Пример запроса

```bash
curl -X GET "https://api.gateway.com/v1/transactions/tx_1234567890" \
  -H "Authorization: Bearer sk_live_your_api_key_here"
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "id": "tx_1234567890",
    "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "type": "incoming",
    "status": "confirmed",
    "network": "ethereum",
    "coin": "usdt",
    "amount": "100.50",
    "fee": "0.001",
    "from_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "to_address": "0x8ba1f109551bD432803012645Hac136c22C501e",
    "confirmations": 15,
    "required_confirmations": 12,
    "block_number": 18500000,
    "block_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "gas_used": "21000",
    "gas_price": "20000000000",
    "metadata": {
      "customer_id": "customer_123",
      "order_id": "order_456"
    },
    "created_at": "2025-01-01T12:00:00Z",
    "confirmed_at": "2025-01-01T12:05:00Z"
  }
}
```

## Список транзакций

### GET /transactions

Получить список транзакций с возможностью фильтрации.

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `address_id` | string | Нет | Фильтр по ID адреса |
| `network` | string | Нет | Фильтр по сети (ethereum, bitcoin, polygon) |
| `coin` | string | Нет | Фильтр по монете (btc, eth, usdt, usdc) |
| `status` | string | Нет | Фильтр по статусу (pending, confirming, confirmed, failed) |
| `type` | string | Нет | Фильтр по типу (incoming, outgoing) |
| `from_date` | string | Нет | Начальная дата (ISO 8601) |
| `to_date` | string | Нет | Конечная дата (ISO 8601) |
| `limit` | integer | Нет | Количество записей (по умолчанию: 50, максимум: 100) |
| `offset` | integer | Нет | Смещение для пагинации (по умолчанию: 0) |

#### Пример запроса

```bash
curl -X GET "https://api.gateway.com/v1/transactions?network=ethereum&status=confirmed&limit=10" \
  -H "Authorization: Bearer sk_live_your_api_key_here"
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "tx_1234567890",
        "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "type": "incoming",
        "status": "confirmed",
        "network": "ethereum",
        "coin": "usdt",
        "amount": "100.50",
        "fee": "0.001",
        "from_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        "to_address": "0x8ba1f109551bD432803012645Hac136c22C501e",
        "confirmations": 15,
        "created_at": "2025-01-01T12:00:00Z",
        "confirmed_at": "2025-01-01T12:05:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  }
}
```

## Статусы транзакций

| Статус | Описание |
|--------|----------|
| `pending` | Транзакция отправлена в сеть, ожидает включения в блок |
| `confirming` | Транзакция включена в блок, набирает подтверждения |
| `confirmed` | Транзакция получила достаточное количество подтверждений |
| `failed` | Транзакция не удалась или была отклонена сетью |

## Типы транзакций

| Тип | Описание |
|-----|----------|
| `incoming` | Входящая транзакция (получение средств) |
| `outgoing` | Исходящая транзакция (отправка средств) |

## Мониторинг транзакций

### GET /transactions/{transaction_id}/status

Получить текущий статус транзакции с подробной информацией о подтверждениях.

#### Пример запроса

```bash
curl -X GET "https://api.gateway.com/v1/transactions/tx_1234567890/status" \
  -H "Authorization: Bearer sk_live_your_api_key_here"
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "transaction_id": "tx_1234567890",
    "status": "confirming",
    "confirmations": 8,
    "required_confirmations": 12,
    "confirmation_progress": 66.67,
    "estimated_confirmation_time": "2025-01-01T12:10:00Z",
    "network_status": {
      "current_block": 18500010,
      "transaction_block": 18500005,
      "blocks_behind": 5
    }
  }
}
```

## Webhook уведомления

Система автоматически отправляет webhook уведомления при изменении статуса транзакций.

### События транзакций

#### transaction.detected

Отправляется когда транзакция обнаружена в мемпуле.

```json
{
  "event": "transaction.detected",
  "data": {
    "id": "tx_1234567890",
    "hash": "0xabcdef...",
    "status": "pending",
    "network": "ethereum",
    "coin": "usdt",
    "amount": "100.50",
    "to_address": "0x8ba1f109551bD432803012645Hac136c22C501e",
    "metadata": {
      "customer_id": "customer_123"
    }
  }
}
```

#### transaction.confirmed

Отправляется когда транзакция получает достаточное количество подтверждений.

```json
{
  "event": "transaction.confirmed",
  "data": {
    "id": "tx_1234567890",
    "hash": "0xabcdef...",
    "status": "confirmed",
    "network": "ethereum",
    "coin": "usdt",
    "amount": "100.50",
    "confirmations": 12,
    "confirmed_at": "2025-01-01T12:05:00Z"
  }
}
```

#### transaction.failed

Отправляется когда транзакция не удалась.

```json
{
  "event": "transaction.failed",
  "data": {
    "id": "tx_1234567890",
    "hash": "0xabcdef...",
    "status": "failed",
    "failure_reason": "insufficient_gas",
    "error_details": {
      "code": "OUT_OF_GAS",
      "message": "Transaction ran out of gas"
    }
  }
}
```

## Коды ошибок

| Код | Описание |
|-----|----------|
| `TRANSACTION_NOT_FOUND` | Транзакция не найдена |
| `INVALID_TRANSACTION_ID` | Неверный формат ID транзакции |
| `NETWORK_NOT_SUPPORTED` | Сеть не поддерживается |
| `INVALID_DATE_FORMAT` | Неверный формат даты |
| `LIMIT_EXCEEDED` | Превышен лимит запросов |

## Примеры использования

### Отслеживание платежа

```javascript
// Проверка статуса транзакции
async function trackPayment(transactionId) {
  try {
    const response = await fetch(`/api/transactions/${transactionId}`, {
      headers: {
        'Authorization': 'Bearer sk_live_your_api_key_here'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const transaction = result.data;
      console.log(`Статус: ${transaction.status}`);
      console.log(`Подтверждения: ${transaction.confirmations}/${transaction.required_confirmations}`);
      
      if (transaction.status === 'confirmed') {
        console.log('Платеж подтвержден!');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Ошибка при проверке транзакции:', error);
    return false;
  }
}
```

### Получение истории транзакций

```javascript
// Получение всех транзакций за последний месяц
async function getTransactionHistory() {
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 1);
  
  try {
    const response = await fetch(`/api/transactions?from_date=${fromDate.toISOString()}&limit=100`, {
      headers: {
        'Authorization': 'Bearer sk_live_your_api_key_here'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const transactions = result.data.data;
      console.log(`Найдено ${transactions.length} транзакций`);
      
      transactions.forEach(tx => {
        console.log(`${tx.id}: ${tx.amount} ${tx.coin.toUpperCase()} - ${tx.status}`);
      });
      
      return transactions;
    }
  } catch (error) {
    console.error('Ошибка при получении истории:', error);
    return [];
  }
}
```

### Мониторинг подтверждений

```javascript
// Ожидание подтверждения транзакции
async function waitForConfirmation(transactionId, requiredConfirmations = 12) {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/transactions/${transactionId}/status`, {
          headers: {
            'Authorization': 'Bearer sk_live_your_api_key_here'
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          const status = result.data;
          
          console.log(`Подтверждения: ${status.confirmations}/${status.required_confirmations}`);
          
          if (status.confirmations >= requiredConfirmations) {
            resolve(status);
            return;
          }
          
          if (status.status === 'failed') {
            reject(new Error('Транзакция не удалась'));
            return;
          }
          
          // Проверяем снова через 30 секунд
          setTimeout(checkStatus, 30000);
        } else {
          reject(new Error('Ошибка при проверке статуса'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    checkStatus();
  });
}
```

## Лимиты и ограничения

- **Лимит запросов**: 1000 запросов в минуту
- **Максимальный лимит записей**: 100 транзакций за запрос
- **Период хранения**: Транзакции хранятся 2 года
- **Timeout запроса**: 30 секунд

## Рекомендации

1. **Используйте webhook'и** вместо постоянного опроса API для отслеживания статуса
2. **Кэшируйте результаты** для часто запрашиваемых данных
3. **Обрабатывайте ошибки** и реализуйте повторные попытки
4. **Используйте пагинацию** для больших объемов данных
5. **Мониторьте лимиты** запросов и реализуйте throttling

Эта документация покрывает все аспекты работы с API транзакций для эффективной интеграции с криптоплатежным шлюзом. 