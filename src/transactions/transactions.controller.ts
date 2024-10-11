import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: TokenPayload) {
    const result = await this.transactionsService.findAll(user.userUuid);
    const balance = await this.transactionsService.getBalance(user.userUuid);

    return {
      message: 'Get all transactions successfully',
      success: true,
      status_code: HttpStatus.OK,
      data: {
        transactions: result,
        total_income: balance.income,
        total_expense: balance.expense,
        my_pocket: balance.pocket,
      },
    };
  }
}
