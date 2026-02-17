
'use client';

import React, { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
    Badge,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@ori-os/ui';
import { Plus, Mail, Play, Pause, BarChart3, Users, MoreVertical, Edit, Copy, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

const INITIAL_CAMPAIGNS = [
    { id: '1', name: 'SaaS Founders Q1', status: 'RUNNING', recipients: 142, sent: 85, replies: 12, openRate: '68%' },
    { id: '2', name: 'DTC Brands Outreach', status: 'PAUSED', recipients: 250, sent: 120, replies: 5, openRate: '45%' },
    { id: '3', name: 'Product Update Nurture', status: 'DRAFT', recipients: 0, sent: 0, replies: 0, openRate: '0%' },
];

export default function EngagementDashboard() {
    const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);

    const toggleStatus = (id: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id === id) {
                const newStatus = c.status === 'RUNNING' ? 'PAUSED' : 'RUNNING';
                return { ...c, status: newStatus };
            }
            return c;
        }));
    };

    const deleteCampaign = (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };
    return (
        <div className="container py-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Engagement & Campaigns</h1>
                    <p className="text-muted-foreground">Manage your outreach sequences and monitor performance.</p>
                </div>
                <Link href="/dashboard/engagement/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Campaign
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Active Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">+1 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">54.2%</div>
                        <p className="text-xs text-green-500">+2.4% vs industry avg</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">In the last 7 days</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Campaigns</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4">
                        {campaigns.map((campaign) => (
                            <Card key={campaign.id} className="relative overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg flex items-center">
                                                <Mail className="mr-2 h-4 w-4 text-primary" />
                                                {campaign.name}
                                            </CardTitle>
                                            <CardDescription>Created Jan 12, 2026</CardDescription>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant={campaign.status === 'RUNNING' ? 'default' : 'secondary'}>
                                                {campaign.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/engagement/campaigns/${campaign.id}`} className="flex items-center">
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Campaign
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => deleteCampaign(campaign.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Recipients</p>
                                            <p className="text-sm font-semibold">{campaign.recipients}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Sent</p>
                                            <p className="text-sm font-semibold">{campaign.sent}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Replies</p>
                                            <p className="text-sm font-semibold">{campaign.replies}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Open Rate</p>
                                            <p className="text-sm font-semibold">{campaign.openRate}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 pt-3 border-t flex justify-between">
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">
                                            <BarChart3 className="mr-2 h-3 w-3" /> Analytics
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">
                                            <Users className="mr-2 h-3 w-3" /> People
                                        </Button>
                                    </div>
                                    <div className="flex space-x-2">
                                        {campaign.status === 'PAUSED' ? (
                                            <Button size="sm" className="h-8 text-xs" onClick={() => toggleStatus(campaign.id)}>
                                                <Play className="mr-2 h-3 w-3" /> Resume
                                            </Button>
                                        ) : campaign.status === 'RUNNING' ? (
                                            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toggleStatus(campaign.id)}>
                                                <Pause className="mr-2 h-3 w-3" /> Pause
                                            </Button>
                                        ) : (
                                            <Link href={`/dashboard/engagement/campaigns/${campaign.id}/schedule`}>
                                                <Button size="sm" className="h-8 text-xs">
                                                    Edit & Schedule
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
