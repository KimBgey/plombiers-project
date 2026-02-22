import {
  Controller, Get, Patch, Param,
  ParseIntPipe, UseGuards, Body, Post,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard, Roles } from '../common/roles.guard'
import { IsNumber, IsPositive } from 'class-validator'

class AddPaymentDto {
  @IsNumber() @IsPositive() amount: number
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats()
  }

  @Get('plumbers')
  async getPlumbers() {
    return this.adminService.getPlumbers()
  }

  @Patch('plumbers/:id/verify')
  async verify(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.setVerified(id, true)
  }

  @Patch('plumbers/:id/unverify')
  async unverify(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.setVerified(id, false)
  }

  // Promouvoir un plombier en admin
  @Patch('plumbers/:id/promote')
  async promote(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.setRole(id, 'ADMIN')
  }

  // Rétrograder un admin en plombier
  @Patch('plumbers/:id/demote')
  async demote(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.setRole(id, 'PLUMBER')
  }

  @Post('plumbers/:id/payment')
  async addPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddPaymentDto,
  ) {
    return this.adminService.addPayment(id, dto.amount)
  }
}