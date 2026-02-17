'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Badge } from '@ori-os/ui';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-gradient pt-16">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-tangerine/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-silver/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tangerine/5 rounded-full blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge
                            variant="glass"
                            rounded="full"
                            className="mb-6 px-4 py-1.5 text-sm font-medium inline-flex items-center gap-2"
                        >
                            <Sparkles className="h-4 w-4 text-tangerine" />
                            <span>AI-Powered Intelligence Platform</span>
                        </Badge>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
                    >
                        One input,{' '}
                        <span className="relative">
                            <span className="gradient-text">complete intelligence</span>
                            <svg
                                className="absolute -bottom-1 left-0 w-full"
                                height="8"
                                viewBox="0 0 200 8"
                                fill="none"
                            >
                                <path
                                    d="M1 5.5C47.6667 2.16667 152.4 -1.2 199 5.5"
                                    stroke="url(#paint0_linear)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="paint0_linear" x1="1" y1="4" x2="199" y2="4">
                                        <stop stopColor="#F77F00" />
                                        <stop offset="1" stopColor="#F77F00" stopOpacity="0.3" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
                    >
                        Consolidate Apollo.io, n8n, Attio, PostHog, and GoHighLevel into one unified platform.
                        Find → Enrich → Analyze → Strategize → Engage → Measure → Iterate.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button variant="accent" size="lg" className="w-full sm:w-auto group" asChild>
                            <Link href="/register">
                                Start Free Trial
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button variant="glass" size="lg" className="w-full sm:w-auto group" asChild>
                            <Link href="#demo">
                                <Play className="mr-2 h-4 w-4" />
                                Watch Demo
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16"
                    >
                        <p className="text-sm text-muted-foreground mb-4">
                            Trusted by forward-thinking teams
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
                            {['Acme Corp', 'TechStart', 'InnovateCo', 'GrowthLabs', 'ScaleUp'].map((company) => (
                                <div
                                    key={company}
                                    className="text-lg font-semibold text-muted-foreground/60"
                                >
                                    {company}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Hero Image/Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-20 relative"
                >
                    <div className="relative mx-auto max-w-5xl">
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-tangerine/20 via-tangerine/10 to-tangerine/20 rounded-lg blur-xl opacity-50" />

                        {/* Dashboard mockup */}
                        <div className="relative rounded-sm border border-border/50 bg-card/80 backdrop-blur-sm shadow-glass-lg overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                                    <div className="w-3 h-3 rounded-full bg-success/60" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1 rounded-sm bg-muted text-xs text-muted-foreground">
                                        app.ori-os.com/dashboard
                                    </div>
                                </div>
                            </div>
                            <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-tangerine/10 flex items-center justify-center">
                                        <Sparkles className="h-8 w-8 text-tangerine" />
                                    </div>
                                    <p className="text-muted-foreground">Dashboard Preview</p>
                                    <p className="text-sm text-muted-foreground/60 mt-1">
                                        Interactive demo coming soon
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
