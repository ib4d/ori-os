'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@ori-os/ui';
import {
    Search,
    Database,
    Bot,
    GitBranch,
    Mail,
    BarChart3,
    FileText,
} from 'lucide-react';

const features = [
    {
        icon: Search,
        title: 'Intelligence',
        description:
            'Discover and enrich leads with AI-powered research. Deep company analysis, tech stack detection, and hiring signals.',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
    {
        icon: Database,
        title: 'CRM',
        description:
            'Unified relationship hub with customizable pipelines, activity tracking, and segment management.',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
    },
    {
        icon: GitBranch,
        title: 'Automation',
        description:
            'Visual workflow builder for complex automations. Connect triggers, conditions, and actions seamlessly.',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    {
        icon: Mail,
        title: 'Engagement',
        description:
            'Multi-step sequences across email, SMS, and social. Unified inbox for all conversations.',
        color: 'text-tangerine',
        bgColor: 'bg-tangerine/10',
    },
    {
        icon: BarChart3,
        title: 'Analytics',
        description:
            'Event tracking, funnels, retention cohorts, and custom reports. PostHog-level insights built in.',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/10',
    },
    {
        icon: FileText,
        title: 'Content Studio',
        description:
            'AI-powered content generation for emails, newsletters, and social posts. Version control included.',
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/10',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export function FeaturesSection() {
    return (
        <section className="py-24 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Everything you need,{' '}
                        <span className="gradient-text">unified</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Replace your fragmented tech stack with one powerful platform.
                        No more switching between tools or syncing data manually.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div key={feature.title} variants={itemVariants}>
                            <Card
                                variant="glass"
                                hover="lift"
                                className="h-full group cursor-pointer"
                            >
                                <CardContent className="p-6">
                                    <div
                                        className={`w-12 h-12 rounded-sm ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-tangerine transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
