import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTransaction } from 'src/model/transaction.model';

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
