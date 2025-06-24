---
layout: home

hero:
  name: "Криптоплатежный Шлюз"
  text: "Полное решение для обработки платежей"
  tagline: Принимайте и обрабатывайте криптовалютные платежи с легкостью
  image:
    src: /hero-image.svg
    alt: Криптоплатежный Шлюз
  actions:
    - theme: brand
      text: Начать работу
      link: /ru/guide/introduction
    - theme: alt
      text: API Справочник
      link: /ru/api/overview
    - theme: alt
      text: English Version
      link: /en/guide/introduction

features:
  - icon: 🔐
    title: Безопасность и надежность
    details: Корпоративный уровень безопасности с мультиподписными кошельками и продвинутым шифрованием
  - icon: 🌐
    title: Поддержка множества сетей
    details: Поддержка Bitcoin, Ethereum, Tron, Polygon, BSC, Arbitrum, Fantom и Litecoin
  - icon: ⚡
    title: Быстрая интеграция
    details: RESTful API с SDK для Go, TypeScript и Python
  - icon: 💰
    title: Экономичность
    details: Оптимизированная агрегация выводов для минимизации комиссий
  - icon: 🔄
    title: Обработка в реальном времени
    details: Мгновенные уведомления о транзакциях и обновления баланса в реальном времени
  - icon: 🛠️
    title: Удобство для разработчиков
    details: Полная документация, примеры кода и интерактивный API explorer
  - icon: 🧪
    title: Демо-окружение
    details: Тестируйте с нашим демо API на cp-merch-dev.wsdemo.online/api/openapi/
  - icon: 🌙
    title: Поддержка темной темы
    details: Красивая темная тема с автоматическим определением системных настроек и ручным переключением
---

## Поддерживаемые сети

- **Bitcoin** – оригинальная криптовалюта
- **Ethereum** – смарт-контракты и ERC-20 токены  
- **Tron** – высокопроизводительный блокчейн
- **Polygon** – решение масштабирования Layer 2
- **BSC** – binance Smart Chain
- **Arbitrum** – ethereum Layer 2
- **Fantom** – высокоскоростной блокчейн
- **Litecoin** – быстрый и легкий
- **TON** – быстрая и масштабируемая блокчейн-платформа

## Быстрый старт

```bash
# Клонируйте репозиторий
git clone https://github.com/your-org/merchant-processing.git

# Установите зависимости
pnpm install

# Настройте окружение
cp .env.example .env

# Инициализируйте сети
./init.sh -e testnet

# Запустите шлюз
pnpm start
```

<style>
.network-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.network-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.network-item:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.network-item img {
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
}

.network-item span {
  font-weight: 500;
  color: var(--vp-c-text-1);
}
</style> 