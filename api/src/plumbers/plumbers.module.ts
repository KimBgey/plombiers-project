// src/plumbers/plumbers.module.ts
import { Module } from '@nestjs/common'
import { PlumbersService } from './plumbers.service'
import { PlumbersController } from './plumbers.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [PlumbersController],
  providers: [PlumbersService],
})
export class PlumbersModule {}