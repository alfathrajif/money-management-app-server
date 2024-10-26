import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userUuid: string, paymentMethod: { name: string }) {
    const existingPaymentMethod =
      await this.prismaService.paymentMethod.findFirst({
        where: {
          user_uuid: userUuid,
          name: paymentMethod.name.toLowerCase(),
        },
      });

    if (existingPaymentMethod) {
      return existingPaymentMethod;
    }

    return this.prismaService.paymentMethod.create({
      data: {
        user_uuid: userUuid,
        name: paymentMethod.name.toLowerCase(),
      },
    });
  }
}
