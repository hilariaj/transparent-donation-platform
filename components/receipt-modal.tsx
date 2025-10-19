"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { CheckCircle2, ExternalLink, Download } from "lucide-react"
import type { DonationReceipt } from "@/lib/types"


interface ReceiptModalProps {
  receipt: DonationReceipt
  onClose: () => void
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const handleViewOnChain = () => {
    // Open blockchain explorer
    window.open(`https://basescan.org/tx/${receipt.transactionHash}`, "_blank")
  }

  const handleDownload = () => {
    // Create downloadable receipt
    const receiptData = JSON.stringify(receipt, null, 2)
    const blob = new Blob([receiptData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `donation-receipt-${receipt.transactionHash.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <DialogTitle>Donation Successful!</DialogTitle>
              <DialogDescription>Your contribution has been recorded on-chain</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Receipt Details */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Amount Donated</p>
                <p className="text-3xl font-bold text-foreground">{receipt.amount} ETH</p>
              </div>
              <Badge variant="default" className="bg-green-600">
                Confirmed
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cause:</span>
                <span className="font-medium text-right">{receipt.causeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-medium text-right">{receipt.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="secondary" className="capitalize">
                  {receipt.category}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date(receipt.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Blockchain Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Blockchain Details</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Transaction Hash:</span>
                <span className="font-mono text-right break-all">{receipt.transactionHash}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Block Number:</span>
                <span className="font-mono">{receipt.blockNumber}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">From:</span>
                <span className="font-mono text-right break-all">{receipt.donor}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">To:</span>
                <span className="font-mono text-right break-all">{receipt.recipient}</span>
              </div>
            </div>
          </div>

          {/* Impact Message */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
            <p className="text-sm text-center text-balance">
              Thank you for your contribution! Your donation is now permanently recorded on the blockchain and will make
              a real difference.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleViewOnChain}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Chain
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
