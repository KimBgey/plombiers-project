import {
  Body, Controller, Get, Post, Param,
  ParseIntPipe, UseGuards, Query,
} from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { AuthGuard } from '@nestjs/passport'
import { IsInt, IsPositive } from 'class-validator'

class CreatePaymentDto {
  @IsInt() @IsPositive() plumberId: number
  @IsPositive() amount: number
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // GET /payments — liste tous les paiements (admin)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('plumberId') plumberId?: string) {
    return this.paymentsService.findAll(plumberId ? parseInt(plumberId) : undefined)
  }

  // POST /payments — enregistrer un paiement (admin)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto.plumberId, dto.amount)
  }

  // GET /payments/stats — stats globales (admin)
  @UseGuards(AuthGuard('jwt'))
  @Get('stats')
  async getStats() {
    return this.paymentsService.getStats()
  }
}