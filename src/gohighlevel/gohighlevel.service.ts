import { Injectable } from '@nestjs/common';
import { CreateGohighlevelDto } from './dto/create-gohighlevel.dto';
import { UpdateGohighlevelDto } from './dto/update-gohighlevel.dto';

@Injectable()
export class GohighlevelService {
  create(createGohighlevelDto: CreateGohighlevelDto) {
    return 'This action adds a new gohighlevel';
  }

  findAll() {
    return `This action returns all gohighlevel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gohighlevel`;
  }

  update(id: number, updateGohighlevelDto: UpdateGohighlevelDto) {
    return `This action updates a #${id} gohighlevel`;
  }

  remove(id: number) {
    return `This action removes a #${id} gohighlevel`;
  }
}
