import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { RegisterUserDto } from '@modules/auth/dto/register-user.dto';
import { LoginUserDto } from '@modules/auth/dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  lofin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }
}
