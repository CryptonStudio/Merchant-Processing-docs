# Демонстрация темы

Эта страница демонстрирует различные элементы темы документации.

## Заголовки

# Заголовок 1
## Заголовок 2
### Заголовок 3
#### Заголовок 4
##### Заголовок 5
###### Заголовок 6

## Текстовое форматирование

**Жирный текст** и *курсив*, а также ***жирный курсив***.

`Встроенный код` и ~~зачеркнутый текст~~.

## Списки

### Маркированный список
- Первый элемент
- Второй элемент
  - Вложенный элемент
  - Еще один вложенный элемент
- Третий элемент

### Нумерованный список
1. Первый пункт
2. Второй пункт
   1. Подпункт A
   2. Подпункт B
3. Третий пункт

## Блоки кода

### JavaScript
```javascript
const gateway = new Gateway({
  apiKey: 'your-api-key',
  environment: 'production'
});

async function createAddress() {
  try {
    const address = await gateway.addresses.create({
      network: 'ethereum',
      coin: 'usdt'
    });
    console.log('Адрес создан:', address.data.address);
  } catch (error) {
    console.error('Ошибка:', error.message);
  }
}
```

### Python
```python
from gateway import Gateway

gateway = Gateway(
    api_key='your-api-key',
    environment='production'
)

def create_address():
    try:
        address = gateway.addresses.create(
            network='ethereum',
            coin='usdt'
        )
        print(f'Адрес создан: {address.data.address}')
    except Exception as error:
        print(f'Ошибка: {error}')
```

### cURL
```bash
curl -X POST "https://api.crypton.studio/v1/addresses" \
  -H "X-Api-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "ethereum",
    "coin": "usdt"
  }'
```

## Таблицы

| Сеть | Монета | Комиссия | Время подтверждения |
|------|--------|----------|-------------------|
| Ethereum | ETH | 0.001 ETH | 1-3 минуты |
| Ethereum | USDT | 0.001 ETH | 1-3 минуты |
| Bitcoin | BTC | 0.0001 BTC | 10-60 минут |
| Tron | TRX | 1 TRX | 1-3 минуты |
| BSC | BNB | 0.0001 BNB | 1-3 минуты |

## Предупреждения

::: info Информация
Это информационное сообщение с полезными деталями.
:::

::: tip Совет
Это полезный совет для разработчиков.
:::

::: warning Предупреждение
Это предупреждение о потенциальных проблемах.
:::

::: danger Опасность
Это критическое предупреждение о безопасности.
:::

## Ссылки

[Внутренняя ссылка на API](/ru/api/overview)

[Внешняя ссылка](https://crypton.studio/)

## Изображения

![Логотип Crypton Studio](https://crypton.studio/logo.png)

## Цитаты

> Криптовалютные платежи - это будущее цифровой экономики.
> Они обеспечивают быстрые, безопасные и глобальные транзакции.

## Горизонтальная линия

---

## Встроенный HTML

<div style="background: #f0f8ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #0066cc;">
  <strong>Пользовательский блок:</strong> Этот блок создан с помощью HTML для демонстрации возможностей.
</div>

## Эмодзи

🚀 Быстрые платежи  
🔒 Безопасные транзакции  
🌍 Глобальная доступность  
💰 Низкие комиссии  

## Математические формулы

Встроенная формула: \(E = mc^2\)

Блочная формула:
\[
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
\]

## Задачи

- [x] Завершенная задача
- [ ] Незавершенная задача
- [ ] Еще одна задача

## Сноски

Это текст со сноской[^1].

[^1]: Это содержимое сноски.

---

Эта страница демонстрирует основные возможности форматирования в документации Crypton Studio.
