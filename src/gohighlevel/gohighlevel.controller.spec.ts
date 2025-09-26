import { Test, TestingModule } from '@nestjs/testing';
import { GohighlevelController } from './gohighlevel.controller';
import { GohighlevelService } from './gohighlevel.service';

describe('GohighlevelController', () => {
  let controller: GohighlevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GohighlevelController],
      providers: [GohighlevelService],
    }).compile();

    controller = module.get<GohighlevelController>(GohighlevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
