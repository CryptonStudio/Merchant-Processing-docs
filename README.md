# 🚀 Crypto Payment Gateway Documentation

Полная документация для криптоплатежного шлюза с поддержкой множества блокчейн сетей.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CryptonStudio/Merchant-Processing-docs)

## 🌟 Особенности

- 📚 **Полная документация** - API, руководства, примеры интеграции
- 🌐 **Мультиязычность** - Поддержка английского и русского языков
- 🌙 **Темная тема** - Автоматическое переключение и ручное управление
- 📱 **Адаптивный дизайн** - Отлично работает на всех устройствах
- ⚡ **Быстрая загрузка** - Оптимизированная производительность
- 🔍 **Поиск** - Встроенный поиск по документации

## 🌐 Поддерживаемые сети

- **Bitcoin** - Оригинальная криптовалюта
- **Ethereum** - Смарт-контракты и ERC-20 токены
- **Tron** - Высокопроизводительный блокчейн
- **Polygon** - Решение масштабирования Layer 2
- **BSC** - Binance Smart Chain
- **Arbitrum** - Ethereum Layer 2
- **Fantom** - Высокоскоростной блокчейн
- **Litecoin** - Быстрый и легкий

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонируйте репозиторий
git clone https://github.com/CryptonStudio/Merchant-Processing-docs.git

# Перейдите в папку проекта
cd Merchant-Processing-docs

# Установите зависимости
npm install

# Запустите dev сервер
npm run dev
```

Документация будет доступна по адресу `http://localhost:5173`

### Сборка для продакшн

```bash
# Соберите проект
npm run build

# Предварительный просмотр
npm run preview
```

## 📖 Структура документации

```
docs/
├── en/                     # Английская версия
│   ├── guide/             # Руководства
│   ├── api/               # API справочник
│   ├── integration/       # Интеграция
│   └── examples/          # Примеры кода
├── ru/                     # Русская версия
│   ├── guide/             # Руководства
│   ├── api/               # API справочник
│   ├── integration/       # Интеграция
│   └── examples/          # Примеры кода
└── public/                # Статические файлы
```

## 🛠️ Технологии

- **[VitePress](https://vitepress.dev/)** - Генератор статических сайтов
- **[Vue 3](https://vuejs.org/)** - Фреймворк для интерфейса
- **[TypeScript](https://www.typescriptlang.org/)** - Типизированный JavaScript
- **CSS Custom Properties** - Для темизации

## 🌐 Деплой

Документация готова для деплоя на различных платформах:

### Vercel (Рекомендуется)
```bash
# Автоматический деплой из GitHub
# Настройки в vercel.json
```

### Netlify
```bash
# Настройки в netlify.toml
```

### GitHub Pages
```bash
# Автоматический деплой через GitHub Actions
# Настройки в .github/workflows/deploy.yml
```

## 📝 Содержание документации

### 📘 Руководства
- Введение и быстрый старт
- Архитектура системы
- Управление адресами и кошельками
- Работа с сетями и монетами
- Обработка транзакций
- Выводы средств
- Развертывание

### 🔌 API Справочник
- Обзор API
- Аутентификация
- Адреса
- Сети
- Транзакции
- Выводы
- Webhooks

### 🛠️ Интеграция
- Начало работы
- Go SDK
- TypeScript SDK
- Python SDK

### 💡 Примеры
- Базовое использование
- Поток платежей
- Обработка подписок
- Webhook обработка
- Обработка ошибок

## 🤝 Вклад в проект

Мы приветствуем вклад в улучшение документации!

1. Fork репозитория
2. Создайте ветку для изменений (`git checkout -b feature/improvement`)
3. Внесите изменения
4. Commit изменения (`git commit -am 'Add some improvement'`)
5. Push в ветку (`git push origin feature/improvement`)
6. Создайте Pull Request

## 📄 Лицензия

Этот проект лицензирован под [MIT License](docs/LICENSE).

## 📞 Поддержка

- 📖 [Документация](https://cryptonstudio.github.io/Merchant-Processing-docs/)
- 💬 [Issues](https://github.com/CryptonStudio/Merchant-Processing-docs/issues)
- 📧 Email: support@cryptonstudio.com

---

**Создано с ❤️ командой CryptonStudio**