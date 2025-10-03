import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GohighlevelService } from './gohighlevel.service';
import { GohighlevelController } from './gohighlevel.controller';
import { GohighlevelConversion } from './entities/gohighlevel.conversion.entity';
import { GohighlevelConversionMessage } from './entities/gohighlevel.messages.entity';
import { GohighlevelContact } from './entities/gohighlevel.contact.entity';
import { GohighlevelContactService } from './gohighlevel.contact.service';
import { GohighlevelConversationService } from './gohighlevel.conversation.service';

@Module({
  imports: [TypeOrmModule.forFeature([GohighlevelConversion, GohighlevelConversionMessage, GohighlevelContact])],
  controllers: [GohighlevelController],
  providers: [GohighlevelService, GohighlevelContactService, GohighlevelConversationService],
})
export class GohighlevelModule { }
