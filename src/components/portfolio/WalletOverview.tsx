import React, { useState, useCallback } from 'react';
import { Wallet, CreditCard, TrendingUp, PieChart, ArrowRightLeft, Plus, X, AlertTriangle, Clock } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { useWallet } from '../../hooks/useWallet';

export default function WalletOverview() {
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null);
  
  const { 
    wallet, 
    addFunds, 
    withdrawFunds, 
    isLoading, 
    error,
    pendingTransactions,
    getDailyVolume 
  } = useWallet();

  const handleTransfer = async () => {
    if (!amount || isNaN(Number(amount)) || !paymentMethod) return;
    
    try {
      if (transferType === 'deposit') {
        await addFunds(Number(amount), paymentMethod);
      } else {
        await withdrawFunds(Number(amount), paymentMethod);
      }
      setShowFundsModal(false);
      setAmount('');
      setPaymentMethod(null);
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };

  const handlePayPalSuccess = async (transactionId: string) => {
    try {
      await addFunds(Number(amount), 'paypal');
      setShowFundsModal(false);
      setAmount('');
      setPaymentMethod(null);
    } catch (error) {
      console.error('PayPal transfer failed:', error);
    }
  };

  const handlePayPalError = (error: Error) => {
    console.error('PayPal error:', error);
  };

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }, []);

  const renderPendingTransactions = () => {
    if (pendingTransactions.length === 0) return null;

    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Pending Transactions
        </h4>
        {pendingTransactions.map(tx => (
          <div 
            key={tx.id}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'} {formatCurrency(tx.amount)}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Processing...
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-300">{error.message}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Wallet Overview
        </h2>
        <button 
          onClick={() => setShowFundsModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-colors flex items-center gap-2 shadow-lg"
          disabled={isLoading}
        >
          <CreditCard className="w-4 h-4" />
          Transfer Funds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Available Balance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(wallet.balance)}
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          {renderPendingTransactions()}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">24h Change</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            +{wallet.performance24h}%
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            +{formatCurrency(wallet.balance * wallet.performance24h / 100)}
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">24h Volume</div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(getDailyVolume())}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
              <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Asset Distribution</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Crypto</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">50%</span>
            </div>
            <div className="flex gap-2">
              <div className="h-2 rounded-full bg-blue-500 w-1/2"></div>
              <div className="h-2 rounded-full bg-green-500 w-1/4"></div>
              <div className="h-2 rounded-full bg-purple-500 w-1/4"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>BTC 30%</span>
              <span>ETH 15%</span>
              <span>Others 5%</span>
            </div>
          </div>
        </div>
      </div>

      {showFundsModal && (
        <PaymentModal
          isOpen={showFundsModal}
          onClose={() => setShowFundsModal(false)}
          onSubmit={handleTransfer}
          type={paymentMethod || 'card'}
          transferType={transferType}
          amount={amount}
          onAmountChange={setAmount}
          onPaymentMethodChange={setPaymentMethod}
          onTransferTypeChange={setTransferType}
          onPayPalSuccess={handlePayPalSuccess}
          onPayPalError={handlePayPalError}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}