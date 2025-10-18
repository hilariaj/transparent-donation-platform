"use client"

import type React from "react"

import { OnchainKitProvider } from "@coinbase/onchainkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base } from "viem/chains"
import { WagmiProvider, createConfig, http } from "wagmi"
import { coinbaseWallet } from "wagmi/connectors"

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "TransparentGive",
      preference: "smartWalletOnly",
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={base}>{children}</OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
