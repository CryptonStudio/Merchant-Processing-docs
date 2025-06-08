#!/bin/bash

echo "🔧 Исправляем HTML entities в китайских файлах..."

# Находим все китайские markdown файлы
files=$(find docs/zh/ -name "*.md" -type f)

for file in $files; do
    echo "📝 Исправляю: $file"
    
    # Восстанавливаем правильные HTML теги
    sed -i 's/&lt;div/\<div/g' "$file"
    sed -i 's/div&gt;/div\>/g' "$file"
    sed -i 's/&lt;\/div/\<\/div/g' "$file"
    sed -i 's/&lt;script/\<script/g' "$file"
    sed -i 's/script&gt;/script\>/g' "$file"
    sed -i 's/&lt;\/script/\<\/script/g' "$file"
    sed -i 's/&lt;button/\<button/g' "$file"
    sed -i 's/button&gt;/button\>/g' "$file"
    sed -i 's/&lt;\/button/\<\/button/g' "$file"
    sed -i 's/&lt;input/\<input/g' "$file"
    sed -i 's/input&gt;/input\>/g' "$file"
    sed -i 's/&lt;label/\<label/g' "$file"
    sed -i 's/label&gt;/label\>/g' "$file"
    sed -i 's/&lt;\/label/\<\/label/g' "$file"
    sed -i 's/&lt;select/\<select/g' "$file"
    sed -i 's/select&gt;/select\>/g' "$file"
    sed -i 's/&lt;\/select/\<\/select/g' "$file"
    sed -i 's/&lt;option/\<option/g' "$file"
    sed -i 's/option&gt;/option\>/g' "$file"
    sed -i 's/&lt;\/option/\<\/option/g' "$file"
    
    # Исправляем атрибуты
    sed -i 's/&gt;/>/g' "$file"
    sed -i 's/&lt;/</g' "$file"
    
    echo "✅ Исправлен: $file"
done

echo "🎉 Исправление HTML entities завершено!" 