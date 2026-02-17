import { HeroSection } from '@/components/marketing/hero-section';
import { FeaturesSection } from '@/components/marketing/features-section';
import { BentoSection } from '@/components/marketing/bento-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { TestimonialsSection } from '@/components/marketing/testimonials-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { CTASection } from '@/components/marketing/cta-section';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <MarketingHeader />
            <main>
                <HeroSection />
                <FeaturesSection />
                <BentoSection />
                <StatsSection />
                <TestimonialsSection />
                <PricingSection />
                <CTASection />
            </main>
            <MarketingFooter />
        </div>
    );
}
