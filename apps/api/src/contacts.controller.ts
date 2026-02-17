
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '@ori-os/db/nestjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('crm/contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    async findAll(@Request() req) {
        const orgId = req.user.organizationId || 'default-org-id';
        return (this.prisma as any).contact.findMany({
            where: { organizationId: orgId },
            include: { company: true },
            take: 50, // Limit to 50 contacts
            orderBy: { createdAt: 'desc' },
        });
    }

    @Post()
    async create(@Request() req, @Body() data: any) {
        const orgId = req.user.organizationId || 'default-org-id';
        const contact = await (this.prisma as any).contact.create({
            data: {
                ...data,
                organizationId: orgId,
            },
        });

        // Log activity
        try {
            await (this.prisma as any).activity.create({
                data: {
                    type: 'NOTE',
                    organizationId: orgId,
                    subject: 'New contact created',
                    body: `${data.firstName} ${data.lastName} was added to CRM`,
                    contactId: contact.id,
                }
            });
        } catch (e) {
            console.error('Failed to log activity:', e);
        }

        return contact;
    }

    @Get(':id')
    async findOne(@Request() req, @Param('id') id: string) {
        const orgId = req.user.organizationId || 'default-org-id';
        return (this.prisma as any).contact.findUnique({
            where: {
                organizationId_email: { // Assuming common lookup or ID
                    organizationId: orgId,
                    email: id // This might be email or ID, in schema the unique is orgId+email
                }
            },
            include: { company: true },
        });
    }

    @Put(':id')
    async update(@Request() req, @Param('id') id: string, @Body() data: any) {
        const orgId = req.user.organizationId || 'default-org-id';
        return (this.prisma as any).contact.update({
            where: { id },
            data,
        });
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string) {
        return (this.prisma as any).contact.delete({
            where: { id },
        });
    }
}
