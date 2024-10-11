import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: TokenPayload,
    @Query() query: { type: string },
  ) {
    const result = await this.categoriesService.findAll(
      user.userUuid,
      query.type,
    );

    return {
      message: 'Get all categories successfully',
      success: true,
      status_code: HttpStatus.OK,
      data: result,
    };
  }
}
