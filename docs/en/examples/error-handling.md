# Error Handling Examples

This guide demonstrates comprehensive error handling strategies for the Crypto Payment Gateway, covering common scenarios and best practices.

## Overview

Proper error handling is crucial for cryptocurrency payment systems due to:

- Network volatility and transaction delays
- Address validation requirements
- Balance and confirmation dependencies
- Rate limiting and API constraints
- Webhook delivery failures

## Error Types and Handling

### 1. API Error Handling

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
    console.error('API Error:', {
      error: error.message,
      code: error.code,
      context,
      timestamp: new Date().toISOString()
    });

    // Map common API errors
    switch (error.code) {
      case 'INSUFFICIENT_BALANCE':
        return new GatewayError(
          'INSUFFICIENT_BALANCE',
          'Insufficient balance for this operation',
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
          'The provided address is invalid',
          { 
            address: error.details?.address,
            network: error.details?.network
          },
          400
        );

      case 'RATE_LIMIT_EXCEEDED':
        return new GatewayError(
          'RATE_LIMIT_EXCEEDED',
          'API rate limit exceeded',
          { 
            limit: error.details?.limit,
            resetAt: error.details?.resetAt
          },
          429
        );

      case 'NETWORK_ERROR':
        return new GatewayError(
          'NETWORK_ERROR',
          'Network connectivity issue',
          { originalError: error.message },
          503
        );

      case 'TRANSACTION_NOT_FOUND':
        return new GatewayError(
          'TRANSACTION_NOT_FOUND',
          'Transaction not found',
          { transactionId: error.details?.transactionId },
          404
        );

      default:
        return new GatewayError(
          'UNKNOWN_ERROR',
          error.message || 'An unknown error occurred',
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
        
        // Don't retry on client errors (4xx)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          throw error;
        }
        
        if (attempt === maxRetries) {
          throw new GatewayError(
            'MAX_RETRIES_EXCEEDED',
            `Operation failed after ${maxRetries} attempts`,
            { originalError: error.message, attempts: maxRetries }
          );
        }
        
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
}

module.exports = { GatewayError, ErrorHandler };
```

### 2. Transaction Error Handling

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
        analysis.issues.push('Transaction failed on blockchain');
        analysis.recommendations.push('Check transaction hash on blockchain explorer');
        analysis.recommendations.push('Verify network congestion status');
        analysis.severity = 'error';
        break;

      case 'pending':
        const pendingTime = Date.now() - new Date(transaction.created_at).getTime();
        const maxPendingTime = 30 * 60 * 1000; // 30 minutes
        
        if (pendingTime > maxPendingTime) {
          analysis.issues.push('Transaction pending for extended period');
          analysis.recommendations.push('Check network congestion');
          analysis.recommendations.push('Consider increasing gas fee');
          analysis.severity = 'warning';
        }
        break;

      case 'confirming':
        if (transaction.confirmations < transaction.required_confirmations) {
          const confirmationProgress = (transaction.confirmations / transaction.required_confirmations) * 100;
          analysis.issues.push(`Waiting for confirmations (${transaction.confirmations}/${transaction.required_confirmations})`);
          analysis.recommendations.push(`${confirmationProgress.toFixed(1)}% confirmed`);
          analysis.severity = 'info';
        }
        break;

      case 'confirmed':
        analysis.recommendations.push('Transaction successfully confirmed');
        break;
    }

    // Check for insufficient gas
    if (transaction.gas_used && transaction.gas_limit) {
      if (transaction.gas_used >= transaction.gas_limit * 0.95) {
        analysis.issues.push('Transaction may have run out of gas');
        analysis.recommendations.push('Increase gas limit for similar transactions');
        analysis.severity = 'warning';
      }
    }

    // Check for low fee
    if (transaction.fee_rate && transaction.network_fee_rate) {
      if (transaction.fee_rate < transaction.network_fee_rate * 0.8) {
        analysis.issues.push('Transaction fee may be too low');
        analysis.recommendations.push('Consider higher fee for faster confirmation');
        analysis.severity = 'warning';
      }
    }

    return analysis;
  }

  handleTransactionRetrievalError(error, transactionId, context) {
    const errorAnalysis = {
      transactionId,
      error: error.message,
      code: error.code,
      severity: 'error',
      possibleCauses: [],
      solutions: []
    };

    switch (error.code) {
      case 'TRANSACTION_NOT_FOUND':
        errorAnalysis.possibleCauses = [
          'Transaction ID is incorrect',
          'Transaction not yet indexed',
          'Transaction on different network'
        ];
        errorAnalysis.solutions = [
          'Verify transaction ID format',
          'Wait a few minutes and retry',
          'Check if transaction is on correct network'
        ];
        break;

      case 'NETWORK_ERROR':
        errorAnalysis.possibleCauses = [
          'Blockchain node connectivity issues',
          'Network congestion',
          'Temporary service outage'
        ];
        errorAnalysis.solutions = [
          'Retry after a few minutes',
          'Check network status page',
          'Contact support if issue persists'
        ];
        break;

      case 'RATE_LIMIT_EXCEEDED':
        errorAnalysis.possibleCauses = [
          'Too many API requests',
          'Concurrent request limit reached'
        ];
        errorAnalysis.solutions = [
          'Implement request throttling',
          'Add delays between requests',
          'Use webhook notifications instead of polling'
        ];
        break;

      default:
        errorAnalysis.possibleCauses = ['Unknown error occurred'];
        errorAnalysis.solutions = ['Contact technical support'];
    }

    return errorAnalysis;
  }

  async monitorStuckTransactions() {
    try {
      // Get transactions that have been pending for too long
      const stuckTransactions = await this.gateway.transactions.list({
        status: 'pending',
        created_before: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
      });

      const analyses = [];
      
      for (const transaction of stuckTransactions.data.data) {
        const analysis = await this.handleTransactionErrors(transaction.id, {
          monitoring: true,
          checkType: 'stuck_transaction'
        });
        
        analyses.push(analysis);
        
        // Send alert for critical issues
        if (analysis.severity === 'error') {
          await this.sendTransactionAlert(transaction, analysis);
        }
      }

      return analyses;
    } catch (error) {
      console.error('Failed to monitor stuck transactions:', error);
      throw ErrorHandler.handleApiError(error, { operation: 'monitor_stuck_transactions' });
    }
  }

  async sendTransactionAlert(transaction, analysis) {
    // Implementation depends on your notification system
    console.log('TRANSACTION ALERT:', {
      transactionId: transaction.id,
      analysis,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = TransactionErrorHandler;
```

