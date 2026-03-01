'use client';

import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Badge,
    Progress,
} from '@ori-os/ui';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Building2,
    DollarSign,
    Mail,
    ArrowRight,
    Sparkles,
    BarChart3,
    Target,
    Clock,
    Beaker,
} from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { useMemo } from 'react';
import Link from 'next/link';
import { DashboardStats } from '@/components/dashboard-stats';

export default function DashboardPage() {
    const { data: dashboardData, isLoading, error } = useDashboard();
    const activities = dashboardData?.recentActivity || [];

    if (error) {
        return (
            <div className="p-6 bg-destructive/10 text-destructive text-sm rounded-none border border-destructive/20 flex flex-col items-center gap-4">
                <p>Failed to load dashboard: {error}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

            <DashboardStats loading={isLoading} data={dashboardData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Activity Feed</CardTitle>
                            <CardDescription>Latest updates from your workspace</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild><Link href="/dashboard/activity">View all<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-start gap-4 p-3 animate-pulse">
                                        <div className="h-10 w-10 bg-muted rounded" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/3 bg-muted rounded" />
                                            <div className="h-3 w-1/2 bg-muted rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                activities.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-start gap-4 p-3 rounded-none hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="p-2 rounded-none bg-tangerine/10">
                                            <div className="h-4 w-4 text-tangerine transition-transform duration-300 group-hover:-translate-y-0.5">
                                                {activity.type === 'contact' ? <Users className="h-4 w-4" /> : activity.type === 'deal' ? <Target className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground">{activity.title}</p>
                                            <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time.split('T')[0]}</span>
                                    </motion.div>
                                ))
                            )}
                            {!isLoading && activities.length === 0 && (
                                <p className="text-muted-foreground text-sm py-4 text-center border border-dashed p-4">
                                    No recent activity.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Module Summaries */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Module Overviews</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium">CRM</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {isLoading ? '...' : `${dashboardData?.deals.total} active deals`}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-tangerine" />
                                    <span className="text-sm font-medium">Engagement</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold">{isLoading ? '...' : `${dashboardData?.campaigns.active} running`}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">
                                        {isLoading ? '...' : dashboardData?.campaigns.lastSendDate ? `Last send: ${dashboardData.campaigns.lastSendDate.split('T')[0]}` : 'No sends yet'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm font-medium">Automation</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold">{isLoading ? '...' : `${dashboardData?.workflows.runs} total runs`}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">
                                        {isLoading ? '...' : dashboardData?.workflows.lastRunDate ? `Last run: ${dashboardData.workflows.lastRunDate.split('T')[0]}` : 'No runs yet'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Target className="h-4 w-4 text-success" />
                                    <span className="text-sm font-medium">SEO</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {isLoading ? '...' : `${dashboardData?.seo.projects} projects`}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-medium">Compliance</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {isLoading ? '...' : `${dashboardData?.compliance.gdprRequests} GDPR requests`}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-tangerine/5 border-tangerine/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 text-tangerine mb-2">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-sm font-bold uppercase tracking-wider">AI Insight</span>
                            </div>
                            <p className="text-sm text-foreground">
                                Your deal pipeline is 23% larger than last month.
                                Consider enlisting 4 more companies for enrichment to maintain momentum.
                            </p>
                            <Button size="sm" className="w-full mt-4 bg-tangerine hover:bg-tangerine/90 text-white border-none shadow-lg shadow-tangerine/20" asChild>
                                <Link href="/dashboard/intelligence">Enrich Now</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}
