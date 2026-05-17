export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type PaymentMethod = 'card' | 'cash' | 'bank_transfer';

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  transaction_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePayment {
  booking_id: number;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
}

export type UpdatePayment = Partial<CreatePayment> & {
  status?: PaymentStatus;
};
