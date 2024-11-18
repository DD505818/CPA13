export interface PaymentService {
  initialize(): Promise<void>;
  createPayment(amount: number): Promise<string>;
  processPayment(orderId: string): Promise<{
    success: boolean;
    transactionId: string;
    message: string;
  }>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}