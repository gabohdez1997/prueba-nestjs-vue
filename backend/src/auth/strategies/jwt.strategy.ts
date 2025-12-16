import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../models/user.model';
import { jwtConstants } from '../constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new UnauthorizedException('JWT_SECRET no esta configurado en el entorno.');
        }



        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        return { userId: payload.userId, username: payload.username};
    }
}
