import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'Crypto Payment Gateway',
    description: 'Complete documentation for crypto payment processing',

    // Отключаем проверку мертвых ссылок для деплоя
    ignoreDeadLinks: true,



    locales: {
        root: {
            label: 'English',
            lang: 'en',
            title: 'Crypto Payment Gateway',
            description: 'Complete documentation for crypto payment processing',
            themeConfig: {
                nav: [
                    { text: 'Guide', link: '/en/guide/introduction' },
                    { text: 'API Reference', link: '/en/api/overview' },
                    { text: 'Integration', link: '/en/integration/getting-started' },
                    { text: 'Examples', link: '/en/examples/basic-usage' },
                    { text: 'Theme Demo', link: '/en/guide/theme-demo' }
                ],
                sidebar: {
                    '/en/guide/': [
                        {
                            text: 'Getting Started',
                            items: [
                                { text: 'Introduction', link: '/en/guide/introduction' },
                                { text: 'Quick Start', link: '/en/guide/quick-start' },
                                { text: 'Architecture', link: '/en/guide/architecture' },
                                { text: 'Deployment', link: '/en/guide/deployment' }
                            ]
                        },
                        {
                            text: 'Core Concepts',
                            items: [
                                { text: 'Addresses & Wallets', link: '/en/guide/addresses' },
                                { text: 'Networks & Coins', link: '/en/guide/networks' },
                                { text: 'Transactions', link: '/en/guide/transactions' },
                                { text: 'Withdrawals', link: '/en/guide/withdrawals' }
                            ]
                        }
                    ],
                    '/en/api/': [
                        {
                            text: 'API Reference',
                            items: [
                                { text: 'Overview', link: '/en/api/overview' },
                                { text: 'Authentication', link: '/en/api/authentication' },
                                { text: 'Addresses', link: '/en/api/addresses' },
                                { text: 'Networks', link: '/en/api/networks' },
                                { text: 'Withdrawals', link: '/en/api/withdrawals' }
                            ]
                        }
                    ],
                    '/en/integration/': [
                        {
                            text: 'Integration Guide',
                            items: [
                                { text: 'Getting Started', link: '/en/integration/getting-started' },
                                { text: 'Go SDK', link: '/en/integration/go' },
                                { text: 'TypeScript SDK', link: '/en/integration/typescript' },
                                { text: 'Python SDK', link: '/en/integration/python' }
                            ]
                        }
                    ],
                    '/en/examples/': [
                        {
                            text: 'Code Examples',
                            items: [
                                { text: 'Basic Usage', link: '/en/examples/basic-usage' },
                                { text: 'Payment Flow', link: '/en/examples/payment-flow' },
                                { text: 'Webhook Handling', link: '/en/examples/webhooks' }
                            ]
                        }
                    ]
                }
            }
        },
        ru: {
            label: 'Русский',
            lang: 'ru',
            title: 'Криптоплатежный Шлюз',
            description: 'Полная документация по обработке криптоплатежей',
            themeConfig: {
                nav: [
                    { text: 'Руководство', link: '/ru/guide/introduction' },
                    { text: 'API Справочник', link: '/ru/api/overview' },
                    { text: 'Интеграция', link: '/ru/integration/getting-started' },
                    { text: 'Примеры', link: '/ru/examples/basic-usage' }
                ],
                sidebar: {
                    '/ru/guide/': [
                        {
                            text: 'Начало работы',
                            items: [
                                { text: 'Введение', link: '/ru/guide/introduction' },
                                { text: 'Быстрый старт', link: '/ru/guide/quick-start' },
                                { text: 'Архитектура', link: '/ru/guide/architecture' },
                                { text: 'Развертывание', link: '/ru/guide/deployment' }
                            ]
                        },
                        {
                            text: 'Основные концепции',
                            items: [
                                { text: 'Адреса и кошельки', link: '/ru/guide/addresses' },
                                { text: 'Сети и монеты', link: '/ru/guide/networks' },
                                { text: 'Транзакции', link: '/ru/guide/transactions' },
                                { text: 'Выводы средств', link: '/ru/guide/withdrawals' }
                            ]
                        }
                    ],
                    '/ru/api/': [
                        {
                            text: 'API Справочник',
                            items: [
                                { text: 'Обзор', link: '/ru/api/overview' },
                                { text: 'Аутентификация', link: '/ru/api/authentication' },
                                { text: 'Адреса', link: '/ru/api/addresses' },
                                { text: 'Сети', link: '/ru/api/networks' },
                                { text: 'Выводы', link: '/ru/api/withdrawals' }
                            ]
                        }
                    ],
                    '/ru/integration/': [
                        {
                            text: 'Руководство по интеграции',
                            items: [
                                { text: 'Начало работы', link: '/ru/integration/getting-started' },
                                { text: 'Go SDK', link: '/ru/integration/go' },
                                { text: 'TypeScript SDK', link: '/ru/integration/typescript' },
                                { text: 'Python SDK', link: '/ru/integration/python' }
                            ]
                        }
                    ],
                    '/ru/examples/': [
                        {
                            text: 'Примеры кода',
                            items: [
                                { text: 'Базовое использование', link: '/ru/examples/basic-usage' },
                                { text: 'Поток платежей', link: '/ru/examples/payment-flow' },
                                { text: 'Обработка вебхуков', link: '/ru/examples/webhooks' }
                            ]
                        }
                    ]
                }
            }
        }
    },

    themeConfig: {
        logo: '/logo.svg',
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025 Crypto Payment Gateway'
        }
    },

    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'theme-color', content: '#3c82f6' }]
    ]
}) 