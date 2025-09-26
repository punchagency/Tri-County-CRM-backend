import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GohighlevelService } from './gohighlevel.service';
import { CreateGohighlevelDto } from './dto/create-gohighlevel.dto';
import { UpdateGohighlevelDto } from './dto/update-gohighlevel.dto';

@Controller('gohighlevel')
export class GohighlevelController {
  constructor(private readonly gohighlevelService: GohighlevelService) {}

  @Post()
  create(@Body() createGohighlevelDto: CreateGohighlevelDto) {
    return this.gohighlevelService.create(createGohighlevelDto);
  }

  @Get()
  findAll() {
    return this.gohighlevelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gohighlevelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGohighlevelDto: UpdateGohighlevelDto) {
    return this.gohighlevelService.update(+id, updateGohighlevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gohighlevelService.remove(+id);
  }
}
