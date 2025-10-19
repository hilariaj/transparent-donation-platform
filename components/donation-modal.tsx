
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import type { Cause, DonationReceipt } from "@/lib/types";
import { usePolkadotWallet } from "../hooks/usePolkadotWallet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cause: Cause | null;
  onComplete: (receipt: DonationReceipt) => void;
};

export default function DonationModal({ open, onOpenChange, cause, onComplete }: Props) {
  const { selected, connect } = usePolkadotWallet();
  const [amount, setAmount] = useState<string>("0.1");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleDonate = async () => {
    if (!selected) {
      await connect();
      return;
    }
    if (!cause) return;

    try {
      setLoading(true);
      setErr(null);

      // Here, we'll ship the extrinsic with @polkadot/api in the future.
      // For now, we generate a mock receipt to unlock the build.

      const amountNum = Number(amount);
      if (Number.isNaN(amountNum) || amountNum <= 0) {
        setErr("Enter a valid value (DOT).");
        setLoading(false);
        return;
      }
     
      const receipt: DonationReceipt = {
        transactionHash: "0xMOCK_TX_HASH",
        blockNumber: 0,
        donor: selected.address,
        recipient: cause.walletAddress,     
        amount: amountNum,                   
        causeName: cause.name,              
        organization: cause.organization,
        category: cause.category,
        timestamp: new Date().toISOString(),
      };

      onComplete(receipt);
      onOpenChange(false);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to process donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm donation</DialogTitle>
          <DialogDescription>
            {cause ? `You will donate to: ${cause.name}` : "Select a cause"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="text-sm">
            <div>
              <strong>Wallet:</strong> {selected ? selected.address : "not connected"}
            </div>
            {!selected && (
              <Button onClick={connect} className="mt-2">
                Connect Wallet
              </Button>
            )}
          </div>

          <label className="block text-sm">
            Value (DOT)
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              inputMode="decimal"
              placeholder="0.10"
            />
          </label>

          {err ? <p className="text-red-500 text-sm">{err}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleDonate} disabled={loading || !cause}>
            {loading ? "Sending..." : "Donate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
