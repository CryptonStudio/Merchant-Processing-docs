#!/bin/bash

echo "🔧 Исправление template literals в китайской документации..."

# Находим все markdown файлы в китайской документации
files=$(find docs/zh/ -name "*.md" -type f)

count=0

# Обрабатываем каждый файл
for file in $files; do
    if [ -f "$file" ]; then
        echo "📝 Обрабатываю: $file"
        
        # Заменяем различные варианты template literals
        
        # 1. Bearer ${apiKey} -> Bearer ' + apiKey + '
        sed -i "s/Bearer \${apiKey}/Bearer ' + apiKey + '/g" "$file"
        
        # 2. Response (${response.status}): ${JSON.stringify(...)} 
        sed -i "s/Response (\${response.status}): \${JSON.stringify(result, null, 2)}/Response (' + response.status + '): ' + JSON.stringify(result, null, 2)/g" "$file"
        
        # 3. fetch(`https://...${variable}...`)
        sed -i "s/fetch(\`https:\/\/cp-merch-dev\.wsdemo\.online\/api\/v1\/coins\/\${coinSlug}\`/fetch('https:\/\/cp-merch-dev.wsdemo.online\/api\/v1\/coins\/' + coinSlug)/g" "$file"
        
        # 4. handleApiError(error, `/coins/${coinSlug}`, ...)
        sed -i "s/handleApiError(error, \`\/coins\/\${coinSlug}\`/handleApiError(error, '\/coins\/' + coinSlug/g" "$file"
        
        # 5. Общие случаи ${variable} -> ' + variable + '
        sed -i "s/\`\([^']*\)\${/'\1' + /g" "$file"
        sed -i "s/}\([^']*\)\`/ + '\1'/g" "$file"
        
        # 6. Исправляем оставшиеся backticks
        sed -i "s/\`/'/g" "$file"
        
        count=$((count + 1))
        echo "✅ Обработан: $file"
    fi
done

echo ""
echo "🎉 Исправление template literals завершено!"
echo "📊 Обработано файлов: $count"
echo ""
echo "🔍 Проверяем результат..."

# Проверяем, остались ли template literals
remaining=$(grep -r '\${' docs/zh/ | wc -l)
if [ $remaining -eq 0 ]; then
    echo "✅ Все template literals успешно заменены!"
else
    echo "⚠️  Найдено $remaining оставшихся template literals"
    echo "Список оставшихся:"
    grep -r '\${' docs/zh/ | head -10
fi 