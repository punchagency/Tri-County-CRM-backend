import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GohighlevelService } from './gohighlevel.service';
import { GohighlevelController } from './gohighlevel.controller';
import { GohighlevelConversion } from './entities/gohighlevel.conversion.entity';
import { GohighlevelConversionMessage } from './entities/gohighlevel.messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GohighlevelConversion, GohighlevelConversionMessage])],
  controllers: [GohighlevelController],
  providers: [GohighlevelService],
})
export class GohighlevelModule { }