### 3. Address Validation and Error Handling

```javascript
// services/AddressValidator.js
class AddressValidator {
  static validateAddress(address, network) {
    const validationResult = {
      isValid: false,
      errors: [],
      warnings: [],
      normalizedAddress: null
    };

    try {
      // Basic format validation
      if (!address || typeof address !== 'string') {
        validationResult.errors.push('Address is required and must be a string');
        return validationResult;
      }

      // Trim whitespace
      const trimmedAddress = address.trim();
      
      if (trimmedAddress.length === 0) {
        validationResult.errors.push('Address cannot be empty');
        return validationResult;
      }

      // Network-specific validation
      switch (network.toLowerCase()) {
        case 'ethereum':
        case 'polygon':
        case 'bsc':
          return this.validateEthereumAddress(trimmedAddress, validationResult);
        
        case 'bitcoin':
          return this.validateBitcoinAddress(trimmedAddress, validationResult);
        
        case 'tron':
          return this.validateTronAddress(trimmedAddress, validationResult);
        
        default:
          validationResult.errors.push(`Unsupported network: ${network}`);
          return validationResult;
      }
    } catch (error) {
      validationResult.errors.push(`Validation error: ${error.message}`);
      return validationResult;
    }
  }

  static validateEthereumAddress(address, result) {
    // Check if it starts with 0x
    if (!address.startsWith('0x')) {
      result.errors.push('Ethereum address must start with 0x');
      return result;
    }

    // Check length (42 characters total: 0x + 40 hex chars)
    if (address.length !== 42) {
      result.errors.push('Ethereum address must be 42 characters long');
      return result;
    }

    // Check if it contains only valid hex characters
    const hexPattern = /^0x[a-fA-F0-9]{40}$/;
    if (!hexPattern.test(address)) {
      result.errors.push('Ethereum address contains invalid characters');
      return result;
    }

    // Check for common mistakes
    if (address === '0x0000000000000000000000000000000000000000') {
      result.errors.push('Cannot use zero address');
      return result;
    }

    // Checksum validation (if mixed case)
    if (this.hasMixedCase(address)) {
      const checksumValid = this.validateEthereumChecksum(address);
      if (!checksumValid) {
        result.warnings.push('Address checksum is invalid');
      }
    }

    result.isValid = true;
    result.normalizedAddress = address.toLowerCase();
    return result;
  }

  static validateBitcoinAddress(address, result) {
    // Basic Bitcoin address validation
    const legacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const segwitPattern = /^bc1[a-z0-9]{39,59}$/;
    
    if (!legacyPattern.test(address) && !segwitPattern.test(address)) {
      result.errors.push('Invalid Bitcoin address format');
      return result;
    }

    result.isValid = true;
    result.normalizedAddress = address;
    return result;
  }

  static validateTronAddress(address, result) {
    // Tron address validation
    if (address.length !== 34) {
      result.errors.push('Tron address must be 34 characters long');
      return result;
    }

    if (!address.startsWith('T')) {
      result.errors.push('Tron address must start with T');
      return result;
    }

    const base58Pattern = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    if (!base58Pattern.test(address)) {
      result.errors.push('Tron address contains invalid characters');
      return result;
    }

    result.isValid = true;
    result.normalizedAddress = address;
    return result;
  }

  static hasMixedCase(address) {
    return address !== address.toLowerCase() && address !== address.toUpperCase();
  }

  static validateEthereumChecksum(address) {
    // Simplified checksum validation
    // In production, use a proper library like ethers.js
    return true; // Placeholder
  }
}

module.exports = AddressValidator;
```

