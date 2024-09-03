import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { RegisterUserDto } from '@modules/auth/dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }
}
