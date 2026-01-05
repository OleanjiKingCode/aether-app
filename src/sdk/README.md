# AetherDex Partner SDK

Integrate AetherDex cross-chain swap aggregation into your application with partner volume tracked for reward distribution.

## Installation

```bash
npm install @aetherdex/sdk
# or
yarn add @aetherdex/sdk
```

## Quick Start

```typescript
import { AetherDexSDK } from "@aetherdex/sdk";

// Initialize with your partner ID
const sdk = new AetherDexSDK({
  partnerId: "your-app-name",
  debug: true, // Optional: enable logging
});

// Get a quote for USDC → USDC cross-chain swap
const quote = await sdk.getQuote({
  fromChainId: 1, // Ethereum
  toChainId: 137, // Polygon
  fromToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC on ETH
  toToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC on Polygon
  fromAmount: "1000000000", // 1000 USDC (6 decimals)
  fromAddress: "0x...", // User's wallet
});

console.log(
  "You will receive:",
  AetherDexSDK.formatAmount(
    quote.estimate.toAmount,
    quote.action.toToken.decimals
  )
);
```

## Execute Swap

```typescript
import { ethers } from "ethers";

// Get transaction data
const txData = sdk.getSwapTransaction(quote);

if (txData) {
  // Execute with ethers.js
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const tx = await signer.sendTransaction({
    to: txData.to,
    data: txData.data,
    value: txData.value,
    gasLimit: txData.gasLimit,
  });

  console.log("Swap tx:", tx.hash);
}
```

## With Viem

```typescript
import { createWalletClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createWalletClient({
  chain: mainnet,
  transport: http(),
});

const txData = sdk.getSwapTransaction(quote);

const hash = await client.sendTransaction({
  to: txData.to,
  data: txData.data,
  value: BigInt(txData.value),
});
```

## API Reference

### Constructor

```typescript
new AetherDexSDK({
  partnerId: string, // Required: Your unique partner ID
  apiKey: string, // Optional: Custom API key
  debug: boolean, // Optional: Enable debug logging
});
```

### Methods

| Method                          | Description                         |
| ------------------------------- | ----------------------------------- |
| `getQuote(request)`             | Get best swap route with pricing    |
| `getRoutes(request)`            | Get multiple route options          |
| `getSwapTransaction(quote)`     | Extract transaction data from quote |
| `needsApproval(quote)`          | Check if token approval is needed   |
| `getApprovalTransaction(...)`   | Get approval tx data                |
| `getChains()`                   | Get supported chain IDs             |
| `getTokens()`                   | Get all tokens organized by chain   |
| `getTokensByChain(chainId)`     | Get tokens for specific chain       |
| `getAllTokens()`                | Get all tokens as flat array        |
| `searchToken(symbol, chainId?)` | Search for token by symbol          |
| `getSwapStatus(txHash, ...)`    | Check status of a swap transaction  |
| `getWalletSwaps(address, ...)`  | Get recent swaps for a wallet       |
| `getIntegrator()`               | Get your integrator tag             |

### Token Discovery Examples

```typescript
// Get all tokens organized by chain
const tokens = await sdk.getTokens();
console.log(tokens[1]); // All Ethereum tokens
console.log(tokens[137]); // All Polygon tokens

// Get tokens for a specific chain
const ethTokens = await sdk.getTokensByChain(1);

// Get all tokens as flat array
const allTokens = await sdk.getAllTokens();

// Search for USDC across all chains
const usdcTokens = await sdk.searchToken("USDC");

// Search for USDC only on Ethereum
const ethUSDC = await sdk.searchToken("USDC", 1);
```

### Static Helpers

```typescript
// Format wei to human readable
AetherDexSDK.formatAmount("1000000000", 6); // "1000.000000"

// Parse human readable to wei
AetherDexSDK.parseAmount("1000", 6); // "1000000000"
```

## Supported Chains

| Chain     | ID               |
| --------- | ---------------- |
| Ethereum  | 1                |
| Optimism  | 10               |
| BSC       | 56               |
| Polygon   | 137              |
| Fantom    | 250              |
| Arbitrum  | 42161            |
| Avalanche | 43114            |
| Solana    | 1151111081099710 |

## Fee Structure

- **2% fee** on all swaps goes to AetherDex
- Partner volume tracked via integrator tag: `aetherDex-{partnerId}`
- Rewards distributed manually based on tracked volume

## Support

- Telegram: https://t.me/Devwhateley
