'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
    { value: 10000, suffix: '+', label: 'Companies served' },
    { value: 50, suffix: 'M+', label: 'Leads enriched' },
    { value: 99.9, suffix: '%', label: 'Uptime SLA' },
    { value: 4.9, suffix: '/5', label: 'Customer rating' },
];

function AnimatedCounter({
    value,
    suffix,
    inView,
}: {
    value: number;
    suffix: string;
    inView: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value, inView]);

    const displayValue = value % 1 !== 0 ? count.toFixed(1) : Math.floor(count);

    return (
        <span className="tabular-nums">
            {displayValue}
            {suffix}
        </span>
    );
}

export function StatsSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    return (
        <section className="py-24 lg:py-32 bg-coffee-bean text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Trusted by <span className="text-tangerine">thousands</span> of teams
                    </h2>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Join the companies that have transformed their go-to-market with Ori-OS
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-tangerine mb-2">
                                <AnimatedCounter
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    inView={inView}
                                />
                            </div>
                            <div className="text-white/70 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
