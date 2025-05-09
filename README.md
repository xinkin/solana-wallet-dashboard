# Solana Wallet Analytics Dashboard

A Next.js 15 application that lets users connect their Solana wallet to access an analytics dashboard for their own wallet or any Solana address they search for.

## Features

- **Authentication**: Connect Solana wallet and sign a message to verify ownership
- **Transaction Activity**: GitHub-style activity grid showing daily transactions
- **Portfolio View**: SOL balance with USD value and all SPL tokens
- **Wallet Search**: Search for any Solana address and view its analytics

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS for styling
- @solana/web3.js for Solana blockchain interactions
- @solana/wallet-adapter for wallet connections
- TanStack Query (React Query) for data fetching
- Framer Motion for animations
- react-calendar-heatmap for GitHub-style activity grid
- Recharts for data visualization

## Design Choices

### Architecture

- **App Router**: Using Next.js App Router for better SEO and improved routing
- **Server Components**: Leveraging React Server Components for improved performance
- **Client Components**: Using Client Components for interactive elements
- **API Routes**: Implementing API routes for data fetching and processing

### State Management

- **React Context**: For global state management (wallet connection)
- **TanStack Query**: For data fetching, caching, and revalidation with advanced features like query invalidation and mutation handling

### Authentication

- **Wallet Adapter**: Using Solana Wallet Adapter for seamless wallet connections
- **Message Signing**: Implementing message signing for wallet verification

### UI/UX

- **Dark Theme**: Sleek dark-themed UI optimized for data visualization
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Loading States**: Skeleton loaders for better user experience
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Animations**: Smooth transitions and animations with Framer Motion

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Challenges and Solutions

- **Large Transaction Sets**: Implemented pagination and virtualized lists for efficient rendering
- **Real-time Data**: Used TanStack Query for automatic revalidation of data with advanced caching
- **Wallet Connection**: Handled various wallet providers and connection states
- **Error Handling**: Implemented comprehensive error boundaries and fallbacks

## AI Assistance

This project was developed with assistance from AI tools for:

- Initial project structure
- Component architecture
- API integration patterns
- UI/UX design principles

## Deployment

The application can be deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/yourusername/solana-wallet-dashboard)
