
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        // SECURITY: Only allow bypass in development mode
        // In production, this will enforce strict JWT authentication
        if (process.env.NODE_ENV === 'development' && process.env.AUTH_BYPASS === 'true') {
            console.warn('⚠️  AUTH BYPASS ACTIVE - Development mode only');
            return user || { id: 'mock-user-id', userId: 'mock-user-id', email: 'admin@oricraftlabs.com', organizationId: 'mock-org-id' };
        }

        // Production: Strict authentication required
        if (err || !user) {
            throw err || new Error('Unauthorized');
        }

        return user;
    }
}

