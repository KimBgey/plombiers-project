import { PartialType } from '@nestjs/mapped-types';
import { CreatePlumberDto } from './create-plumber.dto';

export class UpdatePlumberDto extends PartialType(CreatePlumberDto) {}
