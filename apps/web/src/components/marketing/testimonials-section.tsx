'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Avatar, AvatarFallback, AvatarImage } from '@ori-os/ui';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        quote:
            "Ori-OS replaced 5 different tools we were using. The unified platform has saved us countless hours and the AI insights are genuinely useful.",
        author: 'Sarah Chen',
        title: 'VP of Sales',
        company: 'TechCorp',
        avatar: 'SC',
    },
    {
        quote:
            "The workflow automation is incredibly powerful. We've automated our entire lead qualification process and it just works.",
        author: 'Michael Torres',
        title: 'Revenue Operations',
        company: 'ScaleUp Inc',
        avatar: 'MT',
    },
    {
        quote:
            "We're excited to collaborate on the next phase, focusing on adaptive mobile and tablet versions.",
        author: 'Jacob N.',
        title: 'CEO',
        company: 'Orion',
        avatar: 'JN',
    },
    {
        quote:
            "Finally, a platform that understands how modern sales teams work. The analytics alone are worth the subscription.",
        author: 'Emily Watson',
        title: 'Head of Growth',
        company: 'FastTrack',
        avatar: 'EW',
    },
];

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-24 lg:py-32 bg-silver/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium text-tangerine mb-2">Client Feedback</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        What our customers say
                    </h2>
                </motion.div>

                <div className="max-w-4xl mx-auto relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card variant="glass" className="text-center p-8 lg:p-12">
                                <CardContent className="p-0">
                                    <Quote className="h-10 w-10 text-tangerine/30 mx-auto mb-6" />
                                    <blockquote className="text-xl lg:text-2xl text-foreground font-medium mb-8 leading-relaxed">
                                        "{testimonials[currentIndex].quote}"
                                    </blockquote>
                                    <div className="flex items-center justify-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonials[currentIndex].avatar}`}
                                            />
                                            <AvatarFallback>{testimonials[currentIndex].avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="text-left">
                                            <div className="font-semibold text-foreground">
                                                {testimonials[currentIndex].author}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {testimonials[currentIndex].title}, {testimonials[currentIndex].company}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-tangerine' : 'bg-border'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
