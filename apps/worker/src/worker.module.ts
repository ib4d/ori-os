
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@ori-os/db/nestjs';
import { EmailProcessor } from './processors/email.processor';
import { CampaignProcessor } from './processors/campaign.processor';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        }),
        BullModule.registerQueue(
            { name: 'email-queue' },
            { name: 'campaign-queue' }
        ),
    ],
    controllers: [],
    providers: [EmailProcessor, CampaignProcessor],
})
export class WorkerModule { }
