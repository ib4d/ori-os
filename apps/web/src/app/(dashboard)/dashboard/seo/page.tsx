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
} from '@ori-os/ui';
import {
    TrendingUp,
    TrendingDown,
    Search,
    BarChart3,
    AlertTriangle,
    Link as LinkIcon,
    FileText,
    Settings,
    Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function SEOStudioPage() {
    // Mock data - will be replaced with actual API calls
    const stats = [
        { title: 'Projects', value: '3', change: '+1', trend: 'up', icon: FileText },
        { title: 'Tracked Keywords', value: '127', change: '+12', trend: 'up', icon: Search },
        { title: 'Avg. Position', value: '14.2', change: '-2.3', trend: 'up', icon: TrendingUp },
        { title: 'Critical Issues', value: '8', change: '+3', trend: 'down', icon: AlertTriangle },
    ];

    const projects = [
        {
            id: '1',
            name: 'Main Website',
            domain: 'example.com',
            keywords: 45,
            avgPosition: 12.5,
            issues: 3,
            lastCrawl: '2 hours ago',
            status: 'active',
        },
        {
            id: '2',
            name: 'Blog',
            domain: 'blog.example.com',
            keywords: 52,
            avgPosition: 18.3,
            issues: 5,
            lastCrawl: '1 day ago',
            status: 'active',
        },
        {
            id: '3',
            name: 'E-commerce',
            domain: 'shop.example.com',
            keywords: 30,
            avgPosition: 22.1,
            issues: 0,
            lastCrawl: '3 hours ago',
            status: 'active',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">SEO Studio</h1>
                    <p className="text-muted-foreground">Monitor and improve your search engine rankings</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/seo/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </Button>
                    <Button variant="accent" asChild>
                        <Link href="/dashboard/seo/projects/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </Link>
                    </Button>
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
                                    <div className="p-2 rounded-sm bg-muted">
                                        <stat.icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-4">
                                    {stat.trend === 'up' ? (
                                        <TrendingUp className="h-4 w-4 text-success" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-destructive" />
                                    )}
                                    <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                                        {stat.change}
                                    </span>
                                    <span className="text-muted-foreground text-sm">vs last week</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Projects list */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>SEO Projects</CardTitle>
                        <CardDescription>Manage and monitor your website SEO performance</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 rounded-sm border border-border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{project.domain}</p>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{project.keywords} keywords</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Avg. pos: {project.avgPosition}
                                            </span>
                                        </div>
                                        {project.issues > 0 && (
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                                <span className="text-orange-500">{project.issues} issues</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Last crawl: {project.lastCrawl}
                                    </span>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/dashboard/seo/projects/${project.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="h-5 w-5" />
                            Backlink Monitor
                        </CardTitle>
                        <CardDescription>Track your backlink profile and quality</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Monitor new and lost backlinks across all your projects
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/seo/backlinks">View Backlinks</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Keyword Research
                        </CardTitle>
                        <CardDescription>Discover new keyword opportunities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Find and track keywords with high potential for your niche
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/seo/keywords">Research Keywords</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
