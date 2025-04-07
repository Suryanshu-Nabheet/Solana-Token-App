import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConfirmedSignatureInfo } from '@solana/web3.js';
import { Loader2, History } from 'lucide-react';

export const TransactionHistory: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) {
        setTransactions([]);
        return;
      }

      try {
        setIsLoading(true);
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 });
        setTransactions(signatures);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    
    if (publicKey) {
      const id = connection.onAccountChange(publicKey, () => fetchTransactions());
      return () => {
        connection.removeAccountChangeListener(id);
      };
    }
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <div className="cyber-gradient rounded-lg neon-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <History className="w-6 h-6 text-[#00f3ff]" />
        <h2 className="text-2xl font-bold neon-text">Recent Transactions</h2>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-[#00f3ff]" size={24} />
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.signature} className="transaction-item">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-gray-300 truncate">
                  {tx.signature.slice(0, 20)}...
                </span>
                <a
                  href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00f3ff] hover:text-[#33f5ff] text-sm transition-colors duration-300"
                >
                  View
                </a>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-gray-400 text-center">No recent transactions</p>
          )}
        </div>
      )}
    </div>
  );
};