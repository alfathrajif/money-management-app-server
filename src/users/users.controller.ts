import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WebResponse } from 'src/model/web.model';
import { Profile } from 'src/model/users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getMe(
    @CurrentUser() user: TokenPayload,
  ): Promise<WebResponse<Profile>> {
    const result = await this.usersService.getUser({ uuid: user.userUuid });

    return {
      message: 'Get profile successfully',
      success: true,
      status_code: HttpStatus.OK,
      data: {
        uuid: result.uuid,
        name: result.name,
        email: result.email,
      },
    };
  }
}
