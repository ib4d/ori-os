
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { IntelligenceService } from './intelligence.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SubscriptionGuard } from './billing/subscription.guard';
import { CreateIcpProfileDto, UpdateIcpProfileDto } from './dto/icp-profile.dto';

@Controller('intelligence')
@UseGuards(JwtAuthGuard)
export class IntelligenceController {
    constructor(private readonly service: IntelligenceService) { }

    // --- ICP Profiles ---

    @Post('icp')
    async createIcp(@Request() req, @Body() dto: CreateIcpProfileDto) {
        const orgId = req.user.organizationId || 'default-org-id';
        return this.service.createIcpProfile(orgId, dto);
    }

    @Get('icp')
    async getIcps(@Request() req) {
        const orgId = req.user.organizationId || 'default-org-id';
        return this.service.getIcpProfiles(orgId);
    }

    @Put('icp/:id')
    async updateIcp(@Param('id') id: string, @Body() dto: UpdateIcpProfileDto) {
        return this.service.updateIcpProfile(id, dto);
    }

    @Delete('icp/:id')
    async deleteIcp(@Param('id') id: string) {
        return this.service.deleteIcpProfile(id);
    }

    // --- Enrichment (PRO Feature) ---

    @Post('enrich/company')
    @UseGuards(SubscriptionGuard)
    async enrichCompany(@Request() req, @Body() body: { domain: string, companyId?: string }) {
        const orgId = req.user.organizationId || 'default-org-id';
        const result = await this.service.enrichCompany(body.domain);

        if (body.companyId) {
            await this.service.createEnrichmentJob(orgId, 'COMPANY', body.companyId);
        }

        return result;
    }

    @Get('enrich/jobs')
    async getJobs(@Request() req) {
        const orgId = req.user.organizationId || 'default-org-id';
        return this.service.getEnrichmentJobs(orgId);
    }
}
