import { useState, useEffect, useCallback } from 'react';
import type { Wallet, WalletTransaction } from '../types/trading';

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

interface WalletError {
  code: string;
  message: string;
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>({
    id: '1',
    name: 'Main Trading Wallet',
    balance: 158942.67,
    performance24h: 2.45,
    assets: [],
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<WalletError | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setWallet(prev => {
        const change = (Math.random() - 0.48) * 100;
        const newBalance = prev.balance + change;
        const performance = (change / prev.balance) * 100;
        
        return {
          ...prev,
          balance: Number(newBalance.toFixed(2)),
          performance24h: Number((prev.performance24h + performance).toFixed(2))
        };
      });
    }, 3000);

    return () => clearInterval(updateInterval);
  }, []);

  // Process pending transactions
  useEffect(() => {
    const processPendingTx = setInterval(() => {
      setPendingTransactions(prev => {
        const now = Date.now();
        const completed = prev.map(tx => ({
          ...tx,
          status: now - tx.timestamp.getTime() > 5000 ? 'completed' : tx.status
        }));
        return completed.filter(tx => tx.status === 'pending');
      });
    }, 1000);

    return () => clearInterval(processPendingTx);
  }, []);

  const validateAmount = useCallback((amount: number): boolean => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError({ code: 'INVALID_AMOUNT', message: 'Please enter a valid amount' });
      return false;
    }
    if (amount > 1000000) {
      setError({ code: 'AMOUNT_TOO_LARGE', message: 'Amount exceeds maximum limit' });
      return false;
    }
    return true;
  }, []);

  const validateWithdrawal = useCallback((amount: number): boolean => {
    if (!validateAmount(amount)) return false;
    
    if (amount > wallet.balance) {
      setError({ code: 'INSUFFICIENT_FUNDS', message: 'Insufficient funds for withdrawal' });
      return false;
    }

    const pendingWithdrawals = pendingTransactions
      .filter(tx => tx.type === 'withdraw')
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (amount + pendingWithdrawals > wallet.balance) {
      setError({ code: 'PENDING_WITHDRAWAL', message: 'Pending withdrawals exceed available balance' });
      return false;
    }

    return true;
  }, [wallet.balance, pendingTransactions]);

  const processPayment = async (
    amount: number,
    method: 'card' | 'paypal'
  ): Promise<PaymentResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() > 0.95) {
      throw new Error('Payment processing failed');
    }
    
    return {
      success: true,
      transactionId: crypto.randomUUID(),
      message: 'Payment processed successfully'
    };
  };

  const addFunds = async (amount: number, method: 'card' | 'paypal'): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (!validateAmount(amount)) {
        throw new Error('Invalid amount specified');
      }

      const payment = await processPayment(amount, method);
      
      if (payment.success) {
        const transaction: WalletTransaction = {
          id: payment.transactionId,
          type: 'deposit',
          amount,
          timestamp: new Date(),
          status: 'pending',
          description: `Deposit via ${method}`
        };

        setPendingTransactions(prev => [...prev, transaction]);

        // Simulate blockchain confirmation delay
        setTimeout(() => {
          setWallet(prev => ({
            ...prev,
            balance: Number((prev.balance + amount).toFixed(2)),
            transactions: [...(prev.transactions || []), { ...transaction, status: 'completed' }]
          }));
        }, 5000);
      } else {
        throw new Error(payment.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add funds';
      setError({ code: 'DEPOSIT_FAILED', message: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (amount: number, method: 'card' | 'paypal'): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (!validateWithdrawal(amount)) {
        throw new Error('Withdrawal validation failed');
      }

      const payment = await processPayment(amount, method);
      
      if (payment.success) {
        const transaction: WalletTransaction = {
          id: payment.transactionId,
          type: 'withdraw',
          amount,
          timestamp: new Date(),
          status: 'pending',
          description: `Withdrawal via ${method}`
        };

        setPendingTransactions(prev => [...prev, transaction]);

        // Simulate blockchain confirmation delay
        setTimeout(() => {
          setWallet(prev => ({
            ...prev,
            balance: Number((prev.balance - amount).toFixed(2)),
            transactions: [...(prev.transactions || []), { ...transaction, status: 'completed' }]
          }));
        }, 5000);
      } else {
        throw new Error(payment.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to withdraw funds';
      setError({ code: 'WITHDRAWAL_FAILED', message: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionHistory = useCallback(() => {
    return [...(wallet.transactions || [])].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }, [wallet.transactions]);

  const getPendingTransactions = useCallback(() => {
    return pendingTransactions;
  }, [pendingTransactions]);

  const getDailyVolume = useCallback(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return wallet.transactions?.reduce((sum, tx) => 
      tx.timestamp >= oneDayAgo ? sum + tx.amount : sum, 0
    ) || 0;
  }, [wallet.transactions]);

  return {
    wallet,
    isLoading,
    error,
    addFunds,
    withdrawFunds,
    getTransactionHistory,
    getPendingTransactions,
    getDailyVolume,
    pendingTransactions
  };
}