import { Category } from './category.model';
import { PaymentMethod, SumPaymentMethod } from './payment-method.model';

export class TransactionRequest {
  type: string; // income | expense
  amount: number;
  description: string;
  date: Date;
  category_name: string;
  payment_method_name: string;
}

export class UpdateTransaction {
  uuid: string;
  type: string; // income | expense
  amount: number;
  description: string;
  date: Date;
  category_uuid: string;
}

export class CreateTransaction {
  type: string; // income | expense
  amount: number;
  description: string;
  date: Date;
  category_uuid: string;
  payment_method_uuid: string;
}

export class Transaction {
  uuid: string;
  type: string; // income | expense
  amount: number;
  description: string;
  date: Date;
  category?: Category;
  payment_method?: PaymentMethod;
}

export class DataTransaction {
  transactions: Transaction[];
  total_income: number;
  total_expense: number;
  sum_payment_methods: SumPaymentMethod[];
  my_pocket: number;
}
