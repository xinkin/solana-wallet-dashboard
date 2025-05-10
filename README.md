# Solana Wallet Analytics Dashboard

A Next.js 15 application that provides analytics for Solana wallets with secure authentication.

## Setup

### Prerequisites

- Node.js 18+ and npm
- Solana wallet (Phantom, Solflare, etc.)
- API keys for Helius and CoinGecko

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/solana-wallet-dashboard.git
cd solana-wallet-dashboard

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
```

You'll need to obtain API keys from:

- [Helius](https://helius.xyz/) - For Solana blockchain data
- [CoinGecko](https://www.coingecko.com/en/api) - For cryptocurrency price data

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Design Choices

### Architecture

The application follows a modern React architecture using Next.js 15 with the App Router:

- **Client/Server Components**: Strategic use of React Server Components for static content and Client Components for interactive elements
- **API Routes**: Next.js API routes for secure server-side operations like signature verification
- **TypeScript**: Strict typing throughout the codebase for better maintainability and fewer runtime errors

### State Management

- **Auth Provider**: Custom authentication context using wallet signatures stored in localStorage
- **TanStack Query**: Efficient data fetching with automatic caching and revalidation
- **Custom Hooks**: Abstracted data fetching logic into reusable hooks (useSolBalance, useTokenHoldings, etc.)

### UI Implementation

- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Component Architecture**: Modular components with clear separation of concerns
- **Lucide Icons**: Consistent iconography using Lucide React instead of inline SVGs
- **Responsive Design**: Mobile-first approach with fluid layouts

## Key Features

- **Wallet Authentication**: Secure login using Solana wallet signature verification
- **Transaction Activity**: GitHub-style heatmap showing transaction patterns over time
- **Portfolio Analysis**: Complete breakdown of SOL and token holdings with USD values
- **Token Management**: Detailed view of all tokens with filtering for spam tokens

## Challenges and Solutions

### Solana Learning Curve

- **EVM to Solana Transition**: Coming from Ethereum/EVM experience, adapting to Solana's account model and transaction structure required significant learning
- **Wallet Adapter**: Understanding and implementing Solana's wallet adapter ecosystem was different from EVM wallet connections
- **RPC Endpoints**: Working with Helius API and understanding Solana's RPC structure compared to EVM providers
- **Token Program**: Learning Solana's SPL token program and how token accounts work differently from ERC-20 tokens

### Authentication System

- **Message Signing**: Implementing and debugging the wallet signature verification process
- **Session Management**: Creating a robust authentication provider that maintains state across page refreshes
- **Route Protection**: Building a secure system that redirects unauthenticated users while allowing public access with address parameters
- **Error Handling**: Developing comprehensive error handling for various wallet connection scenarios

### Data Visualization

- **Transaction Heatmap**: Significant time spent implementing and debugging the GitHub-style activity heatmap that kept the transaction time frame for one year currently but can be modified to incorporate more than a year too
- **Data Processing**: Converting raw transaction data into a format suitable for the heatmap visualization

## Project Reflections

### Technical Challenges Encountered

This project represented a significant transition from my previous experience with Ethereum and EVM-compatible chains to the Solana ecosystem:

1. **Solana Blockchain Architecture**: The transition from Ethereum's account/contract model to Solana's account-based architecture required substantial adjustment. Solana's approach to state management, account ownership, and program execution differs fundamentally from EVM patterns.

2. **Authentication Implementation**: Developing a robust wallet-based authentication system presented several technical hurdles. The signature verification process required meticulous implementation, particularly when accommodating multiple wallet providers. Maintaining persistent authentication state across sessions required careful state management.

3. **Data Visualization Complexity**: The implementation of the GitHub-style transaction heatmap involved significant complexity. The transformation of raw blockchain transaction data into an appropriate format for time-series visualization required multiple optimization iterations.

4. **Component Integration**: Ensuring seamless integration between multiple components while maintaining clean architecture and separation of concerns remained a consistent engineering challenge throughout development.

### Professional Development Outcomes

The project provided valuable opportunities for technical growth:

- Gained proficiency in Solana's high-performance blockchain architecture and programming model
- Developed expertise with Solana's wallet adapter ecosystem and authentication patterns
- Established competence with Helius API integration for blockchain data retrieval
- Enhanced skills in secure authentication implementation within decentralized applications

This project effectively expanded my blockchain development capabilities beyond EVM-based systems, providing valuable experience with alternative blockchain architectures and development patterns.

## Security Considerations

- **Cryptographic Authentication**: Implementation of wallet-based authentication using cryptographic signatures for ownership verification
- **Public Access Functionality**: Dashboard accessibility via address parameters without requiring authentication, enabling public wallet analysis
- **Authorization Controls**: Implementation of route protection with appropriate redirection for unauthorized access attempts
- **State Persistence**: Secure maintenance of authentication state in localStorage with comprehensive validation
- **Server-Side Verification**: Implementation of signature verification on the server to prevent request tampering

## Deployment

### Vercel Deployment

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure the environment variables:
   - `NEXT_PUBLIC_HELIUS_API_KEY`
   - `NEXT_PUBLIC_COINGECKO_API_KEY`
4. Deploy the application

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```
