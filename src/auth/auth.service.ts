import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleId: string, email: string, name: string) {
  let user = await this.prisma.user.findFirst({
    where: {
      OR: [
        { googleId },
        { email },
      ],
    },
  });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email,
        googleId,
        name,
        password: null, 
      },
    });
  } else if (!user.googleId) {
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: { googleId, name },
    });
  }

  return {
    access_token: this.jwtService.sign({ sub: user.id }),
    user,
  };
}
}