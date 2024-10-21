import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { Category, CreateCategory } from 'src/model/category.model';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userUuid: string, type?: string) {
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

  async create(userUuid: string, category: CreateCategory) {
    const existingCategory = await this.prismaService.category.findFirst({
      where: {
        user_uuid: userUuid,
        name: category.name.toLowerCase(),
        type: category.type,
      },
    });

    if (existingCategory) {
      return existingCategory;
    }

    return this.prismaService.category.create({
      data: {
        user_uuid: userUuid,
        name: category.name.toLowerCase(),
        type: category.type,
      },
    });
  }
}
