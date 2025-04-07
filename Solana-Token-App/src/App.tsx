import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletContextProvider } from './components/WalletProvider';
import { WalletBalance } from './components/WalletBalance';
import { TokenCreator } from './components/TokenCreator';
import { TransactionHistory } from './components/TransactionHistory';
import { TokenTransfer } from './components/TokenTransfer';
import { Toaster } from 'react-hot-toast';
import { CircuitBoard } from 'lucide-react';

function App() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-[#070a0d] text-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
              <CircuitBoard className="w-8 h-8 text-[#00f3ff]" />
              <h1 className="text-3xl font-bold neon-text">Solana Token App</h1>
            </div>
            <WalletMultiButton className="wallet-button" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WalletBalance />
            <TokenCreator />
            <TokenTransfer />
            <div className="md:col-span-2">
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#050d1a',
            color: '#e6f1ff',
            border: '1px solid #00f3ff',
            boxShadow: '0 0 10px #00f3ff'
          },
          duration: 4000,
        }}
      />
    </WalletContextProvider>
  );
}

export default App;