# Обработка ошибок

Это руководство описывает лучшие практики обработки ошибок в криптовалютном платежном шлюзе.

## Типы ошибок

### 1. Ошибки API

```javascript
// Пример обработки ошибок API
try {
  const response = await gateway.addresses.create({
    network: 'ethereum',
    coin: 'usdt'
  });
} catch (error) {
  if (error.code === 'INVALID_NETWORK') {
    console.error('Неподдерживаемая сеть:', error.message);
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.error('Превышен лимит запросов:', error.message);
  } else {
    console.error('Неизвестная ошибка:', error.message);
  }
}
```

### 2. Ошибки транзакций

```javascript
// Обработка ошибок транзакций
async function handleTransactionError(transactionId) {
  try {
    const transaction = await gateway.transactions.get(transactionId);
    
    if (transaction.status === 'failed') {
      console.error('Транзакция не удалась:', transaction.error);
      // Уведомить пользователя
    }
  } catch (error) {
    console.error('Ошибка получения транзакции:', error.message);
  }
}
```

### 3. Ошибки сети

```javascript
// Обработка сетевых ошибок
async function handleNetworkError(operation) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      
      if (error.code === 'NETWORK_ERROR' && attempt < maxRetries) {
        console.log(`Повтор попытки ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        throw error;
      }
    }
  }
}
```

## Централизованная обработка

```javascript
// Middleware для обработки ошибок
function errorHandler(error, req, res, next) {
  console.error('Ошибка:', error);
  
  if (error.code === 'VALIDATION_ERROR') {
    return res.status(400).json({
      success: false,
      error: 'Ошибка валидации данных',
      details: error.details
    });
  }
  
  if (error.code === 'INSUFFICIENT_BALANCE') {
    return res.status(400).json({
      success: false,
      error: 'Недостаточно средств'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера'
  });
}
```

## Логирование ошибок

```javascript
// Структурированное логирование
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console()
  ]
});

// Использование
try {
  // Операция
} catch (error) {
  logger.error('Ошибка операции', {
    error: error.message,
    stack: error.stack,
    context: { userId, operation: 'create_address' }
  });
}
```

## Мониторинг и алерты

```javascript
// Отправка алертов для критических ошибок
async function sendAlert(error, context) {
  const criticalErrors = [
    'INSUFFICIENT_BALANCE',
    'TRANSACTION_FAILED',
    'NETWORK_ERROR'
  ];
  
  if (criticalErrors.includes(error.code)) {
    // Отправить уведомление администратору
    await notificationService.sendAlert({
      type: 'critical_error',
      error: error.message,
      context
    });
  }
}
```

## Лучшие практики

1. **Всегда обрабатывайте ошибки** - Никогда не игнорируйте ошибки
2. **Логируйте подробности** - Включайте контекст и стек вызовов
3. **Используйте повторы** - Для временных сетевых ошибок
4. **Уведомляйте пользователей** - Предоставляйте понятные сообщения
5. **Мониторьте критические ошибки** - Настройте алерты

## Заключение

Правильная обработка ошибок обеспечивает:
- Стабильность системы
- Лучший пользовательский опыт
- Быструю диагностику проблем
- Надежность платежных операций
