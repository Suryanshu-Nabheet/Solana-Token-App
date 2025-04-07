import { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Loader2, SendHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

export const TokenTransfer: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isTransferring, setIsTransferring] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');

  const handleTransfer = async () => {
    if (!publicKey) return;

    try {
      setIsTransferring(true);
      const recipientPubkey = new PublicKey(recipient);
      const mintPubkey = new PublicKey(tokenAddress);

      const senderAta = await getAssociatedTokenAddress(mintPubkey, publicKey);
      const recipientAta = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

      const transferInstruction = createTransferInstruction(
        senderAta,
        recipientAta,
        publicKey,
        BigInt(parseFloat(amount) * (10 ** 9))
      );

      const transaction = new Transaction().add(transferInstruction);
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      toast.success('Token transfer successful!');
      setRecipient('');
      setAmount('');
      setTokenAddress('');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      toast.error('Failed to transfer tokens');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="cyber-gradient rounded-lg neon-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <SendHorizontal className="w-6 h-6 text-[#00f3ff]" />
        <h2 className="text-2xl font-bold neon-text">Transfer Tokens</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Token Address</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="cyber-input"
            placeholder="Enter token address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="cyber-input"
            placeholder="Enter recipient address"
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
          onClick={handleTransfer}
          disabled={isTransferring || !publicKey}
          className="cyber-button"
        >
          {isTransferring ? (
            <>
              <Loader2 className="animate-spin mr-2 inline-block" size={20} />
              Transferring...
            </>
          ) : (
            'Transfer Tokens'
          )}
        </button>
      </div>
    </div>
  );
};