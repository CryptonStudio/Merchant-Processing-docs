# Базовое использование

Примеры основных операций с криптоплатежным шлюзом.

## Создание адреса для платежа

```javascript
const { Gateway } = require('@gateway/crypto-payment-sdk');

const gateway = new Gateway({
  apiKey: 'sk_test_your_api_key_here',
  environment: 'test'
});

// Создание адреса для получения USDT на Ethereum
async function createPaymentAddress() {
  try {
    const address = await gateway.addresses.create({
      network: 'ethereum',
      coin: 'usdt',
      type: 'user',
      metadata: {
        customer_id: 'customer_123',
        order_id: 'order_456'
      }
    });
    
    console.log('Адрес создан:', address.data.address);
    return address.data;
  } catch (error) {
    console.error('Ошибка создания адреса:', error);
  }
}
```

## Проверка баланса

```javascript
// Получение баланса адреса
async function checkBalance(addressId) {
  try {
    const address = await gateway.addresses.get(addressId);
    const balance = address.data.balance;
    
    console.log(`Баланс: ${balance.total} USDT`);
    console.log(`Подтвержденный: ${balance.confirmed} USDT`);
    console.log(`Неподтвержденный: ${balance.unconfirmed} USDT`);
    
    return balance;
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
  }
}
```

## Отслеживание транзакций

```javascript
// Получение списка транзакций
async function getTransactions(addressId) {
  try {
    const transactions = await gateway.transactions.list({
      address_id: addressId,
      limit: 10
    });
    
    transactions.data.data.forEach(tx => {
      console.log(`${tx.id}: ${tx.amount} ${tx.coin} - ${tx.status}`);
    });
    
    return transactions.data.data;
  } catch (error) {
    console.error('Ошибка получения транзакций:', error);
  }
}
```

## Создание вывода средств

```javascript
// Вывод средств на внешний адрес
async function createWithdrawal() {
  try {
    const withdrawal = await gateway.withdrawals.create({
      network: 'ethereum',
      coin: 'usdt',
      amount: '100.00',
      to_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      priority: 'standard'
    });
    
    console.log('Вывод создан:', withdrawal.data.id);
    return withdrawal.data;
  } catch (error) {
    console.error('Ошибка создания вывода:', error);
  }
}
```

## Обработка webhook уведомлений

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Обработчик webhook
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-gateway-signature'];
  const payload = JSON.stringify(req.body);
  
  // Проверка подписи
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== `sha256=${expectedSignature}`) {
    return res.status(401).send('Неверная подпись');
  }
  
  const { event, data } = req.body;
  
  switch (event) {
    case 'transaction.confirmed':
      console.log('Транзакция подтверждена:', data.id);
      // Обработка подтвержденной транзакции
      break;
      
    case 'withdrawal.completed':
      console.log('Вывод завершен:', data.id);
      // Обработка завершенного вывода
      break;
      
    default:
      console.log('Неизвестное событие:', event);
  }
  
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook сервер запущен на порту 3000');
});
```

## Полный пример интеграции

```javascript
class PaymentProcessor {
  constructor(apiKey) {
    this.gateway = new Gateway({
      apiKey,
      environment: 'test'
    });
  }
  
  async processPayment(customerId, amount, currency = 'usdt') {
    try {
      // 1. Создаем адрес для платежа
      const address = await this.gateway.addresses.create({
        network: 'ethereum',
        coin: currency,
        type: 'user',
        metadata: {
          customer_id: customerId,
          amount: amount.toString(),
          created_at: new Date().toISOString()
        }
      });
      
      console.log(`Адрес для платежа: ${address.data.address}`);
      
      // 2. Возвращаем информацию для клиента
      return {
        address: address.data.address,
        amount,
        currency,
        qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address.data.address}`,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа
      };
      
    } catch (error) {
      console.error('Ошибка обработки платежа:', error);
      throw error;
    }
  }
  
  async checkPaymentStatus(addressId) {
    try {
      const address = await this.gateway.addresses.get(addressId);
      const transactions = await this.gateway.transactions.list({
        address_id: addressId,
        status: 'confirmed'
      });
      
      const totalReceived = transactions.data.data.reduce((sum, tx) => {
        return sum + parseFloat(tx.amount);
      }, 0);
      
      return {
        received: totalReceived,
        balance: parseFloat(address.data.balance.confirmed),
        transactions: transactions.data.data.length
      };
      
    } catch (error) {
      console.error('Ошибка проверки статуса:', error);
      throw error;
    }
  }
}

// Использование
const processor = new PaymentProcessor('sk_test_your_api_key');

// Создание платежа
processor.processPayment('customer_123', 100)
  .then(payment => {
    console.log('Платеж создан:', payment);
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
```

Этот пример показывает основные операции для работы с криптоплатежным шлюзом.
