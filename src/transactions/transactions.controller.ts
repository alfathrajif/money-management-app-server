import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { TransactionsService } from './transactions.service';
import {
  DataTransaction,
  TransactionRequest,
} from 'src/model/transaction.model';
import { CategoriesService } from 'src/categories/categories.service';
import { WebResponse } from 'src/model/web.model';
import { PaymentMethodsService } from 'src/payment-methods/payment-methods.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly categoriesService: CategoriesService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: TokenPayload,
  ): Promise<WebResponse<DataTransaction>> {
    const transactions = await this.transactionsService.findAll(user.userUuid);

    const getBalance = await this.transactionsService.getBalance(user.userUuid);

    return {
      message: 'Get all transactions successfully',
      success: true,
      status_code: HttpStatus.OK,
      data: {
        transactions: transactions,
        total_income: getBalance.income,
        total_expense: getBalance.expense,
        sum_payment_methods: getBalance.payMethods,
        my_pocket: getBalance.total,
      },
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: TokenPayload,
    @Body() body: TransactionRequest,
  ) {
    const category = await this.categoriesService.create(user.userUuid, {
      name: body.category_name,
      type: body.type,
    });

    const paymentMethod = await this.paymentMethodsService.create(
      user.userUuid,
      {
        name: body.payment_method_name,
      },
    );

    const newTransaction = await this.transactionsService.create(
      user.userUuid,
      {
        type: body.type,
        amount: body.amount,
        description: body.description,
        date: body.date,
        category_uuid: category.uuid,
        payment_method_uuid: paymentMethod.uuid,
      },
    );

    return {
      message: 'Create transaction successfully',
      success: true,
      status_code: HttpStatus.CREATED,
      data: newTransaction,
    };
  }

  @Put('/:uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: TokenPayload,
    @Body() body: TransactionRequest,
    @Param('uuid') uuid: string,
  ) {
    const category = await this.categoriesService.create(user.userUuid, {
      name: body.category_name,
      type: body.type,
    });

    const paymentMethod = await this.paymentMethodsService.create(
      user.userUuid,
      {
        name: body.payment_method_name,
      },
    );

    const result = await this.transactionsService.update(user.userUuid, uuid, {
      type: body.type,
      amount: body.amount,
      description: body.description,
      date: body.date,
      category_uuid: category.uuid,
      payment_method_uuid: paymentMethod.uuid,
    });

    return {
      message: 'Update transaction successfully',
      success: true,
      status_code: HttpStatus.OK,
      data: result,
    };
  }

  @Delete('/:uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async delete(@CurrentUser() user: TokenPayload, @Param('uuid') uuid: string) {
    await this.transactionsService.delete(user.userUuid, uuid);

    return {
      message: 'Delete transaction successfully',
      success: true,
      status_code: HttpStatus.OK,
    };
  }
}
