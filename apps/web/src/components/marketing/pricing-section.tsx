'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, Badge, cn } from '@ori-os/ui';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        description: 'Perfect for small teams getting started',
        price: 49,
        period: '/user/mo',
        features: [
            'Up to 5 team members',
            '1,000 lead enrichments/mo',
            'Basic CRM features',
            'Email sequences',
            'Standard analytics',
            'Email support',
        ],
        cta: 'Start Free Trial',
        popular: false,
    },
    {
        name: 'Growth',
        description: 'For scaling teams with advanced needs',
        price: 99,
        period: '/user/mo',
        features: [
            'Up to 20 team members',
            '10,000 lead enrichments/mo',
            'Full CRM + pipelines',
            'Multi-channel sequences',
            'Advanced analytics & funnels',
            'Workflow automation',
            'API access',
            'Priority support',
        ],
        cta: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        description: 'For large organizations with custom needs',
        price: null,
        period: 'Custom',
        features: [
            'Unlimited team members',
            'Unlimited enrichments',
            'Custom integrations',
            'Dedicated success manager',
            'SSO & advanced security',
            'Custom contracts',
            'SLA guarantees',
            'On-premise option',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export function PricingSection() {
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
                        Simple, transparent <span className="gradient-text">pricing</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        No hidden fees. No complicated tiers. Pick the plan that works for you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                variant={plan.popular ? 'default' : 'outline'}
                                className={cn(
                                    'h-full relative',
                                    plan.popular && 'border-tangerine shadow-glow-sm'
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge variant="accent" rounded="full">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}
                                <CardContent className="p-6 lg:p-8">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            {plan.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        {plan.price !== null ? (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold text-foreground">
                                                    ${plan.price}
                                                </span>
                                                <span className="text-muted-foreground">{plan.period}</span>
                                            </div>
                                        ) : (
                                            <div className="text-4xl font-bold text-foreground">
                                                {plan.period}
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                                                <span className="text-sm text-muted-foreground">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        variant={plan.popular ? 'accent' : 'outline'}
                                        className="w-full"
                                        asChild
                                    >
                                        <Link href={plan.name === 'Enterprise' ? '/contact' : '/register'}>
                                            {plan.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
