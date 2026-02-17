'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@ori-os/ui';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
    return (
        <section className="py-24 lg:py-32 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-coffee-bean via-gunmetal to-coffee-bean" />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-tangerine/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-tangerine/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm mb-6">
                        <Sparkles className="h-4 w-4 text-tangerine" />
                        Start your 14-day free trial
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to transform your{' '}
                        <span className="text-tangerine">go-to-market</span>?
                    </h2>

                    <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
                        Join thousands of teams who have unified their sales, marketing, and
                        customer success operations with Ori-OS.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            variant="accent"
                            size="xl"
                            className="w-full sm:w-auto group"
                            asChild
                        >
                            <Link href="/register">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="xl"
                            className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                            asChild
                        >
                            <Link href="/contact">Talk to Sales</Link>
                        </Button>
                    </div>

                    <p className="mt-6 text-sm text-white/50">
                        No credit card required • Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
