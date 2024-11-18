import React, { useEffect, useRef } from 'react';
import { PayPalService } from '../../services/payment/PayPalService';

interface PayPalButtonProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: Error) => void;
}

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  const buttonContainerId = useRef(`paypal-button-${Math.random().toString(36).slice(2)}`);
  const paypalService = useRef(new PayPalService(process.env.PAYPAL_CLIENT_ID || ''));

  useEffect(() => {
    const container = document.getElementById(buttonContainerId.current);
    if (!container) return;

    try {
      paypalService.current.renderPayPalButton(
        buttonContainerId.current,
        amount,
        onSuccess,
        onError
      );
    } catch (error) {
      onError(error as Error);
    }
  }, [amount, onSuccess, onError]);

  return <div id={buttonContainerId.current} />;
}