import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

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
      },
    });
  }

  async getBalance(userUuid: string) {
    const totalIncome = await this.prismaService.transaction.aggregate({
      where: {
        user_uuid: userUuid,
        type: 'income',
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpense = await this.prismaService.transaction.aggregate({
      where: {
        user_uuid: userUuid,
        type: 'expense',
      },
      _sum: {
        amount: true,
      },
    });

    return {
      income: totalIncome._sum.amount,
      expense: totalExpense._sum.amount,
      pocket: totalIncome._sum.amount - totalExpense._sum.amount,
    };
  }
}
