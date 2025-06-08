# Подписочная модель биллинга

Это руководство демонстрирует, как реализовать подписочную модель биллинга с использованием криптовалютного платежного шлюза.

## Обзор

Подписочная модель позволяет:

- Автоматические регулярные платежи
- Гибкие планы подписки
- Управление жизненным циклом подписки
- Обработка неудачных платежей
- Пробные периоды и скидки

## Создание подписки

```javascript
// services/SubscriptionService.js
const { Gateway } = require('@gateway/crypto-payment-sdk');

class SubscriptionService {
  constructor() {
    this.gateway = new Gateway({
      apiKey: process.env.GATEWAY_API_KEY,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'test'
    });
  }

  async createSubscription(customerId, planId, paymentMethod) {
    try {
      // Создаем адрес для платежей
      const address = await this.gateway.addresses.create({
        network: paymentMethod.network,
        coin: paymentMethod.coin,
        metadata: {
          type: 'subscription',
          customerId,
          planId
        }
      });

      // Создаем подписку
      const subscription = {
        id: this.generateSubscriptionId(),
        customerId,
        planId,
        status: 'active',
        paymentMethod: {
          coin: paymentMethod.coin,
          network: paymentMethod.network,
          address: address.data.address
        }
      };

      return subscription;
    } catch (error) {
      throw new Error(`Ошибка создания подписки: ${error.message}`);
    }
  }

  generateSubscriptionId() {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = SubscriptionService;
```

## Обработка платежей

```javascript
// services/PaymentProcessor.js
class PaymentProcessor {
  async processSubscriptionPayment(subscription) {
    try {
      // Проверяем баланс адреса
      const balance = await this.gateway.addresses.getBalance(
        subscription.paymentMethod.address
      );

      const requiredAmount = parseFloat(subscription.pricing.amount);
      const availableAmount = parseFloat(balance.data.confirmed);

      if (availableAmount >= requiredAmount) {
        await this.processSuccessfulPayment(subscription);
      } else {
        await this.processFailedPayment(subscription);
      }
    } catch (error) {
      console.error(`Ошибка обработки платежа:`, error);
    }
  }

  async processSuccessfulPayment(subscription) {
    // Продлеваем подписку
    console.log(`Платеж успешно обработан для подписки ${subscription.id}`);
  }

  async processFailedPayment(subscription) {
    // Обрабатываем неудачный платеж
    console.log(`Неудачный платеж для подписки ${subscription.id}`);
  }
}

module.exports = PaymentProcessor;
```

## Webhook обработка

```javascript
// webhooks/subscriptionWebhooks.js
class SubscriptionWebhooks {
  static async handleTransactionConfirmed(event) {
    try {
      const { address_id, amount } = event.data;

      // Находим подписку по адресу
      const subscription = await this.findSubscriptionByAddress(address_id);

      if (subscription) {
        await this.processSubscriptionPayment(subscription, event.data);
      }
    } catch (error) {
      console.error('Ошибка обработки webhook подписки:', error);
    }
  }

  static async processSubscriptionPayment(subscription, transactionData) {
    // Обрабатываем платеж подписки
    console.log(`Обработка платежа для подписки ${subscription.id}`);
  }
}

module.exports = SubscriptionWebhooks;
```

## Заключение

Подписочная модель биллинга включает:

- Автоматическое планирование платежей
- Обработку неудачных платежей
- Webhook интеграцию
- Управление жизненным циклом

Эта реализация обеспечивает надежную основу для подписочного биллинга в криптовалютных платежах. 