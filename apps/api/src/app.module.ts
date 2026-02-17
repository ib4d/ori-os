import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '@ori-os/db/nestjs';
import { ConnectorsModule } from './connectors/connectors.module';
import { MediaModule } from './media/media.module';
import { AIModule } from './ai/ai.module';
import { DeliverabilityModule } from './deliverability/deliverability.module';
import { BillingModule } from './billing/billing.module';
import { UsageLimitMiddleware } from './billing/usage-limit.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsController } from './contacts.controller';
import { CompaniesController } from './companies.controller';
import { AnalyticsModule } from './analytics/analytics.module';
import { IntelligenceController } from './intelligence.controller';
import { IntelligenceService } from './intelligence.service';
import { DealsController } from './deals.controller';
import { NotificationsModule } from './notifications.module';
import { AiService } from './ai.service';
import { EmailService } from './email.service';
import { CampaignsController } from './engagement.controller';
import { InboxController } from './engagement.controller';
import { EngagementService } from './engagement.service';
import { TemplatesController } from './templates.controller';
import { AutomationsController } from './automations.controller';
import { ActivitiesController } from './activities.controller';
import { TestBenchController } from './test-bench.controller';
import { UnsubscribeController } from './unsubscribe.controller';
import { SeoModule } from './seo/seo.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AnalyticsModule,
    DeliverabilityModule,
    BillingModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    SeoModule,
    NotificationsModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests per minute
    }]),
    CommonModule,
    ConnectorsModule,
    MediaModule,
    AIModule,
  ],
  controllers: [
    AppController,
    ContactsController,
    CompaniesController,
    IntelligenceController,
    DealsController,
    CampaignsController,
    InboxController,
    TemplatesController,
    AutomationsController,
    ActivitiesController,
    TestBenchController,
    UnsubscribeController,
  ],
  providers: [
    AppService,
    IntelligenceService,
    AiService,
    EmailService,
    EngagementService,
    UsageLimitMiddleware
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsageLimitMiddleware)
      .forRoutes('engagement/campaigns');
  }
}
