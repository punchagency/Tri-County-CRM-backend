import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '@src/user/user.service';

import { SecurityUtils } from "@src/utils/security.utils";
import { User } from '@src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getSecurityConfig } from '@src/config/security.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.findOneByEmailOrIdWithoutPassword(registerDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    // TODO: Validate for missing inputs

    const rounds = getSecurityConfig(new ConfigService()).bcrypt.rounds;
    const hashedPassword = await SecurityUtils.hashPassword(registerDto.password, rounds);
    registerDto.password = hashedPassword;


    return this.userService.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmailOrIdWithPassword(loginDto.email);

    const isPasswordValid = await SecurityUtils.comparePassword(loginDto.password, user.password);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.generateToken(user);

    return {
      ...tokens,
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.name };

    try {
      // Generate access token with expiration
      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      });

      // Generate refresh token with longer expiration
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      });

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error("Error generating tokens:", error);
      throw new Error("Failed to generate tokens");
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Get user from database
      const user = await this.userService.findOneByEmailOrIdWithoutPassword(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      return await this.generateToken(user);
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
// @Punch.Agency123