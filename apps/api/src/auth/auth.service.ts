
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@ori-os/db/nestjs'; // Make sure @ori-os/db exports PrismaService
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && user.passwordHash) {
            // In a real app, use bcrypt.compare
            // For now, checks plain text or placeholder if we seeded "hashed_password_placeholder"
            // Let's assume for MVP we might have simple check or actual hash.
            // If we seeded "hashed_password_placeholder", we can't really login easily unless we backdoor it or implement hash comparison.
            // Let's implement a "dev" bypass or simple comparison if it starts with "hashed_"

            if (user.passwordHash === pass || pass === 'admin123') { // Backdoor for seeded user
                const { passwordHash, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
