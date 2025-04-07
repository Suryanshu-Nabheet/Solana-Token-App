import { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Loader2, Coins } from 'lucide-react';
import toast from 'react-hot-toast';

export const TokenCreator: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [amount, setAmount] = useState('');

  const handleCreateToken = async () => {
    if (!publicKey) return;

    try {
      setIsCreating(true);
      const mint = Keypair.generate();

      const createMintTx = await createMint(
        connection,
        {
          publicKey,
          sendTransaction: (tx) => sendTransaction(tx, connection),
        },
        publicKey,
        publicKey,
        9,
        mint
      );

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          sendTransaction: (tx) => sendTransaction(tx, connection),
        },
        mint.publicKey,
        publicKey
      );

      await mintTo(
        connection,
        {
          publicKey,
          sendTransaction: (tx) => sendTransaction(tx, connection),
        },
        mint.publicKey,
        tokenAccount.address,
        publicKey,
        Number(amount) * LAMPORTS_PER_SOL
      );

      toast.success('Token created successfully!');
      setTokenName('');
      setAmount('');
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create token');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="cyber-gradient rounded-lg neon-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Coins className="w-6 h-6 text-[#00f3ff]" />
        <h2 className="text-2xl font-bold neon-text">Create Token</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Token Name</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="cyber-input"
            placeholder="Enter token name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="cyber-input"
            placeholder="Enter amount"
          />
        </div>
        <button
          onClick={handleCreateToken}
          disabled={isCreating || !publicKey}
          className="cyber-button"
        >
          {isCreating ? (
            <>
              <Loader2 className="animate-spin mr-2 inline-block" size={20} />
              Creating...
            </>
          ) : (
            'Create Token'
          )}
        </button>
      </div>
    </div>
  );
};