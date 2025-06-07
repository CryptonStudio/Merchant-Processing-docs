# Быстрый старт

Начните работу с Криптоплатежным Шлюзом за несколько минут.

## Предварительные требования

Перед началом убедитесь, что у вас есть:

- API ключ из панели управления шлюзом
- Базовое понимание REST API
- Настроенная среда разработки

## Шаг 1: Получите API ключ

1. Зарегистрируйтесь на [your-gateway.com](https://your-gateway.com)
2. Перейдите в раздел API в панели управления
3. Сгенерируйте новый API ключ
4. Сохраните API ключ в безопасном месте

## Шаг 2: Выполните первый API вызов

Проверьте соединение, получив список доступных сетей:

```bash
curl -X GET https://api.your-gateway.com/api/v1/networks \
  -H "X-Api-Key: your-api-key"
```

Ожидаемый ответ:
```json
[
  {
    "network": "ethereum",
    "status": "active",
    "lastBlock": 18500000
  },
  {
    "network": "bitcoin", 
    "status": "active",
    "lastBlock": 820000
  }
]
```

## Шаг 3: Создайте первый адрес

Создайте криптовалютный адрес для получения платежей:

```bash
curl -X POST https://api.your-gateway.com/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: your-api-key" \
  -d '{
    "network": "ethereum"
  }'
```

Ответ:
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c4C87",
  "network": "ethereum",
  "affectedNetworks": ["ethereum"],
  "balances": [
    {
      "coin": "ethereum",
      "balance": "0",
      "contractAddress": null
    }
  ]
}
```

## Шаг 4: Мониторинг адреса

Проверьте баланс вашего нового адреса:

```bash
curl -X GET https://api.your-gateway.com/api/v1/addresses/0x742d35Cc6634C0532925a3b8D4C9db96590c4C87 \
  -H "X-Api-Key: your-api-key"
```

## Шаг 5: Настройка вебхуков (опционально)

Настройте вебхуки для получения уведомлений в реальном времени:

1. Настройте endpoint в вашем приложении для получения вебхуков
2. Настройте URL вебхука в панели управления
3. Обрабатывайте входящие события вебхуков

Пример payload вебхука:
```json
{
  "event": "transaction.confirmed",
  "data": {
    "txId": "0x123...",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c4C87",
    "amount": "1.5",
    "coin": "ethereum",
    "confirmations": 12
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Следующие шаги

Теперь, когда основы работают:

1. **Изучите API** - Ознакомьтесь с нашим [полным справочником API](../api/overview.md)
2. **Используйте SDK** - Ускорьте разработку с нашими [официальными SDK](../integration/getting-started.md)
3. **Изучите безопасность** - Понимайте [аутентификацию и лучшие практики](../api/authentication.md)
4. **Обрабатывайте выводы** - Узнайте, как [обрабатывать выводы средств](../api/withdrawals.md)

## Нужна помощь?

- 📖 [Документация API](../api/overview.md)
- 💻 [Примеры кода](../examples/basic-usage.md)
- 🔧 [Руководства по интеграции](../integration/getting-started.md)
- 📧 [Связаться с поддержкой](mailto:support@your-gateway.com) 