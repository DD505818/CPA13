import React from 'react';
import { X, CreditCard, Wallet, Plus, ArrowRightLeft, Loader } from 'lucide-react';
import PayPalButton from '../payment/PayPalButton';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  type: 'card' | 'paypal';
  transferType: 'deposit' | 'withdraw';
  amount: string;
  onAmountChange: (value: string) => void;
  onPaymentMethodChange: (method: 'card' | 'paypal') => void;
  onTransferTypeChange: (type: 'deposit' | 'withdraw') => void;
  onPayPalSuccess: (transactionId: string) => void;
  onPayPalError: (error: Error) => void;
  isLoading: boolean;
  error: { code: string; message: string; } | null;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  transferType,
  amount,
  onAmountChange,
  onPaymentMethodChange,
  onTransferTypeChange,
  onPayPalSuccess,
  onPayPalError,
  isLoading,
  error
}: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          {type === 'card' ? (
            <CreditCard className="w-6 h-6" />
          ) : (
            <Wallet className="w-6 h-6" />
          )}
          Transfer Funds
        </h3>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onTransferTypeChange('deposit')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${transferType === 'deposit' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              <Plus className="w-4 h-4" />
              Deposit
            </button>
            <button
              type="button"
              onClick={() => onTransferTypeChange('withdraw')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${transferType === 'withdraw' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Withdraw
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onPaymentMethodChange('card')}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors
                  ${type === 'card'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => onPaymentMethodChange('paypal')}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors
                  ${type === 'paypal'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <Wallet className="w-5 h-5" />
                <span>PayPal</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error.message}</p>
            </div>
          )}

          {type === 'paypal' && amount && !isNaN(Number(amount)) ? (
            <PayPalButton
              amount={Number(amount)}
              onSuccess={onPayPalSuccess}
              onError={onPayPalError}
            />
          ) : (
            <button
              type="submit"
              disabled={!amount || isNaN(Number(amount)) || !type || isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {transferType === 'deposit' ? (
                    <Plus className="w-4 h-4" />
                  ) : (
                    <ArrowRightLeft className="w-4 h-4" />
                  )}
                  {transferType === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}