### 4. Webhook Error Handling

```javascript
// middleware/webhookErrorHandler.js
const crypto = require('crypto');
const { ErrorHandler, GatewayError } = require('../utils/errorHandler');

class WebhookErrorHandler {
  static verifySignature(req, res, next) {
    try {
      const signature = req.headers['x-gateway-signature'];
      const timestamp = req.headers['x-gateway-timestamp'];
      const payload = JSON.stringify(req.body);

      if (!signature || !timestamp) {
        throw new GatewayError(
          'MISSING_SIGNATURE',
          'Webhook signature or timestamp missing',
          {},
          401
        );
      }

      // Check timestamp to prevent replay attacks
      const currentTime = Math.floor(Date.now() / 1000);
      const webhookTime = parseInt(timestamp);
      
      if (Math.abs(currentTime - webhookTime) > 300) { // 5 minutes tolerance
        throw new GatewayError(
          'TIMESTAMP_TOO_OLD',
          'Webhook timestamp is too old',
          { timestamp, currentTime },
          401
        );
      }

      // Verify signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(timestamp + payload)
        .digest('hex');

      if (signature !== `sha256=${expectedSignature}`) {
        throw new GatewayError(
          'INVALID_SIGNATURE',
          'Webhook signature verification failed',
          {},
          401
        );
      }

      next();
    } catch (error) {
      const handledError = ErrorHandler.handleApiError(error);
      res.status(handledError.statusCode).json({
        error: handledError.code,
        message: handledError.message
      });
    }
  }

  static async processWebhook(req, res, next) {
    try {
      const { event, data } = req.body;

      // Validate webhook payload
      if (!event || !data) {
        throw new GatewayError(
          'INVALID_PAYLOAD',
          'Webhook payload is missing required fields',
          { receivedFields: Object.keys(req.body) },
          400
        );
      }

      // Add idempotency check
      const webhookId = req.headers['x-gateway-webhook-id'];
      if (webhookId) {
        const processed = await this.checkWebhookProcessed(webhookId);
        if (processed) {
          return res.status(200).json({ 
            success: true, 
            message: 'Webhook already processed' 
          });
        }
      }

      // Process webhook with error handling
      await ErrorHandler.withRetry(async () => {
        await this.handleWebhookEvent(event, data);
      }, 3, 1000);

      // Mark webhook as processed
      if (webhookId) {
        await this.markWebhookProcessed(webhookId);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      
      // Return success to prevent retries for client errors
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return res.status(200).json({ 
          success: false, 
          error: error.message 
        });
      }

      // Return error for server issues to trigger retries
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  static async handleWebhookEvent(event, data) {
    switch (event) {
      case 'transaction.confirmed':
        await this.handleTransactionConfirmed(data);
        break;
      case 'transaction.failed':
        await this.handleTransactionFailed(data);
        break;
      case 'address.balance_updated':
        await this.handleBalanceUpdated(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
  }

  static async handleTransactionConfirmed(transaction) {
    try {
      // Process confirmed transaction
      console.log('Processing confirmed transaction:', transaction.id);
      
      // Your business logic here
      
    } catch (error) {
      throw new GatewayError(
        'TRANSACTION_PROCESSING_FAILED',
        'Failed to process confirmed transaction',
        { transactionId: transaction.id, error: error.message }
      );
    }
  }

  static async handleTransactionFailed(transaction) {
    try {
      // Handle failed transaction
      console.log('Processing failed transaction:', transaction.id);
      
      // Your failure handling logic here
      
    } catch (error) {
      throw new GatewayError(
        'FAILED_TRANSACTION_HANDLING_ERROR',
        'Failed to handle failed transaction',
        { transactionId: transaction.id, error: error.message }
      );
    }
  }

  static async checkWebhookProcessed(webhookId) {
    // Check if webhook was already processed
    // Implementation depends on your storage solution
    return false;
  }

  static async markWebhookProcessed(webhookId) {
    // Mark webhook as processed
    // Implementation depends on your storage solution
    console.log(`Marking webhook ${webhookId} as processed`);
  }
}

module.exports = WebhookErrorHandler;
```

