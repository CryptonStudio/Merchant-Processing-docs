# API Сетей

Документация по API для работы с блокчейн сетями в системе криптоплатежного шлюза.

## Обзор

API сетей позволяет:

- Получать список поддерживаемых сетей
- Проверять статус сетей
- Получать информацию о комиссиях
- Мониторить состояние блокчейнов

## Базовый URL

```
https://api.gateway.com/v1
```

## Аутентификация

Все запросы требуют API ключ в заголовке:

```http
Authorization: Bearer sk_live_your_api_key_here
```

## Список сетей

### GET /networks

Получить список всех поддерживаемых блокчейн сетей.

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `status` | string | Нет | Фильтр по статусу (active, maintenance, disabled) |
| `type` | string | Нет | Фильтр по типу (mainnet, testnet) |

#### Пример запроса

```bash
curl -X GET "https://api.gateway.com/v1/networks" \
  -H "Authorization: Bearer sk_live_your_api_key_here"
```

#### Пример ответа

```json
{
  "success": true,
  "data": [
    {
      "id": "ethereum",
      "name": "Ethereum",
      "symbol": "ETH",
      "type": "mainnet",
      "status": "active",
      "chain_id": 1,
      "block_time": 12,
      "confirmation_blocks": 12,
      "supported_coins": [
        {
          "symbol": "ETH",
          "name": "Ethereum",
          "decimals": 18,
          "contract_address": null
        },
        {
          "symbol": "USDT",
          "name": "Tether USD",
          "decimals": 6,
          "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        },
        {
          "symbol": "USDC",
          "name": "USD Coin",
          "decimals": 6,
          "contract_address": "0xA0b86a33E6441b8e776f89d2e5c413c7b5c9c7c7"
        }
      ],
      "fees": {
        "withdrawal": {
          "ETH": "0.001",
          "USDT": "5.0",
          "USDC": "5.0"
        },
        "gas_price": {
          "slow": "20000000000",
          "standard": "25000000000",
          "fast": "30000000000"
        }
      },
      "limits": {
        "min_withdrawal": {
          "ETH": "0.01",
          "USDT": "10.0",
          "USDC": "10.0"
        },
        "max_withdrawal": {
          "ETH": "100.0",
          "USDT": "100000.0",
          "USDC": "100000.0"
        }
      }
    },
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "type": "mainnet",
      "status": "active",
      "chain_id": null,
      "block_time": 600,
      "confirmation_blocks": 6,
      "supported_coins": [
        {
          "symbol": "BTC",
          "name": "Bitcoin",
          "decimals": 8,
          "contract_address": null
        }
      ],
      "fees": {
        "withdrawal": {
          "BTC": "0.0005"
        },
        "sat_per_byte": {
          "slow": 10,
          "standard": 20,
          "fast": 30
        }
      },
      "limits": {
        "min_withdrawal": {
          "BTC": "0.001"
        },
        "max_withdrawal": {
          "BTC": "10.0"
        }
      }
    }
  ]
}
```

## Информация о сети

### GET /networks/{network_id}

Получить подробную информацию о конкретной сети.

#### Параметры пути

| Параметр | Тип | Описание |
|----------|-----|----------|
| `network_id` | string | Идентификатор сети (ethereum, bitcoin, polygon, etc.) |

#### Пример запроса

```bash
curl -X GET "https://api.gateway.com/v1/networks/ethereum" \
  -H "Authorization: Bearer sk_live_your_api_key_here"
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "id": "ethereum",
    "name": "Ethereum",
    "symbol": "ETH",
    "type": "mainnet",
    "status": "active",
    "chain_id": 1,
    "block_time": 12,
    "confirmation_blocks": 12,
    "current_block": 18500000,
    "network_hash_rate": "900000000000000000",
    "difficulty": "58750000000000000000000",
    "supported_coins": [
      {
        "symbol": "ETH",
        "name": "Ethereum",
        "decimals": 18,
        "contract_address": null,
        "is_native": true
      },
      {
        "symbol": "USDT",
        "name": "Tether USD",
        "decimals": 6,
        "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "is_native": false
      }
    ],
    "fees": {
      "withdrawal": {
        "ETH": "0.001",
        "USDT": "5.0"
      },
      "gas_price": {
        "slow": "20000000000",
        "standard": "25000000000",
        "fast": "30000000000"
      },
      "gas_limit": {
        "ETH": "21000",
        "USDT": "65000"
      }
    },
    "explorer_urls": {
      "main": "https://etherscan.io",
      "tx": "https://etherscan.io/tx/{hash}",
      "address": "https://etherscan.io/address/{address}"
    },
    "rpc_endpoints": [
      "https://mainnet.infura.io/v3/...",
      "https://eth-mainnet.alchemyapi.io/v2/..."
    ]
  }
}
```

