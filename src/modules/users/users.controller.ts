import { Controller, Post, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    res.cookie('auth_token', 'token_value', {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return this.usersService.login(loginDto);
  }
}
