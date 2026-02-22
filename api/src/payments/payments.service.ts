import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(plumberId?: number) {
    return this.prisma.payment.findMany({
      where: plumberId ? { plumberId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        plumber: {
          select: { id: true, name: true, city: true, email: true },
        },
      },
    })
  }

  async create(plumberId: number, amount: number) {
    const plumber = await this.prisma.plumber.findUnique({ where: { id: plumberId } })
    if (!plumber) throw new NotFoundException('Plombier introuvable')

    return this.prisma.payment.create({
      data: { plumberId, amount },
      include: {
        plumber: { select: { id: true, name: true, city: true } },
      },
    })
  }

  async getStats() {
    const [total, count, recent] = await Promise.all([
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
      this.prisma.payment.count(),
      this.prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          plumber: { select: { id: true, name: true, city: true } },
        },
      }),
    ])

    return {
      totalAmount: total._sum.amount ?? 0,
      totalPayments: count,
      recentPayments: recent,
    }
  }
}