import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = `askd123das.${dto.password}.kamcdij921`;

    try {
      const email = await this.db.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (email) {
        throw new ForbiddenException('credentials taken');
      }

      const user = await this.db.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      return error.response;
    }
  }

  async signin(dto: AuthDto) {
    try {
      const user = await this.db.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('wrong credentials');
      }

      console.log(null && false);

      const hash = user.hash.split('.')[1];

      const password = dto.password;

      const match = hash === password;

      if (!match) {
        throw new ForbiddenException('wrong credentials');
      }
      return this.signToken(user.id, user.email);
    } catch (error) {
      return error.response;
    }
  }

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
