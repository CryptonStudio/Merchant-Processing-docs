# Демо API Окружение

Криптоплатежный шлюз предоставляет демо-окружение для тестирования и разработки.

## Детали Демо API

**Базовый URL:** `https://cp-merch-dev.wsdemo.online/api`

**OpenAPI Документация:** https://cp-merch-dev.wsdemo.online/api/openapi/

## Примеры API

Вот несколько основных эндпоинтов API, которые можно протестировать с помощью curl или любого HTTP клиента:

### Получить сети
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks
```

### Детали сети
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks/ethereum
```

### Создать адрес
```bash
curl -X POST https://cp-merch-dev.wsdemo.online/api/addresses \
  -H "Content-Type: application/json" \
  -d '{"network": "ethereum", "type": "user"}'
```

### Баланс горячего кошелька
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/addresses/hot-wallet/ethereum
```

### Получить транзакции
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/transactions?limit=5
```

### Номера блоков
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks/last-number-blocks
```

::: tip Интерактивное тестирование
Для интерактивного тестирования API посетите OpenAPI документацию:
**https://cp-merch-dev.wsdemo.online/api/openapi/**

Это предоставляет полный Swagger UI, где вы можете:
- Ввести ваш API ключ
- Тестировать все эндпоинты интерактивно
- Видеть ответы в реальном времени
- Скачать спецификации API
:::

## Возможности

- **Тестовые данные**: Предзаполнено тестовыми сетями, адресами и транзакциями
- **Без реальных транзакций**: Все операции симулированы - реальная криптовалюта не обрабатывается
- **Полное покрытие API**: Все эндпоинты доступны для тестирования
- **Ежедневный сброс**: Демо-данные сбрасываются каждые 24 часа

## Начало работы

### 1. Изучите API документацию

Посетите интерактивную OpenAPI документацию:
```
https://cp-merch-dev.wsdemo.online/api/openapi/
```

### 2. Тестируйте базовые эндпоинты

Список доступных сетей:
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks
```

Получить детали сети:
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/networks/ethereum
```

### 3. Создайте тестовые адреса

Создать новый адрес:
```bash
curl -X POST https://cp-merch-dev.wsdemo.online/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "type": "user"
  }'
```

### 4. Запросите балансы

Проверить балансы адреса:
```bash
curl -X GET https://cp-merch-dev.wsdemo.online/api/addresses/hot-wallet/ethereum
```

## Доступные тестовые данные

### Сети
- Bitcoin (BTC)
- Ethereum (ETH)
- Tron (TRX)
- Polygon (MATIC)
- BSC (BNB)
- Arbitrum (ARB)
- Fantom (FTM)
- Litecoin (LTC)

### Типы адресов
- `user` - Индивидуальные пользовательские адреса
- `hot` - Адреса горячих кошельков
- `cold` - Адреса холодного хранения
- `tokens_collector` - Адреса сборщиков токенов

### Примеры транзакций
Демо-окружение включает примеры транзакций с различными статусами:
- Ожидающие транзакции
- Подтвержденные транзакции
- Неудачные транзакции

## Ограничения

::: warning Ограничения демо
- Нет реальных криптовалютных транзакций
- Данные сбрасываются каждые 24 часа
- Ограничения скорости могут быть более строгими
- Некоторые продвинутые функции могут быть отключены
:::

## Переход на продакшн

Когда вы готовы перейти на продакшн:

1. **Получите продакшн API ключ**: Зарегистрируйтесь на [your-gateway.com](https://your-gateway.com)
2. **Обновите базовый URL**: Измените на `https://api.your-gateway.com/api/v1`
3. **Настройте вебхуки**: Установите продакшн эндпоинты вебхуков
4. **Тестируйте с малыми суммами**: Начните с небольших тестовых транзакций

## Поддержка

Нужна помощь с демо-окружением?

- 📖 [Полная API документация](../api/overview.md)
- 💻 [Примеры кода](../examples/basic-usage.md)
- 🔧 [Руководства по интеграции](../integration/getting-started.md)
- 📧 [Связаться с поддержкой](mailto:support@your-gateway.com) 