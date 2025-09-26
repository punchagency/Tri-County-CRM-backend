import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOneByEmailOrIdWithPassword(value: string) {
    if (value.includes('@')) {
      return this.userRepository.findOne({ where: { email: value }, select: ['password', 'id', 'email', 'name'] });
    }
    return this.userRepository.findOne({ where: { id: value }, select: ['password', 'id', 'email', 'name'] });
  }

  findOneByEmailOrIdWithoutPassword(value: string) {
    if (value.includes('@')) {
      return this.userRepository.findOne({ where: { email: value } });
    }
    return this.userRepository.findOne({ where: { id: value } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }
}
