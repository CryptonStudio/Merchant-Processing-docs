#!/bin/bash

# Скрипт для исправления заголовков API с Authorization на X-Api-Key

echo "🔧 Исправление заголовков API..."

# Находим все markdown файлы в документации
files=$(find docs/ -name "*.md" -type f)

# Счетчик обработанных файлов
count=0

# Обрабатываем каждый файл
for file in $files; do
    if [ -f "$file" ]; then
        echo "📝 Обрабатываю: $file"
        
        # Заменяем различные варианты Authorization: Bearer на X-Api-Key
        
        # 1. Curl команды с -H "Authorization: Bearer ..."
        sed -i 's/-H "Authorization: Bearer \([^"]*\)"/-H "X-Api-Key: \1"/g' "$file"
        
        # 2. Curl команды с -H 'Authorization: Bearer ...'
        sed -i "s/-H 'Authorization: Bearer \([^']*\)'/-H 'X-Api-Key: \1'/g" "$file"
        
        # 3. Заголовки без curl (просто Authorization: Bearer)
        sed -i 's/Authorization: Bearer \([^ ]*\)/X-Api-Key: \1/g' "$file"
        
        # 4. PHP массивы с 'Authorization: Bearer'
        sed -i "s/'Authorization: Bearer ' \. \$apiKey/'X-Api-Key: ' . \$apiKey/g" "$file"
        sed -i "s/'Authorization: Bearer ' \. \$this->apiKey/'X-Api-Key: ' . \$this->apiKey/g" "$file"
        
        # 5. JavaScript/TypeScript строки
        sed -i 's/"Authorization: Bearer \${apiKey}"/"X-Api-Key: \${apiKey}"/g' "$file"
        sed -i 's/"Authorization: Bearer \${globalApiKey}"/"X-Api-Key: \${globalApiKey}"/g' "$file"
        sed -i 's/"Authorization: Bearer \${getApiKey()}"/"X-Api-Key: \${getApiKey()}"/g' "$file"
        
        # 6. Обновляем описания в тексте
        sed -i 's/Bearer Token/API Key/g' "$file"
        sed -i 's/Include `Authorization: Bearer <token>` header/Include `X-Api-Key: <token>` header/g' "$file"
        
        # 7. Curl команды с обратными слешами
        sed -i 's/-H "Authorization: Bearer \([^"]*\)" \\/-H "X-Api-Key: \1" \\/g' "$file"
        
        count=$((count + 1))
        echo "✅ Обработан: $file"
    fi
done

echo ""
echo "🎉 Исправление заголовков завершено!"
echo "📊 Обработано файлов: $count"
echo ""
echo "Теперь все API запросы используют правильный формат:"
echo "  -H 'X-Api-Key: your-api-key'"
echo "вместо:"
echo "  -H 'Authorization: Bearer your-api-key'"
echo ""
echo "🔍 Проверяем результат..."

# Проверяем, остались ли старые заголовки
remaining=$(grep -r "Authorization: Bearer" docs/ --include="*.md" | wc -l)
if [ $remaining -eq 0 ]; then
    echo "✅ Все заголовки успешно обновлены!"
else
    echo "⚠️  Найдено $remaining оставшихся вхождений 'Authorization: Bearer'"
    echo "Список оставшихся:"
    grep -r "Authorization: Bearer" docs/ --include="*.md" | head -10
fi 