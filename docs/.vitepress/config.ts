import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
    title: 'Crypto Payment Gateway',
    description: 'Complete documentation for crypto payment processing',

    // Настройка для GitHub Pages
    base: '/Merchant-Processing-docs/',

    // Отключаем проверку мертвых ссылок для деплоя
    ignoreDeadLinks: true,

    // Favicon и иконки
    head: [
        ['link', { rel: 'icon', type: 'image/x-icon', href: '/Merchant-Processing-docs/favicon.ico' }],
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/Merchant-Processing-docs/apple-touch-icon.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/Merchant-Processing-docs/favicon-32x32.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/Merchant-Processing-docs/favicon-16x16.png' }],
        ['meta', { name: 'theme-color', content: '#667eea' }],
        ['meta', { name: 'msapplication-TileColor', content: '#667eea' }]
    ],





    locales: {
        en: {
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
                    { text: 'Demo API', link: '/en/guide/demo-api' },
                    { text: 'Theme Demo', link: '/en/guide/theme-demo' }
                ],
                sidebar: {
                    '/en/guide/': [
                        {
                            text: 'Getting Started',
                            items: [
                                { text: 'Introduction', link: '/en/guide/introduction' },
                                { text: 'Quick Start', link: '/en/guide/quick-start' },
                                { text: 'Demo API', link: '/en/guide/demo-api' },
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
                                { text: 'Merchant', link: '/en/api/merchant-stripe' },
                                { text: 'Addresses', link: '/en/api/addresses-stripe' },
                                { text: 'Networks', link: '/en/api/networks-stripe' },
                                { text: 'Coins', link: '/en/api/coins-stripe' },
                                { text: 'Withdrawals', link: '/en/api/withdraws-stripe' },
                                { text: 'Webhooks', link: '/en/api/webhooks' }
                            ]
                        }
                    ],
                    '/en/integration/': [
                        {
                            text: 'Integration Guide',
                            items: [
                                { text: 'Getting Started', link: '/en/integration/getting-started' }
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
                    { text: 'Примеры', link: '/ru/examples/basic-usage' },
                    { text: 'Демо API', link: '/ru/guide/demo-api' }
                ],
                sidebar: {
                    '/ru/guide/': [
                        {
                            text: 'Начало работы',
                            items: [
                                { text: 'Введение', link: '/ru/guide/introduction' },
                                { text: 'Быстрый старт', link: '/ru/guide/quick-start' },
                                { text: 'Демо API', link: '/ru/guide/demo-api' },
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
                                { text: 'Мерчант', link: '/ru/api/merchant-stripe' },
                                { text: 'Адреса', link: '/ru/api/addresses-stripe' },
                                { text: 'Сети', link: '/ru/api/networks-stripe' },
                                { text: 'Монеты', link: '/ru/api/coins-stripe' },
                                { text: 'Выводы', link: '/ru/api/withdraws-stripe' }
                            ]
                        }
                    ],
                    '/ru/integration/': [
                        {
                            text: 'Руководство по интеграции',
                            items: [
                                { text: 'Начало работы', link: '/ru/integration/getting-started' }
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
        },
        zh: {
            label: '中文',
            lang: 'zh-CN',
            title: '加密货币支付网关',
            description: '加密货币支付处理系统完整文档',
            themeConfig: {
                nav: [
                    { text: '指南', link: '/zh/guide/introduction' },
                    { text: 'API 参考', link: '/zh/api/overview' },
                    { text: '集成', link: '/zh/integration/getting-started' },
                    { text: '示例', link: '/zh/examples/basic-usage' },
                    { text: '演示 API', link: '/zh/guide/demo-api' }
                ],
                sidebar: {
                    '/zh/guide/': [
                        {
                            text: '开始使用',
                            items: [
                                { text: '介绍', link: '/zh/guide/introduction' },
                                { text: '快速开始', link: '/zh/guide/quick-start' },
                                { text: '演示 API', link: '/zh/guide/demo-api' }
                            ]
                        }
                    ],
                    '/zh/api/': [
                        {
                            text: 'API 参考',
                            items: [
                                { text: '概述', link: '/zh/api/overview' },
                                { text: '身份验证', link: '/zh/api/authentication' },
                                { text: '商户', link: '/zh/api/merchant' },
                                { text: '地址', link: '/zh/api/addresses' },
                                { text: '网络', link: '/zh/api/networks' },
                                { text: '币种', link: '/zh/api/coins' },
                                { text: '提现', link: '/zh/api/withdraws' }
                            ]
                        }
                    ],
                    '/zh/integration/': [
                        {
                            text: '集成指南',
                            items: [
                                { text: '开始使用', link: '/zh/integration/getting-started' }
                            ]
                        }
                    ],
                    '/zh/examples/': [
                        {
                            text: '代码示例',
                            items: [
                                { text: '基本用法', link: '/zh/examples/basic-usage' }
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
            copyright: '© 2016-2025 Crypton Studio LLC.<br/>All rights reserved.'
        }
    },

    // Конфигурация Mermaid
    mermaid: {
        theme: 'default'
    }
}))