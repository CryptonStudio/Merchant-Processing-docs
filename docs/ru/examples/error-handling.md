# Примеры обработки ошибок

Это руководство демонстрирует комплексные стратегии обработки ошибок для криптовалютного платежного шлюза, охватывая распространенные сценарии и лучшие практики.

## Обзор

Правильная обработка ошибок критически важна для систем криптовалютных платежей из-за:

- Волатильности сети и задержек транзакций
- Требований к валидации адресов
- Зависимостей от баланса и подтверждений
- Ограничений скорости и API
- Сбоев доставки webhook

## Типы ошибок и их обработка

### 1. Обработка ошибок API

```javascript
// utils/errorHandler.js
class GatewayError extends Error {
  constructor(code, message, details = {}, statusCode = 500) {
    super(message);
    this.name = 'GatewayError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

class ErrorHandler {
  static handleApiError(error, context = {}) {
    console.error('Ошибка API:', {
      error: error.message,
      code: error.code,
      context,
      timestamp: new Date().toISOString()
    });

    // Сопоставление распространенных ошибок API
    switch (error.code) {
      case 'INSUFFICIENT_BALANCE':
        return new GatewayError(
          'INSUFFICIENT_BALANCE',
          'Недостаточно средств для выполнения операции',
          { 
            available: error.details?.available,
            required: error.details?.required,
            coin: error.details?.coin
          },
          400
        );

      case 'INVALID_ADDRESS':
        return new GatewayError(
          'INVALID_ADDRESS',
          'Предоставленный адрес недействителен',
          { 
            address: error.details?.address,
            network: error.details?.network
          },
          400
        );

      case 'RATE_LIMIT_EXCEEDED':
        return new GatewayError(
          'RATE_LIMIT_EXCEEDED',
          'Превышен лимит скорости API',
          { 
            limit: error.details?.limit,
            resetAt: error.details?.resetAt
          },
          429
        );

      default:
        return new GatewayError(
          'UNKNOWN_ERROR',
          error.message || 'Произошла неизвестная ошибка',
          error.details || {},
          500
        );
    }
  }

  static async withRetry(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw new GatewayError(
            'MAX_RETRIES_EXCEEDED',
            `Операция не удалась после ${maxRetries} попыток`,
            { originalError: error.message, attempts: maxRetries }
          );
        }
        
        // Экспоненциальная задержка
        const waitTime = delay * Math.pow(2, attempt - 1);
        console.log(`Попытка ${attempt} не удалась, повтор через ${waitTime}мс...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
}

module.exports = { GatewayError, ErrorHandler };
```

### 2. Обработка ошибок транзакций

```javascript
// services/TransactionErrorHandler.js
const { Gateway } = require('@gateway/crypto-payment-sdk');
const { ErrorHandler, GatewayError } = require('../utils/errorHandler');

class TransactionErrorHandler {
  constructor() {
    this.gateway = new Gateway({
      apiKey: process.env.GATEWAY_API_KEY,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'test'
    });
  }

  async handleTransactionErrors(transactionId, context = {}) {
    try {
      const transaction = await ErrorHandler.withRetry(async () => {
        return await this.gateway.transactions.get(transactionId);
      });

      return this.analyzeTransactionStatus(transaction.data, context);
    } catch (error) {
      return this.handleTransactionRetrievalError(error, transactionId, context);
    }
  }

  analyzeTransactionStatus(transaction, context) {
    const analysis = {
      transactionId: transaction.id,
      status: transaction.status,
      issues: [],
      recommendations: [],
      severity: 'info'
    };

    switch (transaction.status) {
      case 'failed':
        analysis.issues.push('Транзакция не удалась в блокчейне');
        analysis.recommendations.push('Проверьте хеш транзакции в обозревателе блокчейна');
        analysis.severity = 'error';
        break;

      case 'pending':
        const pendingTime = Date.now() - new Date(transaction.created_at).getTime();
        const maxPendingTime = 30 * 60 * 1000; // 30 минут
        
        if (pendingTime > maxPendingTime) {
          analysis.issues.push('Транзакция в ожидании длительное время');
          analysis.recommendations.push('Проверьте загруженность сети');
          analysis.severity = 'warning';
        }
        break;

      case 'confirmed':
        analysis.recommendations.push('Транзакция успешно подтверждена');
        break;

      default:
        analysis.issues.push(`Неизвестный статус транзакции: ${transaction.status}`);
        analysis.severity = 'warning';
    }

    return analysis;
  }
}

module.exports = TransactionErrorHandler;
```

## Лучшие практики

### 1. Структурированное логирование

```javascript
// utils/logger.js
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
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

### 2. Пользовательские сообщения об ошибках

```javascript
// utils/userMessages.js
const userMessages = {
  'INSUFFICIENT_BALANCE': 'Недостаточно средств для выполнения операции',
  'INVALID_ADDRESS': 'Пожалуйста, проверьте правильность адреса',
  'RATE_LIMIT_EXCEEDED': 'Слишком много запросов. Попробуйте позже',
  'NETWORK_ERROR': 'Проблема с сетью. Попробуйте позже',
  'TRANSACTION_NOT_FOUND': 'Транзакция не найдена'
};

function getUserMessage(errorCode) {
  return userMessages[errorCode] || 'Произошла ошибка. Попробуйте позже';
}

module.exports = { getUserMessage };
```

### 3. Централизованная обработка ошибок Express

```javascript
// middleware/errorMiddleware.js
const { GatewayError } = require('../utils/errorHandler');

function errorMiddleware(error, req, res, next) {
  console.error('Error occurred:', {
    error: error.message,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error instanceof GatewayError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Внутренняя ошибка сервера',
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = errorMiddleware;
```

## Заключение

Правильная обработка ошибок включает:

- Структурированные классы ошибок
- Логику повторных попыток
- Подробное логирование
- Пользовательские сообщения
- Мониторинг и алерты

Эти примеры помогут создать надежную систему обработки ошибок для вашего криптовалютного платежного шлюза. 