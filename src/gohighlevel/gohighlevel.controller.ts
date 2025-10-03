import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { GohighlevelService } from './gohighlevel.service';
import { CreateGohighlevelDto } from './dto/create-gohighlevel.dto';
import { UpdateGohighlevelDto } from './dto/update-gohighlevel.dto';
import { Public } from '@src/utils/decorators/auth.decorators';
import { Request, Response } from 'express';

@Controller('gohighlevel')
export class GohighlevelController {
  constructor(private readonly gohighlevelService: GohighlevelService) { }


  @Public()
  @Post('webhooks')
  async webhook(@Req() req: Request, @Res() response: Response) {
    await this.gohighlevelService.webhookHandler(req);

    return response.status(200).send('OK');
  }
}
