#!/bin/bash

echo "🔧 Исправляем проблемные JavaScript переменные в китайских файлах..."

# Находим все китайские markdown файлы
files=$(find docs/zh/ -name "*.md" -type f)

for file in $files; do
    echo "📝 Обрабатываю: $file"
    
    # Исправляем переменные, которые Vue может интерпретировать как HTML теги
    sed -i 's/const envSelect/const envSelectElement/g' "$file"
    sed -i 's/envSelect\./envSelectElement\./g' "$file"
    sed -i 's/envSelect)/envSelectElement)/g' "$file"
    sed -i 's/(envSelect/(envSelectElement/g' "$file"
    
    sed -i 's/const globalEnvSelect/const globalEnvSelectElement/g' "$file"
    sed -i 's/globalEnvSelect\./globalEnvSelectElement\./g' "$file"
    sed -i 's/globalEnvSelect)/globalEnvSelectElement)/g' "$file"
    sed -i 's/(globalEnvSelect/(globalEnvSelectElement/g' "$file"
    
    # Исправляем другие потенциально проблемные переменные
    sed -i 's/const select/const selectElement/g' "$file"
    sed -i 's/const input/const inputElement/g' "$file"
    sed -i 's/const button/const buttonElement/g' "$file"
    sed -i 's/const form/const formElement/g' "$file"
    sed -i 's/const div/const divElement/g' "$file"
    sed -i 's/const span/const spanElement/g' "$file"
    
    # Исправляем в условиях if
    sed -i 's/if (select)/if (selectElement)/g' "$file"
    sed -i 's/if (input)/if (inputElement)/g' "$file"
    sed -i 's/if (button)/if (buttonElement)/g' "$file"
    sed -i 's/if (form)/if (formElement)/g' "$file"
    sed -i 's/if (div)/if (divElement)/g' "$file"
    sed -i 's/if (span)/if (spanElement)/g' "$file"
    
    echo "✅ Обработан: $file"
done

echo ""
echo "🎉 Исправление JavaScript переменных завершено!" 