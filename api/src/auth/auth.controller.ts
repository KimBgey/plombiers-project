import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { AuthGuard } from '@nestjs/passport'

class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string

  @IsNotEmpty()
  @MinLength(6, { message: 'Mot de passe trop court' })
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req: any) {
    return this.authService.me(req.user.sub)
  }
}