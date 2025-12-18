
import { AuthService } from './auth.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginResponse } from './models/user.model';

@Controller('auth') 
export class AuthController {
    constructor(private AuthService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: LoginDto) {
        return this.AuthService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() LoginDto: LoginDto): Promise<LoginResponse> {
        return this.AuthService.login(LoginDto);
    }


    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return {
            username: req.user.username,
            userId: req.user.userId,
        };
    }
}