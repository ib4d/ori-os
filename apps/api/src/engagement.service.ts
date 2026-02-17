
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@ori-os/db/nestjs';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { EmailService } from './email.service';

@Injectable()
export class EngagementService implements OnModuleInit {
    constructor(
        private readonly prisma: PrismaService,
        private readonly email: EmailService
    ) { }

    async onModuleInit() {
        console.log('[CAMPAIGN] Initializing Execution Engine...');
        // Run every 10 seconds for dev/demo purposes, in production this would be a CRON job or BullMQ worker
        setInterval(() => {
            this.processRunningCampaigns().catch(err => console.error('[CAMPAIGN] Execution Error:', err));
        }, 10000);
    }


    async createCampaign(orgId: string, userId: string, dto: CreateCampaignDto) {
        const { sequenceSteps, ...campaignData } = dto;

        return (this.prisma as any).campaign.create({
            data: {
                ...campaignData,
                organizationId: orgId,
                createdBy: userId,
                sequenceSteps: sequenceSteps ? {
                    create: sequenceSteps.map(step => ({
                        ...step,
                    }))
                } : undefined
            },
            include: { sequenceSteps: true }
        });
    }

    async findAll(orgId: string) {
        return (this.prisma as any).campaign.findMany({
            where: { organizationId: orgId },
            include: { sequenceSteps: true, _count: { select: { recipients: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(orgId: string, id: string) {
        const campaign = await (this.prisma as any).campaign.findFirst({
            where: { id, organizationId: orgId },
            include: { sequenceSteps: true, recipients: { include: { contact: true } } }
        });

        if (!campaign) throw new NotFoundException('Campaign not found');
        return campaign;
    }

    async updateCampaign(orgId: string, id: string, dto: UpdateCampaignDto) {
        const { sequenceSteps, ...campaignData } = dto;

        // For simplicity in MVP, we'll replace steps if provided or just update metadata
        // In a real app, we might want more granular sync of steps

        await (this.prisma as any).campaign.update({
            where: { id },
            data: {
                ...campaignData,
                sequenceSteps: sequenceSteps ? {
                    deleteMany: {},
                    create: sequenceSteps.map(step => ({
                        ...step,
                    }))
                } : undefined
            }
        });

        return this.findOne(orgId, id);
    }

    async deleteCampaign(orgId: string, id: string) {
        return (this.prisma as any).campaign.delete({
            where: { id, organizationId: orgId }
        });
    }

    async addRecipients(orgId: string, campaignId: string, contactIds: string[]) {
        return (this.prisma as any).campaignRecipient.createMany({
            data: contactIds.map(contactId => ({
                campaignId,
                contactId,
            })),
            skipDuplicates: true
        });
    }

    // --- Execution Engine ---

    async processRunningCampaigns() {
        const campaigns = await (this.prisma as any).campaign.findMany({
            where: { status: 'RUNNING' },
            include: { sequenceSteps: { orderBy: { order: 'asc' } } }
        });

        for (const campaign of campaigns) {
            const recipients = await (this.prisma as any).campaignRecipient.findMany({
                where: {
                    campaignId: campaign.id,
                    status: { in: ['PENDING', 'SCHEDULED'] }
                },
                include: { contact: true }
            });

            for (const recipient of recipients) {
                await this.processRecipient(campaign, recipient);
            }
        }
    }

    private async processRecipient(campaign: any, recipient: any) {
        const steps = campaign.sequenceSteps;
        const currentStepIndex = recipient.lastStepOrder; // 0-indexed or 1-indexed? Let's assume 0 is "not started"

        const nextStep = steps.find(s => s.order > currentStepIndex);
        if (!nextStep) {
            await (this.prisma as any).campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: 'COMPLETED' }
            });
            return;
        }

        if (nextStep.stepType === 'WAIT') {
            const config = nextStep.configJson as any;
            const waitHours = config.hours || 0;
            const waitDays = config.days || 0;
            const totalWaitMs = (waitHours * 3600 + waitDays * 86400) * 1000;

            const lastEvent = recipient.lastEventAt || recipient.createdAt;
            if (Date.now() - new Date(lastEvent).getTime() < totalWaitMs) {
                return; // Still waiting
            }

            // Move to next step after wait
            await (this.prisma as any).campaignRecipient.update({
                where: { id: recipient.id },
                data: { lastStepOrder: nextStep.order, lastEventAt: new Date() }
            });
            // Recurse to process the step following the wait
            const updatedRecipient = { ...recipient, lastStepOrder: nextStep.order, lastEventAt: new Date() };
            return this.processRecipient(campaign, updatedRecipient);
        }

        if (nextStep.stepType === 'EMAIL') {
            console.log(`[CAMPAIGN] Sending email to ${recipient.contact.email} for step ${nextStep.order}`);

            // Actually call the email service
            await this.email.sendSequenceEmail(recipient.contact.email, campaign.name, "Sequence email content...");

            await (this.prisma as any).campaignRecipient.update({
                where: { id: recipient.id },
                data: {
                    status: 'SENT',
                    lastStepOrder: nextStep.order,
                    lastEventAt: new Date()
                }
            });
        }
    }
}
