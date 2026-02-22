import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from '@prisma/client'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalPlumbers, verifiedPlumbers, totalPayments, revenueAgg,
      citiesRaw, recentPlumbers, recentPayments,
    ] = await Promise.all([
      this.prisma.plumber.count(),
      this.prisma.plumber.count({ where: { verified: true } }),
      this.prisma.payment.count(),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
      this.prisma.plumber.groupBy({ by: ['city'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 5 }),
      this.prisma.plumber.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, city: true, verified: true, role: true, createdAt: true } }),
      this.prisma.payment.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { plumber: { select: { name: true, city: true } } } }),
    ])

    return {
      totalPlumbers,
      verifiedPlumbers,
      pendingPlumbers: totalPlumbers - verifiedPlumbers,
      totalPayments,
      totalRevenue: revenueAgg._sum.amount ?? 0,
      topCities: citiesRaw.map(c => ({ city: c.city, count: c._count.id })),
      recentPlumbers,
      recentPayments,
    }
  }

  async getPlumbers() {
    return this.prisma.plumber.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, phone: true,
        city: true, verified: true, role: true, createdAt: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { payments: true, reviews: true } },
      },
    })
  }

  async setVerified(id: number, verified: boolean) {
    const plumber = await this.prisma.plumber.findUnique({ where: { id } })
    if (!plumber) throw new NotFoundException('Plombier introuvable')
    return this.prisma.plumber.update({
      where: { id },
      data: { verified },
      select: { id: true, name: true, verified: true },
    })
  }

  async setRole(id: number, role: 'ADMIN' | 'PLUMBER') {
    const plumber = await this.prisma.plumber.findUnique({ where: { id } })
    if (!plumber) throw new NotFoundException('Plombier introuvable')
    return this.prisma.plumber.update({
      where: { id },
      data: { role: role as Role },
      select: { id: true, name: true, role: true },
    })
  }

  async addPayment(plumberId: number, amount: number) {
    const plumber = await this.prisma.plumber.findUnique({ where: { id: plumberId } })
    if (!plumber) throw new NotFoundException('Plombier introuvable')
    return this.prisma.payment.create({ data: { plumberId, amount } })
  }
}