import { Injectable } from '@nestjs/common';
import { Public } from './utils/decorators/auth.decorators';
import { Request } from 'express';

@Injectable()
export class AppService {

  getHello(req: Request): string {
    console.log("req", req.user);
    return 'Hello World!';
  }
}
