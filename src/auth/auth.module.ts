import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@src/user/user.module';
import { SecurityModule } from '@src/config/security.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule, SecurityModule],
})
export class AuthModule { }
