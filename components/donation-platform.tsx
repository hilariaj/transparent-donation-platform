"use client"

import { useState } from "react"
import { CausesList } from "./causes-list"

import DonationModal from "./donation-modal";
import PolkadotWallet from "./polkadot-wallet";

import { ReceiptModal } from "./receipt-modal"
import { Input } from "./ui/input"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Search, Heart } from "lucide-react"
import type { Cause, DonationReceipt } from "@/lib/types"

export function DonationPlatform() {
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null)
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handleDonationComplete = (receipt: DonationReceipt) => {
    setSelectedCause(null)
    setReceipt(receipt)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">TransparentGive</h1>
                <p className="text-sm text-muted-foreground">On-chain donations, verified impact</p>
              </div>
            </div>
            <PolkadotWallet />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Support Verified Causes with <span className="text-blue-600">Transparent</span> Donations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Every donation is recorded on-chain. Track your impact with complete transparency and verifiable receipts.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search causes, NGOs, or communities..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="poverty">Poverty</TabsTrigger>
              <TabsTrigger value="disaster">Disaster</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Causes List */}
        <CausesList searchQuery={searchQuery} category={selectedCategory} onSelectCause={setSelectedCause} />
      </main>

      {/* Donation Modal */}
      <DonationModal
        open={!!selectedCause}
        onOpenChange={(open) => { if (!open) setSelectedCause(null); }}
        cause={selectedCause}
        onComplete={handleDonationComplete}
      />

      {/* Receipt Modal */}
      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </div>
  )
}
