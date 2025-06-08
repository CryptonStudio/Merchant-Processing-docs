#!/bin/bash

# Скрипт для исправления использования API ключей в JavaScript файлах

echo "Исправляем использование API ключей..."

# Заменяем document.getElementById('api-key')?.value на getApiKey()
sed -i "s/const apiKey = document\.getElementById('api-key')?\.value;/const apiKey = getApiKey();/g" docs/.vitepress/theme/api-demo.js

# Заменяем сообщения об ошибках
sed -i "s/alert('Пожалуйста, введите API ключ');/alert('Пожалуйста, установите API ключ в секции выше или введите в поле');/g" docs/.vitepress/theme/api-demo.js

echo "Готово! Все функции теперь используют глобальный API ключ." 