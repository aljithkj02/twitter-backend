import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { RegisterUserDto } from '@modules/auth/dto/register-user.dto';
import { LoginUserDto } from '@modules/auth/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  findAll(@Req() req: Request) {
    console.log(req.user);
    return this.authService.findAll();
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  lofin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }
}
