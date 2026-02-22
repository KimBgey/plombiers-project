import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeme',
    })
  }

  async validate(payload: { sub: number; email: string }) {
    const plumber = await this.prisma.plumber.findUnique({
      where: { id: payload.sub },
    })

    if (!plumber) throw new UnauthorizedException()

    // On injecte le rôle dans req.user
    return { sub: payload.sub, email: payload.email, role: plumber.role }
  }
}