import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { Category } from 'src/model/category.model';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userUuid: string, type?: string) {
    // let categories: Category[] = [];

    // if (type === 'income') {
    //   categories = await this.prismaService.category.findMany({
    //     where: {
    //       user_uuid: userUuid,
    //       type: 'income',
    //     },
    //     include: {
    //       transactions: true,
    //     },
    //   });
    // }

    // if (type === 'expense') {
    //   categories = await this.prismaService.category.findMany({
    //     where: {
    //       user_uuid: userUuid,
    //       type: 'expense',
    //     },
    //     include: {
    //       transactions: true,
    //     },
    //   });
    // }

    // if (!type) {
    //   categories = await this.prismaService.category.findMany({
    //     where: {
    //       user_uuid: userUuid,
    //     },
    //     include: {
    //       transactions: true,
    //     },
    //   });
    // }

    // categories = categories.map((category) => {
    //   const totalAmount = category.transactions.reduce((sum, transaction) => {
    //     return sum + transaction.amount; // Sum the amounts of each transaction
    //   }, 0);

    //   return {
    //     ...category,
    //     total_amount: totalAmount, // Total amount for this category
    //   };
    // });

    // categories.sort((a, b) => b.total_amount - a.total_amount);

    const queryConditions: any = {
      where: {
        user_uuid: userUuid,
      },
      include: {
        transactions: true,
      },
    };

    if (type) {
      queryConditions.where.type = type;
    }

    let categories: Category[] =
      await this.prismaService.category.findMany(queryConditions);

    categories = categories.map((category) => {
      const totalAmount = category.transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      );

      return {
        ...category,
        total_amount: totalAmount,
      };
    });

    categories.sort((a, b) => b.total_amount - a.total_amount);

    return categories;
  }
}
