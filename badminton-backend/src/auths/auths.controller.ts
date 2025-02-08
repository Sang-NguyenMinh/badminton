import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auths.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorators/customize';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { UsersService } from 'src/core/users/users.service';
import { CreateUserDto } from 'src/core/users/dto/user.dto';

@Controller('auth')
export class AuthsController {
  constructor(
    private readonly authsService: AuthService,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('gg/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      const data = await this.authsService.loginWithGoogle(req.user);
      return data;
    } catch (error) {}
  }

  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authsService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.handleRegister(createUserDto);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() codeAuthDto: CodeAuthDto) {
    return this.authsService.checkCode(codeAuthDto);
  }

  @Post('retry-active')
  @Public()
  retryActive(@Body('email') email: string) {
    return this.authsService.retryActive(email);
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body('email') email: string) {
    return this.authsService.retryPassword(email);
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authsService.changePassword(data);
  }
}
