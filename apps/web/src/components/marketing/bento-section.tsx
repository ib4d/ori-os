'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@ori-os/ui';
import {
    Zap,
    Shield,
    Puzzle,
    Globe,
    Clock,
    Sparkles,
} from 'lucide-react';

const bentoItems = [
    {
        title: 'Lightning Fast',
        description: 'Built for speed with modern architecture. Sub-second response times across all operations.',
        icon: Zap,
        className: 'md:col-span-2 md:row-span-1',
        gradient: 'from-yellow-500/20 to-orange-500/20',
    },
    {
        title: 'Enterprise Security',
        description: 'SOC 2 compliant with end-to-end encryption, RBAC, and audit logs.',
        icon: Shield,
        className: 'md:col-span-1 md:row-span-2',
        gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
        title: 'Native Integrations',
        description: 'Connect your existing tools seamlessly.',
        icon: Puzzle,
        className: 'md:col-span-1 md:row-span-1',
        gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
        title: 'Global Scale',
        description: 'Deploy worldwide with edge locations for minimal latency.',
        icon: Globe,
        className: 'md:col-span-1 md:row-span-1',
        gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
        title: 'Real-Time Sync',
        description: 'All data syncs instantly across your entire organization. No delays, no conflicts.',
        icon: Clock,
        className: 'md:col-span-1 md:row-span-1',
        gradient: 'from-tangerine/20 to-red-500/20',
    },
    {
        title: 'AI-Powered',
        description: 'Smart suggestions, automated workflows, and intelligent insights powered by advanced AI.',
        icon: Sparkles,
        className: 'md:col-span-2 md:row-span-1',
        gradient: 'from-tangerine/20 to-yellow-500/20',
    },
];

export function BentoSection() {
    return (
        <section className="py-24 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Built for the <span className="gradient-text">modern era</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Enterprise-grade infrastructure with the simplicity of a consumer app
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {bentoItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={item.className}
                        >
                            <Card
                                variant="outline"
                                hover="lift"
                                className={`h-full overflow-hidden group bg-gradient-to-br ${item.gradient}`}
                            >
                                <CardContent className="p-6 h-full flex flex-col">
                                    <div className="w-10 h-10 rounded-sm bg-background/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <item.icon className="h-5 w-5 text-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground flex-1">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