### 5. Express Error Handling Middleware

```javascript
// middleware/errorMiddleware.js
const { GatewayError } = require('../utils/errorHandler');

function errorHandler(err, req, res, next) {
  console.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle known Gateway errors
  if (err instanceof GatewayError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: err.timestamp
      }
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.details || {}
      }
    });
  }

  // Handle database errors
  if (err.name === 'MongoError' || err.name === 'SequelizeError') {
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed'
      }
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`
    }
  });
}

module.exports = { errorHandler, notFoundHandler };
```

### 6. Client-Side Error Handling

```javascript
// client/errorHandler.js
class ClientErrorHandler {
  static async handleApiCall(apiCall, options = {}) {
    const { 
      maxRetries = 3, 
      retryDelay = 1000, 
      showUserError = true,
      fallbackValue = null 
    } = options;

    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await apiCall();
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'API request failed');
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors
        if (error.status >= 400 && error.status < 500) {
          break;
        }
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          continue;
        }
      }
    }
    
    // Handle final error
    if (showUserError) {
      this.showUserError(lastError);
    }
    
    if (fallbackValue !== null) {
      return fallbackValue;
    }
    
    throw lastError;
  }

  static showUserError(error) {
    const userMessage = this.getUserFriendlyMessage(error);
    
    // Show error to user (implementation depends on your UI framework)
    if (typeof window !== 'undefined') {
      // Browser environment
      alert(userMessage);
    } else {
      // Node.js environment
      console.error('User Error:', userMessage);
    }
  }

  static getUserFriendlyMessage(error) {
    const errorMessage = error.message || 'Unknown error';
    
    // Map technical errors to user-friendly messages
    const errorMappings = {
      'INSUFFICIENT_BALANCE': 'You don\'t have enough balance for this transaction.',
      'INVALID_ADDRESS': 'The address you entered is not valid. Please check and try again.',
      'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a moment and try again.',
      'NETWORK_ERROR': 'Network connection issue. Please check your internet connection.',
      'TRANSACTION_NOT_FOUND': 'Transaction not found. It may not be processed yet.',
      'WEBHOOK_SIGNATURE_INVALID': 'Security verification failed. Please contact support.'
    };

    // Check if error message contains known error codes
    for (const [code, message] of Object.entries(errorMappings)) {
      if (errorMessage.includes(code)) {
        return message;
      }
    }

    // Default user-friendly message
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  }
}

// Usage example
async function createPaymentAddress() {
  try {
    const result = await ClientErrorHandler.handleApiCall(
      () => fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network: 'ethereum', coin: 'usdt' })
      }),
      {
        maxRetries: 3,
        showUserError: true,
        fallbackValue: null
      }
    );
    
    return result;
  } catch (error) {
    console.error('Failed to create payment address:', error);
    return null;
  }
}
```

## Best Practices

### 1. Error Logging
- Log all errors with context
- Include timestamps and request IDs
- Use structured logging formats
- Monitor error rates and patterns

### 2. User Experience
- Provide clear, actionable error messages
- Implement graceful degradation
- Show loading states during retries
- Offer alternative solutions

### 3. Monitoring and Alerting
- Set up alerts for critical errors
- Monitor transaction failure rates
- Track API response times
- Monitor webhook delivery success

### 4. Recovery Strategies
- Implement automatic retries with backoff
- Provide manual retry options
- Cache data for offline scenarios
- Implement circuit breakers for external services

This comprehensive error handling system ensures robust operation of your cryptocurrency payment gateway with proper user feedback and system monitoring. 