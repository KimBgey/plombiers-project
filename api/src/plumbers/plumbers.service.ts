import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class PlumbersService {
  constructor(private prisma: PrismaService) {}

  // Inscription
  async create(data: {
    name: string
    email: string
    phone: string
    city: string
    password: string
    verified?: boolean
  }) {
    const existing = await this.prisma.plumber.findUnique({ where: { email: data.email } })
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return this.prisma.plumber.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        password: hashedPassword,
        verified: data.verified ?? false,
      },
      select: {
        id: true, name: true, email: true,
        phone: true, city: true, verified: true, createdAt: true,
      },
    })
  }

  // Annuaire
  async findAll(skip = 0, take = 100) {
    return this.prisma.plumber.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true,
        phone: true, city: true, verified: true, createdAt: true,
      },
    })
  }

  // Mise à jour profil
  async update(id: number, data: { name?: string; phone?: string; city?: string }) {
    const plumber = await this.prisma.plumber.findUnique({ where: { id } })
    if (!plumber) throw new NotFoundException('Plombier introuvable')

    return this.prisma.plumber.update({
      where: { id },
      data,
      select: {
        id: true, name: true, email: true,
        phone: true, city: true, verified: true, createdAt: true,
      },
    })
  }

  // Changement de mot de passe
  async changePassword(id: number, currentPassword: string, newPassword: string) {
    const plumber = await this.prisma.plumber.findUnique({ where: { id } })
    if (!plumber) throw new NotFoundException('Plombier introuvable')

    const isValid = await bcrypt.compare(currentPassword, plumber.password)
    if (!isValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect')
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await this.prisma.plumber.update({
      where: { id },
      data: { password: hashed },
    })

    return { message: 'Mot de passe mis à jour avec succès' }
  }

    // Détail d'un plombier
  async findOne(id: number) {
    const plumber = await this.prisma.plumber.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true,
        phone: true, city: true, verified: true, createdAt: true,
      },
    })
    if (!plumber) throw new NotFoundException('Plombier introuvable')
    return plumber
  }
}