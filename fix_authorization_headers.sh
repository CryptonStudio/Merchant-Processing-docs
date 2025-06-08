#!/bin/bash

echo "🔧 Исправляю Authorization Bearer заголовки на X-Api-Key..."

# Замена в JavaScript/TypeScript примерах
echo "📝 Исправляю JavaScript примеры..."
find docs -name "*.md" -exec sed -i "s/'Authorization': \`Bearer \${[^}]*}\`/'X-Api-Key': apiKey/g" {} \;
find docs -name "*.md" -exec sed -i "s/'Authorization': 'Bearer YOUR_API_KEY'/'X-Api-Key': 'YOUR_API_KEY'/g" {} \;
find docs -name "*.md" -exec sed -i "s/'Authorization': \`Bearer \${apiKey}\`/'X-Api-Key': apiKey/g" {} \;
find docs -name "*.md" -exec sed -i "s/'Authorization': 'Bearer ' + [^,]* + ''/'X-Api-Key': apiKey/g" {} \;

# Замена в Python примерах  
echo "🐍 Исправляю Python примеры..."
find docs -name "*.md" -exec sed -i "s/'Authorization': f'Bearer {[^}]*}'/'X-Api-Key': os.getenv('GATEWAY_API_KEY')/g" {} \;

# Замена в Go примерах
echo "🐹 Исправляю Go примеры..."
find docs -name "*.md" -exec sed -i 's/req\.Header\.Set("Authorization", "Bearer YOUR_API_KEY")/req.Header.Set("X-Api-Key", "YOUR_API_KEY")/g' {} \;
find docs -name "*.md" -exec sed -i 's/req\.Header\.Set("Authorization", "Bearer "+c\.APIKey)/req.Header.Set("X-Api-Key", c.APIKey)/g' {} \;
find docs -name "*.md" -exec sed -i 's/req2\.Header\.Set("Authorization", "Bearer YOUR_API_KEY")/req2.Header.Set("X-Api-Key", "YOUR_API_KEY")/g' {} \;

# Замена в PHP примерах (если есть)
echo "🐘 Исправляю PHP примеры..."
find docs -name "*.md" -exec sed -i "s/'Authorization: Bearer ' \. \$[^,]*/'X-Api-Key: ' . \$apiKey/g" {} \;

echo "✅ Все Authorization Bearer заголовки заменены на X-Api-Key!"

# Проверяем результат
echo "🔍 Проверяю оставшиеся Authorization заголовки..."
remaining=$(grep -r "Authorization.*Bearer" docs/ --include="*.md" | wc -l)
if [ $remaining -eq 0 ]; then
    echo "✅ Все Authorization Bearer заголовки успешно заменены!"
else
    echo "⚠️  Найдено $remaining оставшихся Authorization заголовков:"
    grep -r "Authorization.*Bearer" docs/ --include="*.md"
fi 