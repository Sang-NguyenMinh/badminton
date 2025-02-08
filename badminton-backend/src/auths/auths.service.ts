import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/core/users/users.service';
import { BcryptService } from 'src/helper/bcrypt.service';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { ROLES } from 'src/config/type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsernameOrEmail(username);

    if (!user) return null;

    const isValidPassword = await this.bcryptService.comparePassword(
      password,
      user.password,
    );
    if (!isValidPassword) return null;

    return user;
  }

  async login(user: any) {
    const payload = { email: user?.email, sub: user._id, role: user?.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle(user: any) {
    const payload = { username: user.email, sub: user._id, role: user.role };
    return {
      user: {
        email: user.email,
        _id: user._id,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req: any, res: any) {
    if (!req.user) {
      return res.status(401).json({ message: 'Không có người dùng từ Google' });
    }

    const loginResult = await this.loginWithGoogle(req.user);

    return res.json(loginResult);
  }

  handleRegister = async (createAuthDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(createAuthDto);
  };

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data);
  };

  retryActive = async (email: string) => {
    return await this.usersService.retryActive(email);
  };

  retryPassword = async (data: string) => {
    return await this.usersService.retryPassword(data);
  };

  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.usersService.changePassword(data);
  };

  async validateGoogleUser(googleUser: any): Promise<any> {
    const user = await this.usersService.findByUsernameOrEmail(
      googleUser.email,
    );

    if (!user) {
      const user = await this.usersService.create({
        displayName: `${googleUser.firstName} ${googleUser.lastName}`,
        role: ROLES.USER,
        email: googleUser.email,
        isActive: true,
      });
      return {
        _id: user._id,
        role: ROLES.USER,
        email: googleUser.email,
      };
    }

    return user;
  }
}
