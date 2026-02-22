import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(plumberId: number) {
    const plumber = await this.prisma.plumber.findUnique({ where: { id: plumberId } })
    if (!plumber) throw new NotFoundException('Plombier introuvable')

    const reviews = await this.prisma.review.findMany({
      where: { plumberId },
      orderBy: { createdAt: 'desc' },
    })

    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return {
      reviews,
      total: reviews.length,
      average: Math.round(avg * 10) / 10,
    }
  }

  async create(plumberId: number, authorId: number, rating: number, comment?: string) {
    const plumber = await this.prisma.plumber.findUnique({ where: { id: plumberId } })
    if (!plumber) throw new NotFoundException('Plombier introuvable')

    // Un plombier ne peut pas se noter lui-même
    if (plumberId === authorId) {
      throw new BadRequestException('Vous ne pouvez pas vous noter vous-même')
    }

    return this.prisma.review.create({
      data: { plumberId, rating, comment },
    })
  }
}