# Go SDK Integration

This guide shows you how to integrate the Crypto Payment Gateway into your Go applications using our official SDK.

## Installation

Install the Go SDK using go modules:

```bash
go get github.com/your-org/crypto-gateway-go
```

## Quick Start

### Initialize the Client

```go
package main

import (
    "context"
    "fmt"
    "log"
    
    gateway "github.com/your-org/crypto-gateway-go"
)

func main() {
    // Initialize the client with your API key
    client := gateway.NewClient(&gateway.Config{
        APIKey:  "your-api-key",
        BaseURL: "https://api.your-gateway.com",
        Timeout: 30, // seconds
    })
    
    // Test the connection
    networks, err := client.GetNetworks(context.Background())
    if err != nil {
        log.Fatal("Failed to connect:", err)
    }
    
    fmt.Printf("Connected! Available networks: %d\n", len(networks))
}
```

### Create an Address

```go
func createAddress(client *gateway.Client) {
    ctx := context.Background()
    
    // Create address for Ethereum network
    req := &gateway.CreateAddressRequest{
        Network: "ethereum",
        Coin:    "usdt", // Optional: specify coin
    }
    
    address, err := client.CreateAddress(ctx, req)
    if err != nil {
        log.Printf("Error creating address: %v", err)
        return
    }
    
    fmt.Printf("Created address: %s\n", address.Address)
    fmt.Printf("Network: %s\n", address.Network)
    fmt.Printf("Affected networks: %v\n", address.AffectedNetworks)
    
    // Print balances
    for _, balance := range address.Balances {
        fmt.Printf("Coin: %s, Balance: %s\n", balance.Coin, balance.Balance)
    }
}
```

### Check Address Balance

```go
func checkBalance(client *gateway.Client, address string) {
    ctx := context.Background()
    
    addressInfo, err := client.GetAddress(ctx, address)
    if err != nil {
        log.Printf("Error getting address: %v", err)
        return
    }
    
    fmt.Printf("Address: %s\n", addressInfo.Address)
    fmt.Printf("Status: %s\n", addressInfo.Status)
    fmt.Printf("Total USD Value: %s\n", addressInfo.TotalUSDValue)
    
    for _, balance := range addressInfo.Balances {
        fmt.Printf("  %s: %s (USD: %s)\n", 
            balance.Coin, balance.Balance, balance.USDValue)
    }
}
```

### Process Withdrawal

```go
func processWithdrawal(client *gateway.Client) {
    ctx := context.Background()
    
    req := &gateway.WithdrawRequest{
        Network:     "ethereum",
        Coin:        "usdt",
        ToAddress:   "0x742d35Cc6634C0532925a3b8D4C9db96590c4C87",
        Amount:      "100.0",
        Description: "User withdrawal",
    }
    
    withdrawal, err := client.Withdraw(ctx, req)
    if err != nil {
        log.Printf("Error processing withdrawal: %v", err)
        return
    }
    
    fmt.Printf("Withdrawal ID: %s\n", withdrawal.ID)
    fmt.Printf("Status: %s\n", withdrawal.Status)
    fmt.Printf("Transaction Hash: %s\n", withdrawal.TxHash)
}
```

## Error Handling

```go
import (
    "errors"
    gateway "github.com/your-org/crypto-gateway-go"
)

func handleErrors(client *gateway.Client) {
    ctx := context.Background()
    
    _, err := client.GetAddress(ctx, "invalid-address")
    if err != nil {
        var apiErr *gateway.APIError
        if errors.As(err, &apiErr) {
            fmt.Printf("API Error: %s (Code: %s)\n", apiErr.Message, apiErr.Code)
            
            // Handle specific error codes
            switch apiErr.Code {
            case "NOT_FOUND":
                fmt.Println("Address not found")
            case "INVALID_PARAMETER":
                fmt.Println("Invalid parameter provided")
                for _, detail := range apiErr.Details {
                    fmt.Printf("  Field: %s, Value: %s\n", detail.Field, detail.Value)
                }
            default:
                fmt.Printf("Unknown error: %s\n", apiErr.Code)
            }
        } else {
            fmt.Printf("Network error: %v\n", err)
        }
    }
}
```

## Best Practices

### 1. Connection Management
- Reuse the client instance across your application
- Set appropriate timeouts for your use case
- Implement connection pooling for high-traffic applications

### 2. Error Handling
- Always check for errors and handle them appropriately
- Implement retry logic with exponential backoff
- Log errors for debugging and monitoring

### 3. Security
- Store API keys securely (environment variables, secret management)
- Validate webhook signatures
- Use HTTPS for all communications

### 4. Performance
- Use context for request cancellation and timeouts
- Implement caching for frequently accessed data
- Use goroutines for concurrent operations

## Next Steps

- [TypeScript Integration](./typescript.md) - Integrate with TypeScript/Node.js
- [Python Integration](./python.md) - Integrate with Python
- [API Reference](../api/overview.md) - Complete API documentation 