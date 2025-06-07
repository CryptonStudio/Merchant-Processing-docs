import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app, router, siteData }) {
        // Инициализация темы при загрузке
        if (typeof window !== 'undefined') {
            // Проверяем сохраненную тему или системные настройки
            const savedTheme = localStorage.getItem('vitepress-theme-appearance')
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

            const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark)

            // Применяем тему
            document.documentElement.classList.toggle('dark', isDark)

            // Добавляем кнопку переключения темы
            addThemeToggle()
        }
    }
}

function addThemeToggle() {
    // Ждем загрузки DOM
    setTimeout(() => {
        const nav = document.querySelector('.VPNavBar .content .curtain')
        if (nav && !document.querySelector('.theme-toggle')) {
            const toggleButton = document.createElement('button')
            toggleButton.className = 'theme-toggle'
            toggleButton.innerHTML = `
                <svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
                <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            `

            toggleButton.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                margin-left: 8px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s ease;
                color: var(--vp-c-text-1);
            `

            // Показываем правильную иконку
            const isDark = document.documentElement.classList.contains('dark')
            const sunIcon = toggleButton.querySelector('.sun-icon') as HTMLElement
            const moonIcon = toggleButton.querySelector('.moon-icon') as HTMLElement
            if (sunIcon) sunIcon.style.display = isDark ? 'block' : 'none'
            if (moonIcon) moonIcon.style.display = isDark ? 'none' : 'block'

            toggleButton.addEventListener('click', toggleTheme)
            toggleButton.addEventListener('mouseenter', () => {
                toggleButton.style.backgroundColor = 'var(--vp-c-bg-soft)'
            })
            toggleButton.addEventListener('mouseleave', () => {
                toggleButton.style.backgroundColor = 'transparent'
            })

            nav.appendChild(toggleButton)
        }
    }, 100)
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark')
    const newTheme = isDark ? 'light' : 'dark'

    document.documentElement.classList.toggle('dark', !isDark)
    localStorage.setItem('vitepress-theme-appearance', newTheme)

    // Обновляем иконку
    const button = document.querySelector('.theme-toggle')
    if (button) {
        const sunIcon = button.querySelector('.sun-icon') as HTMLElement
        const moonIcon = button.querySelector('.moon-icon') as HTMLElement

        if (!isDark) { // переключились на темную тему
            if (sunIcon) sunIcon.style.display = 'block'
            if (moonIcon) moonIcon.style.display = 'none'
        } else { // переключились на светлую тему
            if (sunIcon) sunIcon.style.display = 'none'
            if (moonIcon) moonIcon.style.display = 'block'
        }
    }
} 