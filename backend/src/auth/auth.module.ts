
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { jwtConstants } from "./constants";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ConfigModule, ConfigService } from '@nestjs/config';




@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (ConfigService: ConfigService) => ({
                secret: ConfigService.get<string>('JWT_SECRET') || 'FALLBACK_SECRET',
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
    ],

    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtModule],
})


export class AuthModule {}





