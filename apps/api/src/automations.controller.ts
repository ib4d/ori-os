import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
    Request,
} from "@nestjs/common";
import { PrismaService } from "@ori-os/db/nestjs";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller("automations/workflows")
@UseGuards(JwtAuthGuard)
export class AutomationsController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    async findAll(@Request() req: any) {
        const orgId = req.user.organizationId || "default-org-id";
        return (this.prisma as any).workflow.findMany({
            where: { organizationId: orgId },
        });
    }

    @Post()
    async create(@Request() req: any, @Body() data: any) {
        const orgId = req.user.organizationId || "default-org-id";
        return (this.prisma as any).workflow.create({
            data: { ...data, organizationId: orgId },
        });
    }

    // IMPORTANT: static paths must come before ":id"
    @Get("runs")
    async getRuns(@Request() req: any) {
        const orgId = req.user.organizationId || "default-org-id";
        return (this.prisma as any).workflowRun.findMany({
            where: { organizationId: orgId },
            include: { workflow: true },
            orderBy: { startedAt: "desc" },
            take: 20,
        });
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return (this.prisma as any).workflow.findUnique({ where: { id } });
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() data: any) {
        return (this.prisma as any).workflow.update({ where: { id }, data });
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return (this.prisma as any).workflow.delete({ where: { id } });
    }

    @Post(":id/run")
    async run(@Request() req: any, @Param("id") id: string) {
        const orgId = req.user.organizationId || "default-org-id";

        const workflow = await (this.prisma as any).workflow.findUnique({
            where: { id },
        });
        if (!workflow) return { error: "Workflow not found" };

        const run = await (this.prisma as any).workflowRun.create({
            data: {
                workflowId: id,
                organizationId: orgId,
                status: "running",
            },
        });

        return { status: "started", runId: run.id };
    }
}
