import { PartialType } from '@nestjs/mapped-types';
import { CreateGohighlevelDto } from './create-gohighlevel.dto';

export class UpdateGohighlevelDto extends PartialType(CreateGohighlevelDto) {}
