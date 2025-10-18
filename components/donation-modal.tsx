"use client"

import { useState } from "react"
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Loader2 } from "lucide-react"
import type { Cause, DonationReceipt } from "@/lib/types"

interface DonationModalProps {
  cause: Cause
  onClose: () => void
  onComplete: (receipt: DonationReceipt) => void
}

export function DonationModal({ cause, onClose, onComplete }: DonationModalProps) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  const { address, isConnected } = useAccount()
  const { data: hash, sendTransaction, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleDonate = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setError("")

    try {
      // Send real ETH transaction to the cause's wallet address
      sendTransaction({
        to: cause.walletAddress as `0x${string}`,
        value: parseEther(amount),
      })
    } catch (err) {
      setError("Transaction failed. Please try again.")
    }
  }

  if (isSuccess && hash) {
    const receipt: DonationReceipt = {
      transactionHash: hash,
      blockNumber: Date.now(), // In production, get from transaction receipt
      timestamp: new Date().toISOString(),
      donor: address || "0x0",
      recipient: cause.walletAddress,
      amount: Number.parseFloat(amount),
      causeName: cause.name,
      organization: cause.organization,
      category: cause.category,
    }
    onComplete(receipt)
  }

  const isProcessing = isPending || isConfirming

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Donate to {cause.name}</DialogTitle>
          <DialogDescription>{cause.organization}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cause Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {cause.category}
              </Badge>
              {cause.verified && (
                <Badge variant="default" className="bg-green-600">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{cause.aiSummary}</p>
          </div>

          <Separator />

          {!isConnected && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
              Please connect your wallet to make a donation
            </div>
          )}

          {/* Donation Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              min="0"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing || !isConnected}
            />
            <div className="flex gap-2">
              {["0.01", "0.05", "0.1", "0.5"].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset)}
                  disabled={isProcessing || !isConnected}
                >
                  {preset} ETH
                </Button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Transaction Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 space-y-1 text-sm">
            <p className="font-medium">On-chain transparency:</p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• Your donation will be recorded on the blockchain</li>
              <li>• You'll receive a verifiable receipt with transaction hash</li>
              <li>• Track your donation's impact in real-time</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleDonate} disabled={isProcessing || !amount || !isConnected} className="flex-1">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? "Confirming..." : "Processing..."}
                </>
              ) : (
                "Confirm Donation"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
