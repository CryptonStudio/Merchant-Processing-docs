#!/bin/bash

echo "🎯 УМНОЕ ИСПРАВЛЕНИЕ КИТАЙСКИХ ФАЙЛОВ"
echo "====================================="

# Находим все китайские markdown файлы
files=$(find docs/zh/ -name "*.md" -type f)

for file in $files; do
    echo "🔧 Обрабатываю: $file"
    
    # 1. Исправляем только PHP теги в code blocks
    sed -i '/^```php/,/^```/ s/<?php/\&lt;?php/g' "$file"
    sed -i '/^```php/,/^```/ s/?>/?\&gt;/g' "$file"
    
    # 2. Исправляем template literals только в JavaScript code blocks
    sed -i '/^```javascript/,/^```/ s/\${/\\${/g' "$file"
    sed -i '/^```js/,/^```/ s/\${/\\${/g' "$file"
    
    # 3. Исправляем template literals в script тегах
    sed -i '/<script>/,/<\/script>/ s/\${/\\${/g' "$file"
    
    # 4. Заменяем ``` на ''' только для проблемных языков
    sed -i 's/^```php$/'"'"''"'"''"'"'php/g' "$file"
    sed -i 's/^```javascript$/'"'"''"'"''"'"'javascript/g' "$file"
    sed -i 's/^```js$/'"'"''"'"''"'"'js/g' "$file"
    
    # 5. Закрываем соответствующие блоки
    sed -i '/^'"'"''"'"''"'"'php/,/^```$/ s/^```$/'"'"''"'"''"'"'/g' "$file"
    sed -i '/^'"'"''"'"''"'"'javascript/,/^```$/ s/^```$/'"'"''"'"''"'"'/g' "$file"
    sed -i '/^'"'"''"'"''"'"'js/,/^```$/ s/^```$/'"'"''"'"''"'"'/g' "$file"
    
    echo "✅ Обработан: $file"
done

echo ""
echo "🎉 Умное исправление завершено!"
echo ""

# Проверяем результат
echo "🔍 Проверка результатов:"
remaining_php=$(grep -r '<?php' docs/zh/ | wc -l)
echo "🐘 PHP теги в code blocks: $remaining_php"

remaining_templates=$(grep -r '\${' docs/zh/ | grep -v 'CRYPTON_API_KEY\|CRYPTON_ADMIN_KEY\|WEBHOOK_SECRET\|DATABASE_URL' | wc -l)
echo "📝 Template literals: $remaining_templates"

echo ""
echo "🚀 Пробуем запустить сервер..." 