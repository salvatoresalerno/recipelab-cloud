import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {  
    return this.authService.signup(signupDto.email, signupDto.password, signupDto.username);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    //return this.authService.login(loginDto);
    const result = await this.authService.login(loginDto);

    return {
      message: 'Login effettuato con successo',
      result: result 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return {
      success: true,
      data: req.user,
    };
  }

}
