import { PaymentService } from './types';

export class PayPalService implements PaymentService {
  private clientId: string;
  private isInitialized: boolean = false;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadPayPalScript();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize PayPal:', error);
      throw new Error('PayPal initialization failed');
    }
  }

  private async loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=USD`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
      document.body.appendChild(script);
    });
  }

  async createPayment(amount: number): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'USD'
        }),
      });

      const orderData = await response.json();
      if (!orderData.id) {
        throw new Error('Failed to create PayPal order');
      }

      return orderData.id;
    } catch (error) {
      console.error('Failed to create PayPal payment:', error);
      throw error;
    }
  }

  async processPayment(orderId: string): Promise<{
    success: boolean;
    transactionId: string;
    message: string;
  }> {
    try {
      const response = await fetch(`/api/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const orderData = await response.json();
      const transaction = orderData?.purchase_units?.[0]?.payments?.captures?.[0];

      if (!transaction) {
        throw new Error('Transaction failed');
      }

      return {
        success: transaction.status === 'COMPLETED',
        transactionId: transaction.id,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      console.error('PayPal payment processing failed:', error);
      throw error;
    }
  }

  renderPayPalButton(
    containerId: string,
    amount: number,
    onSuccess: (transactionId: string) => void,
    onError: (error: Error) => void
  ): void {
    if (!window.paypal) {
      onError(new Error('PayPal SDK not loaded'));
      return;
    }

    window.paypal.Buttons({
      style: {
        shape: 'pill',
        layout: 'vertical',
      },
      createOrder: async () => {
        try {
          return await this.createPayment(amount);
        } catch (error) {
          onError(error as Error);
          throw error;
        }
      },
      onApprove: async (data) => {
        try {
          const result = await this.processPayment(data.orderID);
          if (result.success) {
            onSuccess(result.transactionId);
          } else {
            onError(new Error(result.message));
          }
        } catch (error) {
          onError(error as Error);
        }
      },
      onError: (error: Error) => {
        onError(error);
      }
    }).render(`#${containerId}`);
  }
}