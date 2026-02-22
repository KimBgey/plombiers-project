import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  Post,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { PlumbersService } from './plumbers.service';
import { AuthGuard } from '@nestjs/passport';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

class CreatePlumberDto {
  @IsNotEmpty() name: string;
  @IsEmail() email: string;
  @IsNotEmpty() phone: string;
  @IsNotEmpty() city: string;
  @MinLength(6) password: string;
}

class UpdatePlumberDto {
  @IsOptional() @IsNotEmpty() name?: string;
  @IsOptional() @IsNotEmpty() phone?: string;
  @IsOptional() @IsNotEmpty() city?: string;
}

class ChangePasswordDto {
  @IsNotEmpty() currentPassword: string;
  @MinLength(6) newPassword: string;
}

@Controller('plumbers')
export class PlumbersController {
  constructor(private readonly plumbersService: PlumbersService) {}

  // POST /plumbers — inscription (public)
  @Post()
  async create(@Body() dto: CreatePlumberDto) {
    return this.plumbersService.create(dto);
  }

  // GET /plumbers — annuaire (public)
  @Get()
  async findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.plumbersService.findAll(
      parseInt(skip ?? '0', 10),
      parseInt(take ?? '100', 10),
    );
  }

  // GET /plumbers/:id — détail plombier (public)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plumbersService.findOne(id);
  }

  // PATCH /plumbers/:id — mise à jour profil (authentifié)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlumberDto,
    @Request() req: any,
  ) {
    if (req.user.sub !== id) throw new ForbiddenException('Accès non autorisé');
    return this.plumbersService.update(id, dto);
  }

  // PATCH /plumbers/:id/password — changement mot de passe (authentifié)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
    @Request() req: any,
  ) {
    if (req.user.sub !== id) throw new ForbiddenException('Accès non autorisé');
    return this.plumbersService.changePassword(
      id,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
