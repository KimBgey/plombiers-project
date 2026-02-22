import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const plumber = await this.prisma.plumber.findUnique({ where: { email } });

    if (!plumber)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const isPasswordValid = await bcrypt.compare(password, plumber.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    // Le rôle est inclus dans le payload JWT
    const payload = {
      sub: plumber.id,
      email: plumber.email,
      role: plumber.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      plumber: {
        id: plumber.id,
        name: plumber.name,
        email: plumber.email,
        city: plumber.city,
        phone: plumber.phone,
        verified: plumber.verified,
        role: plumber.role,
      },
    };
  }

  async me(plumberId: number) {
    const plumber = await this.prisma.plumber.findUnique({
      where: { id: plumberId },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        phone: true,
        verified: true,
        role: true,
        createdAt: true,
      },
    });

    if (!plumber) throw new UnauthorizedException('Utilisateur introuvable');
    return plumber;
  }
}
