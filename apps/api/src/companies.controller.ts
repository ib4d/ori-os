
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '@ori-os/db/nestjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('crm/companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    async findAll(@Request() req) {
        const orgId = req.user.organizationId || 'default-org-id';
        return (this.prisma as any).company.findMany({
            where: { organizationId: orgId },
            include: { contacts: true },
            take: 10, // Limit to 10 companies
            orderBy: { createdAt: 'desc' },
        });
    }

    @Post()
    async create(@Request() req, @Body() data: any) {
        const orgId = req.user.organizationId || 'default-org-id';
        return (this.prisma as any).company.create({
            data: {
                ...data,
                organizationId: orgId,
            },
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return (this.prisma as any).company.findUnique({
            where: { id },
            include: { contacts: true },
        });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return (this.prisma as any).company.update({
            where: { id },
            data,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return (this.prisma as any).company.delete({
            where: { id },
        });
    }
}
