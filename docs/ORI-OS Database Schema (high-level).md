# ORI-OS Database Schema (High-Level)

> [!NOTE]
> **Status: IMPLEMENTED**
> The physical schema is defined in [schema.prisma](file:///c:/dev/ORI-OS2.0/packages/db/prisma/schema.prisma). This document serves as the high-level logical map.

Below is the finalized schema implemented in Prisma. Field names follow **camelCase** for the application layer and map to **snake_case** in the PostgreSQL database.

## Core Multi-Tenant & Auth

* **organizations**
    * `id`, `name`, `slug`, `complianceProfile`, `createdAt`, `updatedAt`
* **users**
    * `id`, `email`, `passwordHash`, `name`, `avatarUrl`, `createdAt`, `lastLoginAt`
* **organization_memberships**
    * `id`, `organizationId`, `userId`, `role` (OWNER, ADMIN, MANAGER, OPERATOR, VIEWER)
* **sessions**
    * `id`, `userId`, `organizationId`, `refreshToken`, `ip`, `userAgent`, `expiresAt`
* **two_factor_settings**
    * `id`, `userId`, `secret`, `enabled`, `backupCodesJson`

## Domains, Mailboxes, Deliverability

* **domains**
    * `id`, `organizationId`, `domain`, `spfStatus`, `dkimStatus`, `dmarcStatus`, `lastAuditScore`, `lastAuditSource`, `blacklistsJson`, `reputationStatus`
* **mailboxes**
    * `id`, `organizationId`, `domainId`, `email`, `provider` (GMAIL, O365, SMTP, SES, OTHER), `dailyLimit`, `hourlyLimit`, `warmupStatus`, `is_active`
* **warmup_plans**
    * `id`, `mailboxId`, `scheduleJson`, `status`
* **warmup_jobs**
    * `id`, `warmupPlanId`, `runAt`, `status`, `errorMessage`
* **deliverability_audits**
    * `id`, `domainId`, `score`, `source`, `detailsJson`

## CRM (Companies, Contacts, Deals)

* **companies**
    * `id`, `organizationId`, `name`, `website`, `domain`, `industry`, `sizeBand`, `country`, `city`, `linkedinUrl`, `customFieldsJson`
* **contacts**
    * `id`, `organizationId`, `companyId`, `firstName`, `lastName`, `email`, `phone`, `jobTitle`, `linkedinUrl`, `country`, `gdprRegion`, `lawfulBasis`, `consentSource`, `consentTimestamp`, `optOut`, `emailStatus`
* **deals**
    * `id`, `organizationId`, `companyId`, `contactId`, `name`, `pipelineId`, `stageId`, `valueCurrency`, `valueAmount`, `status`, `closeDate`
* **pipelines**
    * `id`, `organizationId`, `name`
* **pipeline_stages**
    * `id`, `pipelineId`, `name`, `order`
* **activities**
    * `id`, `organizationId`, `type` (EMAIL, CALL, MEETING, NOTE, TASK), `userId`, `companyId`, `contactId`, `dealId`, `subject`, `body`, `metadataJson`
* **tasks**
    * `id`, `organizationId`, `title`, `description`, `assignedTo`, `dueDate`, `status`, `companyId`, `contactId`, `dealId`

## Segments & Lists

* **segments**
    * `id`, `organizationId`, `name`, `entityType` (CONTACT, COMPANY, DEAL), `filterJson`, `isDynamic`, `createdBy`
* **segment_members**
    * `id`, `segmentId`, `contactId`, `companyId`, `dealId`

## Campaigns & Outreach

* **campaigns**
    * `id`, `organizationId`, `name`, `status`, `objective`, `mailboxId`, `fromName`, `fromEmail`, `replyTo`, `sendWindowJson`
* **sequence_steps**
    * `id`, `campaignId`, `order`, `stepType` (EMAIL, WAIT, CONDITION), `configJson`, `templateId`
* **email_templates**
    * `id`, `organizationId`, `name`, `subject`, `bodyHtml`, `bodyText`, `language`, `category`
* **campaign_recipients**
    * `id`, `campaignId`, `contactId`, `status` (PENDING, SCHEDULED, SENT, BOUNCED, REPLIED, OPTED_OUT), `lastStepOrder`, `lastEventAt`
* **email_events**
    * `id`, `campaignId`, `contactId`, `mailboxId`, `providerMessageId`, `eventType` (SENT, DELIVERED, OPENED, CLICKED, BOUNCED, SPAM_COMPLAINT, REPLY), `rawPayloadJson`

## Automation Studio

* **workflows**
    * `id`, `organizationId`, `name`, `description`, `status`, `triggerType`, `definitionJson`, `createdBy`
* **workflow_runs**
    * `id`, `workflowId`, `organizationId`, `status`, `startedAt`, `finishedAt`, `contextJson`
* **workflow_run_steps**
    * `id`, `workflowRunId`, `nodeId`, `status`, `startedAt`, `finishedAt`, `outputJson`, `errorMessage`

## Intelligence & Enrichment

* **icp_profiles**
    * `id`, `organizationId`, `name`, `criteriaJson`, `blacklistPersonasJson`, `regionsJson`
* **enrichment_jobs**
    * `id`, `organizationId`, `targetType` (COMPANY, CONTACT), `targetId`, `provider`, `status`, `resultJson`, `errorMessage`
* **company_scores**
    * `id`, `companyId`, `score`, `breakdownJson`

## Compliance & Audit

* **gdpr_requests**
    * `id`, `organizationId`, `contactId`, `type` (EXPORT, DELETE), `status`, `createdAt`, `processedAt`
* **suppression_list_entries**
    * `id`, `organizationId`, `value`, `reason`
* **audit_logs**
    * `id`, `organizationId`, `userId`, `action`, `entityType`, `entityId`, `metadataJson`

## Connectors

* **integrations**
    * `id`, `organizationId`, `type`, `status`, `settingsJson`
* **integration_tokens**
    * `id`, `integrationId`, `encryptedAccessToken`, `encryptedRefreshToken`, `expiresAt`, `scopes`
