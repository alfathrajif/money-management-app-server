import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterAuthRequest } from 'src/model/auth.model';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterAuthRequest) {
    const result = await this.authService.register(request);
    return {
      message: 'Registered successfully',
      success: true,
      status_code: HttpStatus.CREATED,
      data: result,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(user, response);

    return {
      message: 'Login successfully',
      success: true,
      status_code: HttpStatus.OK,
      data: result,
    };
  }
}
