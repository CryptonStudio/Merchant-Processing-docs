# 错误处理示例

本指南演示了加密货币支付网关的综合错误处理策略，涵盖常见场景和最佳实践。

## 概述

正确的错误处理对于加密货币支付系统至关重要，因为：

- 网络波动和交易延迟
- 地址验证要求
- 余额和确认依赖性
- 速率限制和 API 约束
- Webhook 交付失败

## 错误类型和处理

### 1. API 错误处理

'''javascript
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
    console.error('API 错误:', {
      error: error.message,
      code: error.code,
      context,
      timestamp: new Date().toISOString()
    });

    // 映射常见 API 错误
    switch (error.code) {
      case 'INSUFFICIENT_BALANCE':
        return new GatewayError(
          'INSUFFICIENT_BALANCE',
          '余额不足，无法执行此操作',
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
          '提供的地址无效',
          { 
            address: error.details?.address,
            network: error.details?.network
          },
          400
        );

      case 'RATE_LIMIT_EXCEEDED':
        return new GatewayError(
          'RATE_LIMIT_EXCEEDED',
          '超出 API 速率限制',
          { 
            limit: error.details?.limit,
            resetAt: error.details?.resetAt
          },
          429
        );

      default:
        return new GatewayError(
          'UNKNOWN_ERROR',
          error.message || '发生未知错误',
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
            '操作在 ' + maxRetries + ' 次尝试后失败',
            { originalError: error.message, attempts: maxRetries }
          );
        }
        
        // 指数退避
        const waitTime = delay * Math.pow(2, attempt - 1);
        console.log('尝试 ' + attempt + ' 失败，' + waitTime + 'ms 后重试...');
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
}

module.exports = { GatewayError, ErrorHandler };
'''

### 2. 交易错误处理

'''javascript
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
        analysis.issues.push('交易在区块链上失败');
        analysis.recommendations.push('在区块链浏览器中检查交易哈希');
        analysis.severity = 'error';
        break;

      case 'pending':
        const pendingTime = Date.now() - new Date(transaction.created_at).getTime();
        const maxPendingTime = 30 * 60 * 1000; // 30 分钟
        
        if (pendingTime > maxPendingTime) {
          analysis.issues.push('交易待处理时间过长');
          analysis.recommendations.push('检查网络拥堵状况');
          analysis.severity = 'warning';
        }
        break;

      case 'confirmed':
        analysis.recommendations.push('交易已成功确认');
        break;

      default:
        analysis.issues.push('未知交易状态: ' + transaction.status + '');
        analysis.severity = 'warning';
    }

    return analysis;
  }
}

module.exports = TransactionErrorHandler;
'''

## 最佳实践

### 1. 结构化日志记录

'''javascript
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
    new winston.transports.Console()
  ]
});

module.exports = logger;
'''

### 2. 用户友好的错误消息

'''javascript
// utils/userMessages.js
const userMessages = {
  'INSUFFICIENT_BALANCE': '余额不足，无法执行此操作',
  'INVALID_ADDRESS': '请检查地址是否正确',
  'RATE_LIMIT_EXCEEDED': '请求过多，请稍后再试',
  'NETWORK_ERROR': '网络问题，请稍后再试',
  'TRANSACTION_NOT_FOUND': '未找到交易'
};

function getUserMessage(errorCode) {
  return userMessages[errorCode] || '发生错误，请稍后再试';
}

module.exports = { getUserMessage };
'''

### 3. 集中式错误处理 Express

'''javascript
// middleware/errorMiddleware.js
const { GatewayError } = require('../utils/errorHandler');

function errorMiddleware(error, req, res, next) {
  console.error('发生错误:', {
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
      message: '内部服务器错误',
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = errorMiddleware;
'''

## 结论

正确的错误处理包括：

- 结构化错误类
- 重试逻辑
- 详细日志记录
- 用户友好消息
- 监控和警报

这些示例将帮助您为加密货币支付网关创建强大的错误处理系统。
