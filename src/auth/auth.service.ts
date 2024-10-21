import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidationService } from 'src/common/validation.service';
import { RegisterAuthRequest } from 'src/model/auth.model';
import { AuthValidation } from './auth.validation';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from '@prisma/client';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly validationService: ValidationService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterAuthRequest) {
    const validateData: RegisterAuthRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      data,
    );
    const newUser = await this.usersService.create(validateData);
    return newUser;
  }

  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.get<string>('JWT_EXPIRATION')),
    );

    const tokenPayload: TokenPayload = {
      userUuid: user.uuid,
    };
    const token = this.jwtService.sign(tokenPayload);

    response.cookie('auth', token, {
      secure: true,
      httpOnly: true,
    });

    return { tokenPayload };
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!user || !isMatch) {
        throw new UnauthorizedException('Email or password are not valid');
      }

      return user;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException('Email or password are not valid');
      }
    }
  }
}
