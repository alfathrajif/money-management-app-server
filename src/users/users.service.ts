import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { UserRequest } from 'src/model/users.model';
import { ZodError } from 'zod';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: UserRequest) {
    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
        },
        select: {
          uuid: true,
          name: true,
          email: true,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ZodError([
          {
            code: 'custom',
            message: 'Email already exists',
            path: ['email'],
          },
        ]);
      }
      throw err;
    }
  }

  getUser(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
  }
}
