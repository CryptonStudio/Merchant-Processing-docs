# 🚀 Deployment Guide

Инструкции по размещению документации в интернете на различных платформах.

## 📋 Подготовка к деплою

Убедитесь, что проект собирается без ошибок:

```bash
npm run build
```

## 🌐 Варианты хостинга

### 1. Vercel (Рекомендуется)

**Преимущества:**
- ✅ Бесплатный план
- ✅ Автоматический деплой из Git
- ✅ Глобальный CDN
- ✅ Поддержка кастомных доменов
- ✅ HTTPS из коробки

**Инструкция:**

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Vercel автоматически определит настройки из `vercel.json`
4. Нажмите "Deploy"

**Результат:** Ваша документация будет доступна по адресу `https://your-project.vercel.app`

### 2. Netlify

**Преимущества:**
- ✅ Бесплатный план
- ✅ Простая настройка
- ✅ Поддержка форм
- ✅ Функции Edge

**Инструкция:**

1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Подключите ваш GitHub репозиторий
3. Netlify автоматически использует настройки из `netlify.toml`
4. Нажмите "Deploy site"

**Результат:** Ваша документация будет доступна по адресу `https://your-project.netlify.app`

### 3. GitHub Pages

**Преимущества:**
- ✅ Бесплатно для публичных репозиториев
- ✅ Интеграция с GitHub
- ✅ Автоматический деплой через Actions

**Инструкция:**

1. Убедитесь, что файл `.github/workflows/deploy.yml` настроен
2. Перейдите в Settings → Pages вашего репозитория
3. Выберите "GitHub Actions" как источник
4. Сделайте push в ветку `main`

**Результат:** Ваша документация будет доступна по адресу `https://username.github.io/repository-name`

### 4. Cloudflare Pages

**Преимущества:**
- ✅ Бесплатный план
- ✅ Быстрый CDN
- ✅ Отличная производительность

**Инструкция:**

1. Зарегистрируйтесь на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Подключите ваш GitHub репозиторий
3. Настройте сборку:
   - Build command: `npm run build`
   - Build output directory: `docs/.vitepress/dist`
4. Нажмите "Save and Deploy"

## 🔧 Настройка кастомного домена

### Для Vercel:
1. Перейдите в настройки проекта
2. Добавьте ваш домен в разделе "Domains"
3. Настройте DNS записи у вашего провайдера

### Для Netlify:
1. Перейдите в Site settings → Domain management
2. Добавьте кастомный домен
3. Настройте DNS записи

### Для GitHub Pages:
1. Добавьте файл `CNAME` в корень репозитория с вашим доменом
2. Настройте DNS записи у провайдера

## 🚀 Быстрый деплой на Vercel

Самый простой способ - использовать кнопку деплоя:

<!-- Кнопка деплоя будет доступна после загрузки проекта на GitHub -->
<!-- [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/merchant-processing-docs) -->

## 📊 Мониторинг и аналитика

### Google Analytics
Добавьте в `docs/.vitepress/config.ts`:

```typescript
export default defineConfig({
  head: [
    ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    `]
  ]
})
```

### Vercel Analytics
Добавьте в `package.json`:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.0.0"
  }
}
```

## 🔄 Автоматические обновления

Все платформы поддерживают автоматический деплой при push в репозиторий:

- **Vercel/Netlify**: Автоматически пересобирают при каждом push
- **GitHub Pages**: Использует GitHub Actions workflow
- **Cloudflare Pages**: Автоматически отслеживает изменения

## 🛠️ Troubleshooting

### Проблема: Build fails
```bash
# Проверьте локально
npm run build

# Очистите кэш
rm -rf node_modules package-lock.json
npm install
```

### Проблема: 404 на страницах
Убедитесь, что настроены правильные redirects в конфигурации платформы.

### Проблема: Медленная загрузка
- Включите сжатие gzip
- Используйте CDN
- Оптимизируйте изображения

## 📈 Оптимизация производительности

### 1. Сжатие изображений
```bash
# Установите imagemin
npm install -D imagemin imagemin-webp

# Конвертируйте изображения в WebP
```

### 2. Предзагрузка ресурсов
Добавьте в `config.ts`:

```typescript
head: [
  ['link', { rel: 'preload', href: '/hero-image.svg', as: 'image' }]
]
```

### 3. Service Worker
VitePress автоматически генерирует Service Worker для кэширования.

## 🔒 Безопасность

### CSP Headers
Добавьте в конфигурацию платформы:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

### HTTPS
Все рекомендуемые платформы автоматически предоставляют HTTPS сертификаты.

## 📞 Поддержка

Если возникли проблемы с деплоем:

1. Проверьте логи сборки на платформе
2. Убедитесь, что проект собирается локально
3. Проверьте конфигурационные файлы
4. Обратитесь к документации платформы

---

**Рекомендация:** Для большинства проектов рекомендуется использовать **Vercel** из-за простоты настройки и отличной производительности. 