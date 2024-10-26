import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CategoriesModule } from 'src/categories/categories.module';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';

@Module({
  imports: [CategoriesModule, PaymentMethodsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
