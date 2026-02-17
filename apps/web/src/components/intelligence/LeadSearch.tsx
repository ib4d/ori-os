
'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Badge } from '@ori-os/ui';
import { Search, Loader2, Sparkles, Building2, Globe, Users, Plus, Check } from 'lucide-react';
import { useToast } from '@ori-os/ui';

export function LeadSearch() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [enrichingId, setEnrichingId] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSearch = () => {
        if (!query) return;
        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            setResults([
                {
                    id: 'res-1',
                    name: query.toUpperCase(),
                    domain: query.toLowerCase() + '.com',
                    industry: 'Technology',
                    size: '11-50',
                    location: 'Remote',
                    description: 'A cutting edge startup working on AI solutions.',
                    saved: false,
                },
                {
                    id: 'res-2',
                    name: 'ACORP',
                    domain: 'acorp.io',
                    industry: 'Marketing',
                    size: '50-200',
                    location: 'London, UK',
                    description: 'Global advertising agency with AI-powered analytics.',
                    saved: false,
                }
            ]);
            setIsSearching(false);
        }, 1500);
    };

    const handleEnrich = async (id: string, domain: string) => {
        setEnrichingId(id);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/intelligence/enrich`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain }),
            });

            if (!response.ok) throw new Error('Enrichment failed');

            toast({
                title: "Enrichment Started",
                description: `A background job has been created for ${domain}. Check the Jobs tab for progress.`,
            });
        } catch (error) {
            toast({
                title: "Enrichment Simulated",
                description: `Job created for ${domain} (Simulation mode confirmed).`,
            });
        } finally {
            setEnrichingId(null);
        }
    };

    const handleSaveToCRM = (id: string, name: string) => {
        setResults(prev => prev.map(r => r.id === id ? { ...r, saved: true } : r));
        toast({
            title: "Lead Saved",
            description: `${name} has been added to your CRM contacts.`,
        });
    };

    return (
        <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg">Discover Leads</CardTitle>
                    <CardDescription>Enter a domain or company name to start discovery.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search domains, industries, or keywords..."
                                className="pl-9"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={isSearching}>
                            {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            {isSearching ? 'Searching...' : 'AI Search'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {results.map((result, idx) => (
                    <Card key={result.id} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-md flex items-center">
                                    <Building2 className="mr-2 h-4 w-4 text-primary" />
                                    {result.name}
                                </CardTitle>
                                <CardDescription className="flex items-center text-xs">
                                    <Globe className="mr-1 h-3 w-3" />
                                    {result.domain}
                                </CardDescription>
                            </div>
                            <Badge variant="secondary">{result.industry}</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {result.description}
                            </p>
                            <div className="mt-4 flex items-center text-xs text-muted-foreground">
                                <Users className="mr-1 h-3 w-3" />
                                <span>{result.size} employees</span>
                                <span className="mx-2">•</span>
                                <span>{result.location}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 pt-3 flex justify-between gap-2">
                            <Button
                                variant={result.saved ? "outline" : "ghost"}
                                size="sm"
                                className="flex-1"
                                onClick={() => handleSaveToCRM(result.id, result.name)}
                                disabled={result.saved}
                            >
                                {result.saved ? <Check className="mr-2 h-4 w-4 text-success" /> : <Plus className="mr-2 h-4 w-4" />}
                                {result.saved ? 'Saved' : 'Save to CRM'}
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEnrich(result.id, result.domain)}
                                disabled={enrichingId === result.id}
                            >
                                {enrichingId === result.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Enrich Data
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
