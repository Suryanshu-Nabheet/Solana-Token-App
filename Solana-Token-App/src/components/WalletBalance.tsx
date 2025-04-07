import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Loader2, Wallet } from 'lucide-react';

export const WalletBalance: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }

      try {
        setIsLoading(true);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
    
    if (publicKey) {
      const id = connection.onAccountChange(publicKey, () => fetchBalance());
      return () => {
        connection.removeAccountChangeListener(id);
      };
    }
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <div className="cyber-gradient rounded-lg neon-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Wallet className="w-6 h-6 text-[#00f3ff]" />
        <h2 className="text-2xl font-bold neon-text">Wallet Balance</h2>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-300">SOL:</span>
        {isLoading ? (
          <Loader2 className="animate-spin text-[#00f3ff]" size={20} />
        ) : (
          <span className="font-bold text-[#00f3ff] transition-all duration-300 hover:text-opacity-80">
            {balance?.toFixed(4) || '0'}
          </span>
        )}
      </div>
    </div>
  );
};