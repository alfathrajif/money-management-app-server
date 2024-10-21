export class TransactionRequest {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  category_name: string;
}

export class UpdateTransaction {
  uuid: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  category_uuid: string;
}

export class CreateTransaction {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  category_uuid: string;
}
