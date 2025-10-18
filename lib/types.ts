export interface Cause {
  id: string
  name: string
  organization: string
  category: "education" | "healthcare" | "environment" | "poverty" | "disaster" | "other"
  aiSummary: string
  aiTags: string[]
  description: string
  goal: number
  raised: number
  donors: number
  location: string
  verified: boolean
  walletAddress: string
}

export interface DonationReceipt {
  transactionHash: string
  blockNumber: number
  donor: string
  recipient: string
  amount: number
  causeName: string
  organization: string
  category: string
  timestamp: string
}
