# TransparentGive #
### On-chain Donations, Verified Impact ###
TransparentGive is a decentralized platform for transparent and verifiable donations, built on the Polkadot blockchain.
Each donation is recorded on-chain, ensuring total transparency, traceability, and verifiable impact.


## Features ##
- Integration with Talisman Wallet (Polkadot)
- On-chain donation receipts with transaction hash and details
- Verified causes with public goals and progress
- Modern interface built with Next.js + TypeScript + TailwindCSS
- Smart contract TransparentGive.sol to manage causes and donations


## How It Works ##
- Connect your Talisman Wallet.
- Choose a verified cause (Education, Health, Environment, etc.).
- Enter the donation amount (in DOT) and confirm the transaction.
- View your blockchain receipt with full on-chain details.


## Technologies ##
- Frontend: Next.js, React, TypeScript, TailwindCSS
- Blockchain: Polkadot
- Smart Contract: Solidity / Ink!
- Wallet: Talisman

## Impact ##
- TransparentGive brings trust and accountability to digital philanthropy, ensuring that every DOT donated truly makes a difference.


## Local Setup & Installation ##
Follow these steps to run the project locally:

1. Clone the Repository
> git clone https://github.com/<your-username>/transparent-donation-platform.git
> cd transparentgive

2. Install Dependencies
Make sure you have Node.js (v18 or higher) and npm installed, then run:
> npm install

3. Run the Development Server
> npm run dev

The app will be available at: http://localhost:3000

## Connect Your Wallet (Talisman) ##
To interact with the blockchain features:
1. Install the Talisman Wallet browser extension: https://talisman.xyz
2. Create or import a Polkadot account.
3. On the app, click "Connect Talisman" in the top-right corner.
4. Approve the connection request in your wallet.
5. You’re ready to make your first on-chain donation!
   

## Smart Contract Deployment ## 
If you want to deploy or test the smart contract:
1. Open Remix Polkadot IDE
2. Load the file "TransparentGive.sol".
3. Compile it with Solidity 0.8.28.
4. Deploy to your local or test network.
5. Copy the contract address and update it in your frontend ".env" configuration if needed.



