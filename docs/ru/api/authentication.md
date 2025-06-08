# Аутентификация

Эта страница описывает, как получить и использовать API ключи для доступа к API платежного шлюза Crypton Studio.

## Типы API ключей

Мы предоставляем два типа API ключей:

### Client Key (Клиентский ключ)
- **Права доступа**: Только чтение
- **Использование**: Запрос данных, создание платежных адресов
- **Уровень безопасности**: Может использоваться на клиенте
- **Префикс**: `ck_`

### Admin Key (Административный ключ)
- **Права доступа**: Полный доступ
- **Использование**: Все операции, включая выводы средств, управление настройками
- **Уровень безопасности**: Только для серверной части
- **Префикс**: `ak_`

::: danger Важное предупреждение о безопасности
- **Никогда не** раскрывайте Admin Key в клиентском коде
- **Никогда не** используйте Admin Key в frontend JavaScript
- **Никогда не** коммитьте Admin Key в систему контроля версий
:::

## Получение API ключей

1. Войдите в [Консоль мерчанта](https://dashboard.crypton.studio)
2. Перейдите на страницу "Настройки API"
3. Нажмите "Создать новый ключ"
4. Выберите тип ключа (Client или Admin)
5. Установите имя ключа и права доступа
6. Безопасно сохраните сгенерированный ключ

## Использование API ключей

### HTTP заголовки

Включите следующие заголовки во все API запросы:

```http
X-Api-Key: your-api-key
Content-Type: application/json
```

### Пример запроса

```bash
curl -X GET "https://api.crypton.studio/v1/networks" \
  -H "X-Api-Key: ck_test_1234567890abcdef" \
  -H "Content-Type: application/json"
```

## Конфигурация окружения

### Тестовое окружение (Sandbox)
- **Базовый URL API**: `https://api-sandbox.crypton.studio`
- **Префикс ключа**: `ck_test_` или `ak_test_`
- **Назначение**: Разработка и тестирование

### Продакшн окружение (Production)
- **Базовый URL API**: `https://api.crypton.studio`
- **Префикс ключа**: `ck_live_` или `ak_live_`
- **Назначение**: Реальный бизнес

## Контроль доступа

Различные типы API ключей имеют разные права доступа:

| Операция | Client Key | Admin Key |
|----------|------------|-----------|
| Просмотр информации о мерчанте | ✅ | ✅ |
| Создание платежных адресов | ✅ | ✅ |
| Просмотр истории транзакций | ✅ | ✅ |
| Просмотр информации о сетях | ✅ | ✅ |
| Просмотр информации о монетах | ✅ | ✅ |
| Создание выводов | ❌ | ✅ |
| Управление монетами | ❌ | ✅ |
| Настройка Webhook | ❌ | ✅ |
| Просмотр конфиденциальных данных | ❌ | ✅ |

## Лучшие практики безопасности

### 1. Управление ключами
- Используйте переменные окружения для хранения API ключей
- Регулярно ротируйте API ключи
- Используйте разные ключи для разных окружений

```bash
# Пример переменных окружения
export CRYPTON_API_KEY="ck_live_1234567890abcdef"
export CRYPTON_ENVIRONMENT="production"
```

### 2. Белый список IP
Настройте белый список IP в консоли для ограничения доступа к API:

```json
{
  "allowedIPs": [
    "192.168.1.100",
    "10.0.0.0/8",
    "203.0.113.0/24"
  ]
}
```

### 3. Подпись запросов
Для операций с высокими требованиями к безопасности мы поддерживаем подпись запросов:

```javascript
const crypto = require('crypto')

function signRequest(method, path, body, timestamp, secret) {
  const payload = `${method}${path}${body}${timestamp}`
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

// Пример использования
const timestamp = Date.now()
const signature = signRequest('POST', '/v1/withdrawals', JSON.stringify(body), timestamp, apiSecret)

// Заголовки запроса
headers['X-Crypton-Timestamp'] = timestamp
headers['X-Crypton-Signature'] = signature
```

### 4. Принудительное использование HTTPS
Все API запросы должны использовать HTTPS. HTTP запросы будут отклонены.

## Обработка ошибок

### Ошибка аутентификации

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Недействительный API ключ",
    "details": "Пожалуйста, проверьте правильность заголовка Authorization"
  }
}
```

### Недостаточно прав

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Недостаточно прав",
    "details": "Эта операция требует Admin Key"
  }
}
```

### Истекший ключ

```json
{
  "success": false,
  "error": {
    "code": "KEY_EXPIRED",
    "message": "API ключ истек",
    "details": "Пожалуйста, создайте новый API ключ в консоли"
  }
}
```

## Примеры конфигурации SDK

### JavaScript/TypeScript

```javascript
import { CryptonClient } from '@crypton/payment-sdk'

const client = new CryptonClient({
  apiKey: process.env.CRYPTON_API_KEY,
  environment: process.env.CRYPTON_ENVIRONMENT || 'sandbox'
})
```

### Python

```python
import os
from crypton_sdk import CryptonClient

client = CryptonClient(
    api_key=os.getenv('CRYPTON_API_KEY'),
    environment=os.getenv('CRYPTON_ENVIRONMENT', 'sandbox')
)
```

### Go

```go
package main

import (
    "os"
    "github.com/crypton-studio/payment-sdk-go"
)

func main() {
    client := crypton.NewClient(&crypton.Config{
        APIKey:      os.Getenv("CRYPTON_API_KEY"),
        Environment: os.Getenv("CRYPTON_ENVIRONMENT"),
    })
}
```

## Тестирование подключения

Используйте следующий эндпоинт для проверки работы вашего API ключа:

```bash
curl -X GET "https://api.crypton.studio/v1/merchant" \
  -H "X-Api-Key: your-api-key" \
  -H "Content-Type: application/json"
```

Успешный ответ:

```json
{
  "success": true,
  "data": {
    "id": "merchant_123",
    "name": "Your Business Name",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Часто задаваемые вопросы

### В: Как отличить ключи тестового и продакшн окружения?
О: Ключи тестового окружения содержат `test`, продакшн ключи содержат `live`.

### В: Есть ли срок действия у API ключей?
О: По умолчанию API ключи не истекают, но вы можете установить срок действия в консоли.

### В: Можно ли использовать несколько API ключей одновременно?
О: Да, вы можете создать несколько ключей для разных приложений или сервисов.

### В: Как отозвать API ключ?
О: Удалите соответствующий ключ на странице "Настройки API" в консоли.

---

Готовы начать? Посмотрите [Обзор API](/ru/api/overview) для получения дополнительной информации. 