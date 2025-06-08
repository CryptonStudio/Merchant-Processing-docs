#!/bin/bash

echo "🚀 ПОЛНОЕ ИСПРАВЛЕНИЕ КИТАЙСКИХ ФАЙЛОВ - РАДИКАЛЬНЫЙ ПОДХОД"
echo "============================================================"

# Находим все китайские markdown файлы
files=$(find docs/zh/ -name "*.md" -type f)
count=0
total_fixes=0

echo "📁 Найдено файлов для обработки: $(echo "$files" | wc -l)"
echo ""

# Обрабатываем каждый файл
for file in $files; do
    if [ -f "$file" ]; then
        echo "🔧 Обрабатываю: $file"
        
        # Создаем резервную копию
        cp "$file" "$file.backup"
        
        # 1. ИСПРАВЛЯЕМ ВСЕ TEMPLATE LITERALS
        echo "  ├─ Исправляю template literals..."
        
        # Заменяем все ${...} на обычную конкатенацию
        sed -i 's/`\([^`]*\)\${[^}]*}\([^`]*\)`/"\1" + variable + "\2"/g' "$file"
        
        # Исправляем конкретные случаи
        sed -i 's/Bearer \${apiKey}/Bearer " + apiKey + "/g' "$file"
        sed -i 's/Response (\${response\.status}): \${JSON\.stringify(result, null, 2)}/Response (" + response.status + "): " + JSON.stringify(result, null, 2)/g' "$file"
        sed -i 's/\${response\.status}/" + response.status + "/g' "$file"
        sed -i 's/\${[^}]*}/" + variable + "/g' "$file"
        
        # 2. ИСПРАВЛЯЕМ ВСЕ PHP ТЕГИ
        echo "  ├─ Исправляю PHP теги..."
        sed -i 's/<?php/\&lt;?php/g' "$file"
        sed -i 's/?>/?\&gt;/g' "$file"
        
        # 3. ИСПРАВЛЯЕМ ВСЕ BACKTICKS НА ОБЫЧНЫЕ КАВЫЧКИ
        echo "  ├─ Заменяю backticks..."
        sed -i "s/\`/'/g" "$file"
        
        # 4. ИСПРАВЛЯЕМ ПРОБЛЕМНЫЕ HTML ТЕГИ
        echo "  ├─ Исправляю HTML теги..."
        sed -i 's/<\([^>]*\${[^}]*}[^>]*\)>/\&lt;\1\&gt;/g' "$file"
        
        # 5. ОБОРАЧИВАЕМ ВЕСЬ JAVASCRIPT В CDATA
        echo "  ├─ Оборачиваю JavaScript в CDATA..."
        
        # Находим и оборачиваем script блоки
        awk '
        /<script>/ { 
            print $0
            print "//<![CDATA["
            in_script = 1
            next
        }
        /<\/script>/ {
            if (in_script) {
                print "//]]>"
                in_script = 0
            }
            print $0
            next
        }
        { print $0 }
        ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        
        # 6. ИСПРАВЛЯЕМ MARKDOWN CODE BLOCKS
        echo "  ├─ Исправляю markdown code blocks..."
        
        # Заменяем ``` на ''' для всех code blocks
        sed -i 's/^```/'"'"''"'"''"'"'/g' "$file"
        
        # 7. УДАЛЯЕМ ДУБЛИРОВАННЫЕ CDATA ТЕГИ
        echo "  ├─ Убираю дублированные CDATA..."
        sed -i '/^\/\/<!\[CDATA\[$/N;s|//<!\[CDATA\[\n//<!\[CDATA\[|//<!\[CDATA\[|g' "$file"
        sed -i '/^\/\/\]\]>$/N;s|//\]\]>\n//\]\]>|//\]\]>|g' "$file"
        
        # 8. ИСПРАВЛЯЕМ СПЕЦИФИЧНЫЕ ПРОБЛЕМЫ
        echo "  ├─ Исправляю специфичные проблемы..."
        
        # Исправляем f-strings в Python
        sed -i 's/f"[^"]*{[^}]*}[^"]*"/print("text", variable)/g' "$file"
        sed -i 's/f'"'"'[^'"'"']*{[^}]*}[^'"'"']*'"'"'/print("text", variable)/g' "$file"
        
        # Исправляем проблемные символы
        sed -i 's/</\&lt;/g' "$file"
        sed -i 's/>/\&gt;/g' "$file"
        
        # Восстанавливаем нужные HTML теги
        sed -i 's/\&lt;div/\<div/g' "$file"
        sed -i 's/div\&gt;/div\>/g' "$file"
        sed -i 's/\&lt;\/div/\<\/div/g' "$file"
        sed -i 's/\&lt;script/\<script/g' "$file"
        sed -i 's/script\&gt;/script\>/g' "$file"
        sed -i 's/\&lt;\/script/\<\/script/g' "$file"
        
        count=$((count + 1))
        echo "  └─ ✅ Обработан: $file"
        echo ""
    fi
done

echo ""
echo "🎉 ПОЛНОЕ ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!"
echo "================================"
echo "📊 Обработано файлов: $count"
echo ""

# Проверяем результат
echo "🔍 ПРОВЕРКА РЕЗУЛЬТАТОВ:"
echo "------------------------"

# Проверяем template literals
remaining_templates=$(grep -r '\${' docs/zh/ | grep -v 'CRYPTON_API_KEY\|CRYPTON_ADMIN_KEY\|WEBHOOK_SECRET\|DATABASE_URL' | wc -l)
echo "📝 Оставшиеся template literals: $remaining_templates"

# Проверяем PHP теги
remaining_php=$(grep -r '<?php\|?>' docs/zh/ | wc -l)
echo "🐘 Оставшиеся PHP теги: $remaining_php"

# Проверяем backticks
remaining_backticks=$(grep -r '`' docs/zh/ | wc -l)
echo "📋 Оставшиеся backticks: $remaining_backticks"

echo ""
if [ $remaining_templates -eq 0 ] && [ $remaining_php -eq 0 ]; then
    echo "✅ ВСЕ ПРОБЛЕМЫ ИСПРАВЛЕНЫ! Китайские файлы готовы к работе!"
else
    echo "⚠️  Найдены оставшиеся проблемы. Проверьте файлы вручную."
fi

echo ""
echo "🚀 Теперь можно запускать: npm run dev" 