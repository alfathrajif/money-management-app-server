import { Transaction } from '@prisma/client';

export class Category {
  uuid: string;
  user_uuid: string;
  name: string;
  type: string; // income | expense
  created_at: Date;
  updated_at: Date;
  transactions?: Transaction[];
  total_amount?: number;
}

export class CreateCategory {
  name: string;
  type: string; // income | expense
}
