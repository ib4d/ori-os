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
import { useCompanies } from '@/hooks/use-companies';
import { useContacts } from '@/hooks/use-contacts';
import { useDeals } from '@/hooks/use-deals';
import { useActivity } from '@/hooks/use-activity';
import { useMemo } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const { companies } = useCompanies();
    const { contacts } = useContacts();
    const { deals } = useDeals();
    const { activities } = useActivity();

    const stats = useMemo(() => {
        const totalValue = deals.reduce((sum, d) => sum + (typeof d.value === 'number' ? d.value : 0), 0);
        return [
            { title: 'Total Contacts', value: contacts.length.toLocaleString(), change: '+12.5%', trend: 'up', icon: Users },
            { title: 'Companies', value: companies.length.toLocaleString(), change: '+8.2%', trend: 'up', icon: Building2 },
            { title: 'Active Deals', value: `$${(totalValue / 1000).toFixed(1)}k`, change: '+23.1%', trend: 'up', icon: DollarSign },
            { title: 'Emails Sent', value: ((contacts.length * 14) + 128).toLocaleString(), change: '+4.5%', trend: 'up', icon: Mail },
        ];
    }, [companies, contacts, deals]);

    const topDeals = useMemo(() => {
        return [...deals]
            .sort((a, b) => (typeof b.value === 'number' ? b.value : 0) - (typeof a.value === 'number' ? a.value : 0))
            .slice(0, 3);
    }, [deals]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild className="hidden sm:flex border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10">
                        <Link href="/dashboard/test-bench">
                            <Beaker className="mr-2 h-4 w-4" />
                            Test Bench
                        </Link>
                    </Button>
                    <Button variant="outline" asChild><Link href="/dashboard/analytics"><BarChart3 className="mr-2 h-4 w-4" />Reports</Link></Button>
                    <Button variant="accent" asChild><Link href="/dashboard/intelligence"><Sparkles className="mr-2 h-4 w-4" />Quick Enrich</Link></Button>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                                    </div>
                                    <div className="p-2 rounded-sm bg-muted"><stat.icon className="h-5 w-5 text-muted-foreground" /></div>
                                </div>
                                <div className="flex items-center gap-1 mt-4">
                                    {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                                    <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>{stat.change}</span>
                                    <span className="text-muted-foreground text-sm">vs last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

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
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-3 rounded-sm hover:bg-muted/50 transition-colors"
                                >
                                    <div className="p-2 rounded-sm bg-tangerine/10">
                                        <div className="h-4 w-4 text-tangerine">
                                            {activity.type === 'lead' ? <Users className="h-4 w-4" /> : activity.type === 'deal' ? <Target className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top deals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Deals</CardTitle>
                        <CardDescription>Your highest value opportunities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topDeals.map((deal, index) => (
                                <motion.div
                                    key={deal.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{deal.name}</p>
                                            <p className="text-xs text-muted-foreground">{deal.stage}</p>
                                        </div>
                                        <Badge variant="secondary">${(deal.value as number).toLocaleString()}</Badge>
                                    </div>
                                    <Progress value={deal.probability} className="h-2" />
                                </motion.div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6" asChild><Link href="/dashboard/crm/deals">View all deals<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
