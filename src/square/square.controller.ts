import { Controller, Post, Req, Res } from '@nestjs/common';
import { SquareService } from './square.service';
import { Public } from '@src/utils/decorators/auth.decorators';
import { Request, Response } from 'express';

@Controller('square')
export class SquareController {
  constructor(private readonly squareService: SquareService) {}

  @Public()
  @Post('webhooks')
  async webhook(@Req() req: Request, @Res() response: Response) {
    await this.squareService.webhookHandler(req);

    return response.status(200).send('OK');
  }
}
