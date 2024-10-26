import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTransaction, Transaction } from 'src/model/transaction.model';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(userUuid: string) {
    return this.prismaService.transaction.findMany({
      where: {
        user_uuid: userUuid,
      },
      select: {
        uuid: true,
        category: true,
        type: true,
        amount: true,
        description: true,
        date: true,
        payment_method: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  create(userUuid: string, transaction: CreateTransaction) {
    return this.prismaService.transaction.create({
      data: {
        user_uuid: userUuid,
        category_uuid: transaction.category_uuid,
        payment_method_uuid: transaction.payment_method_uuid,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
      },
      include: {
        category: true,
      },
    });
  }

  update(userUuid: string, uuid: string, transaction: CreateTransaction) {
    return this.prismaService.transaction.update({
      where: {
        user_uuid: userUuid,
        uuid: uuid,
      },
      data: {
        category_uuid: transaction.category_uuid,
        payment_method_uuid: transaction.payment_method_uuid,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
      },
      include: {
        category: true,
      },
    });
  }

  delete(userUuid: string, uuid: string) {
    return this.prismaService.transaction.delete({
      where: {
        user_uuid: userUuid,
        uuid: uuid,
      },
    });
  }

  async getBalance(userUuid: string) {
    const [income, expense, paymentMethods] = await Promise.all([
      this.getAllTransactionBalance(userUuid, 'income'),
      this.getAllTransactionBalance(userUuid, 'expense'),
      this.getPaymentMethods(userUuid),
    ]);

    const totalPayMethods = paymentMethods.map((method) => {
      const totalIncome = this.calculateTotalByType(
        method.transactions,
        'income',
      );

      const totalExpense = this.calculateTotalByType(
        method.transactions,
        'expense',
      );

      return {
        name: method.name,
        income: totalIncome,
        expense: totalExpense,
        total: totalIncome - totalExpense,
      };
    });

    return {
      income: income,
      expense: expense,
      payMethods: totalPayMethods,
      total: income - expense,
    };
  }

  async getAllTransactionBalance(userUuid: string, type: string) {
    const balance = await this.prismaService.transaction.aggregate({
      where: {
        user_uuid: userUuid,
        type,
      },
      _sum: {
        amount: true,
      },
    });
    return balance._sum.amount || 0;
  }

  async getPaymentMethods(userUuid: string) {
    return this.prismaService.paymentMethod.findMany({
      where: {
        user_uuid: userUuid,
      },
      include: {
        transactions: true,
      },
    });
  }

  private calculateTotalByType(
    transactions: Transaction[],
    type: string,
  ): number {
    return transactions.reduce((acc, curr) => {
      if (curr.type === type) {
        return acc + curr.amount;
      }
      return acc;
    }, 0);
  }
}
