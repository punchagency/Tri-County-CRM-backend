import { Module } from '@nestjs/common';
import { GohighlevelService } from './gohighlevel.service';
import { GohighlevelController } from './gohighlevel.controller';

@Module({
  controllers: [GohighlevelController],
  providers: [GohighlevelService],
})
export class GohighlevelModule {}
