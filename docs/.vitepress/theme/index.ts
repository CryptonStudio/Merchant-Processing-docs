import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './api-docs.css'
import './api-demo.js'
import ApiDoc from '../components/ApiDoc.vue'
import ApiMethod from '../components/ApiMethod.vue'

export default {
    extends: DefaultTheme,
    enhanceApp({ app, router, siteData }) {
        // Регистрируем компоненты
        app.component('ApiDoc', ApiDoc)
        app.component('ApiMethod', ApiMethod)

        // Создаем кастомное мобильное меню только после загрузки
        if (typeof window !== 'undefined') {
            setTimeout(() => createCustomMobileMenu(), 200)
        }
    }
}

function createCustomMobileMenu() {
    // Удаляем старое кастомное меню если есть
    const oldCustomMenu = document.querySelector('.custom-mobile-menu')
    if (oldCustomMenu) {
        oldCustomMenu.remove()
    }

    const oldCustomButton = document.querySelector('.custom-hamburger')
    if (oldCustomButton) {
        oldCustomButton.remove()
    }

    // Проверяем, что мы на мобильном устройстве
    if (window.innerWidth > 768) return

    const navbar = document.querySelector('.VPNavBar .content')
    if (!navbar) return

    // Создаем кастомную кнопку гамбургера
    const customHamburger = document.createElement('button')
    customHamburger.className = 'custom-hamburger'
    customHamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `

    const isDark = document.documentElement.classList.contains('dark')

    customHamburger.style.cssText = `
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 10000;
        background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
        border: 2px solid ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)'};
        border-radius: 8px;
        padding: 12px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 48px;
        height: 48px;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    `

    // Стили для линий гамбургера
    const spans = customHamburger.querySelectorAll('span')
    spans.forEach(span => {
        (span as HTMLElement).style.cssText = `
            display: block;
            width: 20px;
            height: 2px;
            background: ${isDark ? 'white' : 'black'};
            transition: all 0.3s ease;
        `
    })

    // Создаем кастомное меню
    const customMenu = document.createElement('div')
    customMenu.className = 'custom-mobile-menu'
    customMenu.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 9999;
        display: none;
        padding: 80px 20px 20px;
        overflow-y: auto;
    `

    // Добавляем навигационные ссылки
    const menuContent = `
        <div style="max-width: 400px; margin: 0 auto;">
            <h2 style="color: ${isDark ? 'white' : 'black'}; margin-bottom: 30px; font-size: 24px;">Меню</h2>
            
            <!-- Переключение темы -->
            <div style="margin-bottom: 30px; padding: 20px; border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}; border-radius: 12px; background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};">
                <h3 style="color: ${isDark ? 'white' : 'black'}; margin-bottom: 15px; font-size: 18px;">🎨 Тема</h3>
                <button id="mobile-theme-toggle" style="
                    width: 100%;
                    padding: 16px;
                    background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
                    border: 2px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
                    border-radius: 8px;
                    color: ${isDark ? 'white' : 'black'};
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                ">
                    <span style="font-size: 20px;">${isDark ? '☀️' : '🌙'}</span>
                    <span>Переключить на ${isDark ? 'светлую' : 'темную'} тему</span>
                </button>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <a href="/Merchant-Processing-docs/en/guide/introduction" style="
                    color: ${isDark ? 'white' : 'black'};
                    text-decoration: none;
                    padding: 16px;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
                    border-radius: 8px;
                    font-size: 18px;
                    transition: all 0.3s ease;
                ">📖 Guide</a>
                
                <a href="/Merchant-Processing-docs/en/api/overview" style="
                    color: ${isDark ? 'white' : 'black'};
                    text-decoration: none;
                    padding: 16px;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
                    border-radius: 8px;
                    font-size: 18px;
                    transition: all 0.3s ease;
                ">🔧 API Reference</a>
                
                <a href="/Merchant-Processing-docs/en/integration/getting-started" style="
                    color: ${isDark ? 'white' : 'black'};
                    text-decoration: none;
                    padding: 16px;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
                    border-radius: 8px;
                    font-size: 18px;
                    transition: all 0.3s ease;
                ">🔗 Integration</a>
                
                <a href="/Merchant-Processing-docs/en/examples/basic-usage" style="
                    color: ${isDark ? 'white' : 'black'};
                    text-decoration: none;
                    padding: 16px;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
                    border-radius: 8px;
                    font-size: 18px;
                    transition: all 0.3s ease;
                ">💡 Examples</a>
                
                <a href="/Merchant-Processing-docs/en/guide/demo-api" style="
                    color: ${isDark ? 'white' : 'black'};
                    text-decoration: none;
                    padding: 16px;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
                    border-radius: 8px;
                    font-size: 18px;
                    transition: all 0.3s ease;
                ">🚀 Demo API</a>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};">
                <h3 style="color: ${isDark ? 'white' : 'black'}; margin-bottom: 20px;">🌍 Языки</h3>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <a href="/Merchant-Processing-docs/en/" style="color: ${isDark ? '#60a5fa' : '#3b82f6'}; text-decoration: none; font-size: 16px;">🇺🇸 English</a>
                    <a href="/Merchant-Processing-docs/ru/" style="color: ${isDark ? '#60a5fa' : '#3b82f6'}; text-decoration: none; font-size: 16px;">🇷🇺 Русский</a>
                    <a href="/Merchant-Processing-docs/zh/" style="color: ${isDark ? '#60a5fa' : '#3b82f6'}; text-decoration: none; font-size: 16px;">🇨🇳 中文</a>
                </div>
            </div>
        </div>
    `

    customMenu.innerHTML = menuContent

    // Добавляем элементы в DOM
    document.body.appendChild(customHamburger)
    document.body.appendChild(customMenu)

    // Обработчик для кнопки переключения темы в меню
    const mobileThemeToggle = customMenu.querySelector('#mobile-theme-toggle')
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()

            // Используем стандартный механизм VitePress для переключения темы
            const currentTheme = document.documentElement.classList.contains('dark')
            const newTheme = currentTheme ? 'light' : 'dark'

            document.documentElement.classList.toggle('dark', !currentTheme)
            localStorage.setItem('vitepress-theme-appearance', newTheme)

            // Закрываем меню
            customMenu.style.display = 'none'
            document.body.style.overflow = ''

            // Сбрасываем анимацию кнопки гамбургера
            spans.forEach((span, index) => {
                (span as HTMLElement).style.transform = 'rotate(0deg)'
                if (index === 1) {
                    (span as HTMLElement).style.opacity = '1'
                }
            })

            // Пересоздаем меню для новой темы
            setTimeout(() => createCustomMobileMenu(), 100)
        })
    }

    // Обработчик для кнопки гамбургера
    customHamburger.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()

        const isOpen = customMenu.style.display === 'block'

        if (isOpen) {
            customMenu.style.display = 'none'
            document.body.style.overflow = ''

            // Анимация закрытия кнопки
            spans.forEach((span, index) => {
                (span as HTMLElement).style.transform = 'rotate(0deg)'
                if (index === 1) {
                    (span as HTMLElement).style.opacity = '1'
                }
            })
        } else {
            customMenu.style.display = 'block'
            document.body.style.overflow = 'hidden'

                // Анимация открытия кнопки (X)
                (spans[0] as HTMLElement).style.transform = 'rotate(45deg) translate(5px, 5px)'
            const span1 = spans[1] as HTMLElement
            span1.style.opacity = '0'
            const span2 = spans[2] as HTMLElement
            span2.style.transform = 'rotate(-45deg) translate(7px, -6px)'
        }
    })

    // Закрытие меню при клике на фон
    customMenu.addEventListener('click', (e) => {
        if (e.target === customMenu) {
            customMenu.style.display = 'none'
            document.body.style.overflow = ''

            spans.forEach((span, index) => {
                (span as HTMLElement).style.transform = 'rotate(0deg)'
                if (index === 1) {
                    (span as HTMLElement).style.opacity = '1'
                }
            })
        }
    })

    // Скрываем оригинальную кнопку VitePress
    const originalHamburger = document.querySelector('.VPNavBarHamburger')
    if (originalHamburger) {
        (originalHamburger as HTMLElement).style.display = 'none'
    }
} 