## Статус сети

### GET /networks/{network_id}/status

Получить текущий статус и состояние сети.

#### Пример запроса

```bash
curl -X GET "https://api.gateway.com/v1/networks/ethereum/status" \
  -H "Authorization: Bearer sk_live_your_api_key_here"
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "network_id": "ethereum",
    "status": "active",
    "is_synced": true,
    "current_block": 18500000,
    "sync_progress": 100.0,
    "last_block_time": "2025-01-01T12:00:00Z",
    "avg_block_time": 12.5,
    "pending_transactions": 150000,
    "gas_price": {
      "slow": "20000000000",
      "standard": "25000000000",
      "fast": "30000000000"
    },
    "network_congestion": "low",
    "estimated_confirmation_time": {
      "slow": "5 minutes",
      "standard": "3 minutes",
      "fast": "1 minute"
    },
    "health_score": 98.5,
    "issues": []
  }
}
```

## Комиссии сети

### GET /networks/{network_id}/fees

Получить актуальную информацию о комиссиях в сети.

#### Пример запроса

```bash
curl -X GET "https://api.gateway.com/v1/networks/ethereum/fees" \
  -H "Authorization: Bearer sk_live_your_api_key_here"
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "network_id": "ethereum",
    "updated_at": "2025-01-01T12:00:00Z",
    "gas_price": {
      "slow": {
        "gwei": "20",
        "wei": "20000000000",
        "estimated_time": "5 minutes"
      },
      "standard": {
        "gwei": "25",
        "wei": "25000000000",
        "estimated_time": "3 minutes"
      },
      "fast": {
        "gwei": "30",
        "wei": "30000000000",
        "estimated_time": "1 minute"
      }
    },
    "withdrawal_fees": {
      "ETH": {
        "amount": "0.001",
        "usd_equivalent": "2.50"
      },
      "USDT": {
        "amount": "5.0",
        "usd_equivalent": "5.00"
      },
      "USDC": {
        "amount": "5.0",
        "usd_equivalent": "5.00"
      }
    },
    "estimated_transaction_costs": {
      "ETH_transfer": {
        "slow": "0.00042",
        "standard": "0.000525",
        "fast": "0.00063"
      },
      "ERC20_transfer": {
        "slow": "0.0013",
        "standard": "0.001625",
        "fast": "0.00195"
      }
    }
  }
}
```

## Поддерживаемые монеты

### GET /networks/{network_id}/coins

Получить список всех поддерживаемых монет в сети.

#### Пример запроса

```bash
curl -X GET "https://api.gateway.com/v1/networks/ethereum/coins" \
  -H "Authorization: Bearer sk_live_your_api_key_here"
```

#### Пример ответа

```json
{
  "success": true,
  "data": [
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "decimals": 18,
      "contract_address": null,
      "is_native": true,
      "logo_url": "https://assets.gateway.com/coins/eth.png",
      "market_data": {
        "price_usd": "2500.00",
        "market_cap": "300000000000",
        "volume_24h": "15000000000"
      }
    },
    {
      "symbol": "USDT",
      "name": "Tether USD",
      "decimals": 6,
      "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "is_native": false,
      "logo_url": "https://assets.gateway.com/coins/usdt.png",
      "market_data": {
        "price_usd": "1.00",
        "market_cap": "95000000000",
        "volume_24h": "50000000000"
      }
    }
  ]
}
```

## Статусы сетей

