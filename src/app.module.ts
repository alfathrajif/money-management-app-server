import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    CategoriesModule,
    PaymentMethodsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
