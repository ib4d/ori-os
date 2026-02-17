
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '@ori-os/db/nestjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('crm/deals')
@UseGuards(JwtAuthGuard)
export class DealsController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    async findAll(@Request() req) {
        const orgId = req.user.organizationId || 'default-org-id';
        return (this.prisma as any).deal.findMany({
            where: { organizationId: orgId },
            include: { company: true, contact: true, stage: true },
        });
    }

    @Post()
    async create(@Request() req, @Body() data: any) {
        const orgId = req.user.organizationId || 'default-org-id';
        const { companyId, contactId, pipelineId, stageId, name, valueAmount, valueCurrency } = data;

        const deal = await (this.prisma as any).deal.create({
            data: {
                name,
                valueAmount: valueAmount || 0,
                valueCurrency: valueCurrency || 'USD',
                status: 'open',
                organizationId: orgId,
                companyId,
                contactId,
                pipelineId,
                stageId,
            },
        });

        // Log Activity
        await (this.prisma as any).activity.create({
            data: {
                type: 'NOTE',
                organizationId: orgId,
                subject: 'New Deal Created',
                body: `Deal "${deal.name}" worth ${deal.valueCurrency} ${deal.valueAmount} was added to the pipeline.`,
                dealId: deal.id,
                companyId,
                contactId,
            },
        }).catch(err => console.error('Activity creation failed', err));

        return deal;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return (this.prisma as any).deal.findUnique({
            where: { id },
            include: { company: true, contact: true, stage: true, pipeline: true },
        });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return (this.prisma as any).deal.update({
            where: { id },
            data,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return (this.prisma as any).deal.delete({
            where: { id },
        });
    }
}