| Статус | Описание |
|--------|----------|
| `active` | Сеть активна и полностью функциональна |
| `maintenance` | Сеть находится на техническом обслуживании |
| `degraded` | Сеть работает с ограничениями |
| `disabled` | Сеть временно отключена |

## Типы сетей

| Тип | Описание |
|-----|----------|
| `mainnet` | Основная сеть |
| `testnet` | Тестовая сеть |

## Уровни загруженности сети

| Уровень | Описание |
|---------|----------|
| `low` | Низкая загруженность, быстрые подтверждения |
| `medium` | Средняя загруженность, стандартное время |
| `high` | Высокая загруженность, медленные подтверждения |
| `critical` | Критическая загруженность, очень медленно |

## Webhook уведомления

### network.status_changed

Отправляется при изменении статуса сети.

```json
{
  "event": "network.status_changed",
  "data": {
    "network_id": "ethereum",
    "old_status": "active",
    "new_status": "maintenance",
    "reason": "Scheduled maintenance",
    "estimated_duration": "2 hours",
    "changed_at": "2025-01-01T12:00:00Z"
  }
}
```

### network.congestion_alert

Отправляется при высокой загруженности сети.

```json
{
  "event": "network.congestion_alert",
  "data": {
    "network_id": "ethereum",
    "congestion_level": "high",
    "gas_price": "50000000000",
    "pending_transactions": 200000,
    "estimated_delay": "10 minutes"
  }
}
```

## Коды ошибок

| Код | Описание |
|-----|----------|
| `NETWORK_NOT_FOUND` | Сеть не найдена |
| `NETWORK_DISABLED` | Сеть отключена |
| `NETWORK_MAINTENANCE` | Сеть на обслуживании |
| `COIN_NOT_SUPPORTED` | Монета не поддерживается в данной сети |

## Примеры использования

### Проверка доступности сети

```javascript
async function checkNetworkAvailability(networkId) {
  try {
    const response = await fetch(`/api/networks/${networkId}/status`, {
      headers: {
        'Authorization': 'Bearer sk_live_your_api_key_here'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const status = result.data;
      
      if (status.status === 'active' && status.is_synced) {
        console.log(`Сеть ${networkId} доступна`);
        return true;
      } else {
        console.log(`Сеть ${networkId} недоступна: ${status.status}`);
        return false;
      }
    }
  } catch (error) {
    console.error('Ошибка при проверке сети:', error);
    return false;
  }
}
```

### Получение оптимальной комиссии

```javascript
async function getOptimalFee(networkId, priority = 'standard') {
  try {
    const response = await fetch(`/api/networks/${networkId}/fees`, {
      headers: {
        'Authorization': 'Bearer sk_live_your_api_key_here'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const fees = result.data;
      const gasPrice = fees.gas_price[priority];
      
      console.log(`Рекомендуемая комиссия (${priority}): ${gasPrice.gwei} Gwei`);
      console.log(`Ожидаемое время: ${gasPrice.estimated_time}`);
      
      return gasPrice;
    }
  } catch (error) {
    console.error('Ошибка при получении комиссий:', error);
    return null;
  }
}
```

### Мониторинг состояния сетей

```javascript
async function monitorNetworks() {
  try {
    const response = await fetch('/api/networks', {
      headers: {
        'Authorization': 'Bearer sk_live_your_api_key_here'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const networks = result.data;
      
      for (const network of networks) {
        console.log(`${network.name}: ${network.status}`);
        
        if (network.status !== 'active') {
          console.warn(`⚠️ Сеть ${network.name} недоступна!`);
        }
      }
      
      return networks;
    }
  } catch (error) {
    console.error('Ошибка при мониторинге сетей:', error);
    return [];
  }
}
```

## Рекомендации

1. **Проверяйте статус сети** перед выполнением операций
2. **Мониторьте загруженность** для оптимизации комиссий
3. **Используйте webhook'и** для уведомлений о статусе
4. **Кэшируйте информацию** о сетях для повышения производительности
5. **Обрабатывайте ошибки** сетей gracefully

Эта документация обеспечивает полное понимание работы с API сетей для эффективной интеграции.
