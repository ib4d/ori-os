
'use client';

import React, { useState, useMemo } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Badge,
    Checkbox,
    Progress,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Avatar,
    AvatarFallback
} from '@ori-os/ui';
import {
    Plus,
    Trash2,
    Mail,
    Clock,
    Users,
    Rocket,
    Check,
    AlertCircle,
    GripVertical,
    Settings2,
    Target,
    ShieldCheck,
    BarChart3,
    Search,
    Globe,
    Zap,
    Scale,
    ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StepType = 'EMAIL' | 'WAIT' | 'CONDITION';

type SequenceStep = {
    id: string;
    type: StepType;
    config: any;
};

const WIZARD_STEPS = [
    { id: 1, title: 'Objective & ICP', description: 'Define goal and target profile' },
    { id: 2, title: 'Audience & Data', description: 'Select and validate leads' },
    { id: 3, title: 'Sending Setup', description: 'Domain & mailbox choice' },
    { id: 4, title: 'Sequence Design', description: 'Write content and rules' },
    { id: 5, title: 'Compliance & Safety', description: 'GDPR and legal checks' },
    { id: 6, title: 'Review & Launch', description: 'Final pre-flight checks' }
];

export function CampaignWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [campaignName, setCampaignName] = useState('');
    const [objective, setObjective] = useState('Book meetings');
    const [icpProfile, setIcpProfile] = useState('SaaS Founders');
    const [sequence, setSequence] = useState<SequenceStep[]>([
        { id: '1', type: 'EMAIL', config: { subject: 'Quick question about {{company}}' } }
    ]);
    const [selectedContacts, setSelectedContacts] = useState(142);
    const [isValidated, setIsValidated] = useState(false);
    const [complianceAgreed, setComplianceAgreed] = useState(false);

    const addStep = (type: StepType) => {
        setSequence([...sequence, {
            id: Math.random().toString(),
            type,
            config: type === 'WAIT' ? { days: 2 } : { subject: '', body: '' }
        }]);
    };

    const removeStep = (id: string) => {
        setSequence(sequence.filter(s => s.id !== id));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Objective & ICP
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Campaign Name</Label>
                                <Input
                                    placeholder="e.g. Q1 SaaS Outreach"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <Label>What is your primary goal?</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {['Book meetings', 'Generate interest', 'Nurture leads'].map((obj) => (
                                        <div
                                            key={obj}
                                            onClick={() => setObjective(obj)}
                                            className={`p-4 border rounded-md cursor-pointer transition-all ${objective === obj ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted'}`}
                                        >
                                            <p className="text-sm font-medium">{obj}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Target ICP Profile</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option>SaaS Founders (500-1000 employees)</option>
                                    <option>Marketing Directors (Fintech)</option>
                                    <option>Create New Profile...</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2: // Audience & Data
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Label>Select Audience</Label>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start py-6 h-auto">
                                        <Users className="mr-3 h-5 w-5 text-primary" />
                                        <div className="text-left">
                                            <p className="font-medium">Existing Segment</p>
                                            <p className="text-xs text-muted-foreground">Choose from your saved filters</p>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start py-6 h-auto">
                                        <Plus className="mr-3 h-5 w-5 text-primary" />
                                        <div className="text-left">
                                            <p className="font-medium">Import CSV</p>
                                            <p className="text-xs text-muted-foreground">Upload a new list of leads</p>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <Card className="bg-muted/30">
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium">Audience Summary</p>
                                        <Badge variant="outline">{selectedContacts} Contacts</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span>Email Validation</span>
                                            <span className={isValidated ? 'text-success' : 'text-warning'}>
                                                {isValidated ? 'Validated' : 'Requires Validation'}
                                            </span>
                                        </div>
                                        <Progress value={isValidated ? 100 : 0} className="h-1.5" />
                                        {!isValidated && (
                                            <Button size="sm" className="w-full mt-2" onClick={() => setIsValidated(true)}>
                                                Run Validation Pipeline
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                );
            case 3: // Sending Infrastructure
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-4">
                            <Label>Select Sending Identities</Label>
                            {[
                                { email: 'james@oricraftlabs.com', domain: 'oricraftlabs.com', score: 9.4, status: 'Healthy' },
                                { email: 'support@oricraft.io', domain: 'oricraft.io', score: 7.2, status: 'Warming' }
                            ].map((mb, i) => (
                                <Card key={i} className="hover:border-primary cursor-pointer transition-all border-l-4 border-l-success">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Globe className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{mb.email}</p>
                                                <div className="flex space-x-2 mt-1">
                                                    <Badge variant="outline" className="text-[10px] py-0">SPF/DKIM: OK</Badge>
                                                    <Badge variant="outline" className="text-[10px] py-0">Audit: {mb.score}/10</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={mb.status === 'Healthy' ? 'success' : 'warning'}>{mb.status}</Badge>
                                            <p className="text-[11px] text-muted-foreground mt-1">Limit: 50/day</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                );
            case 4: // Sequence & Content
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Design Campaign Sequence</h3>
                            <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => addStep('WAIT')}><Clock className="mr-2 h-4 w-4" /> Add Wait</Button>
                                <Button size="sm" variant="outline" onClick={() => addStep('EMAIL')}><Mail className="mr-2 h-4 w-4" /> Add Email</Button>
                            </div>
                        </div>
                        <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:h-[calc(100%-32px)] before:w-0.5 before:bg-muted">
                            {sequence.map((step, idx) => (
                                <div key={step.id} className="relative pl-12">
                                    <div className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-primary text-[10px] font-bold">
                                        {idx + 1}
                                    </div>
                                    <Card className="group relative">
                                        <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
                                            <div className="flex items-center space-x-2">
                                                {step.type === 'EMAIL' ? <Mail className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-orange-500" />}
                                                <CardTitle className="text-sm font-medium">{step.type === 'EMAIL' ? 'Email outreach' : 'Wait Period'}</CardTitle>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeStep(step.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="pb-4">
                                            {step.type === 'EMAIL' ? (
                                                <div className="space-y-2">
                                                    <Input placeholder="Subject" defaultValue={step.config.subject} className="text-sm font-medium" />
                                                    <textarea
                                                        className="w-full min-h-[100px] p-3 text-sm rounded-md border bg-background"
                                                        placeholder="Write your email content... Use {{firstName}} for variables."
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" className="h-7 text-[10px]">Templates</Button>
                                                            <Button variant="outline" size="sm" className="h-7 text-[10px]">Spam Check</Button>
                                                        </div>
                                                        <Badge variant="success" className="text-[10px]">Risk: Low</Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm">Wait for</span>
                                                    <Input type="number" defaultValue={step.config.days} className="w-16 h-8 text-sm" />
                                                    <span className="text-sm">days before next step</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 5: // Compliance & Safety
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <AlertCircle className="h-10 w-10 text-primary mx-auto" />
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-medium">Compliance Review</h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                We've analyzed your recipient list geography and adjusted settings for maximal safety.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="border-l-4 border-l-primary">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Audience Geo</p>
                                    <p className="font-medium text-sm">62% EU (GDPR Region)</p>
                                    <div className="mt-2 text-[10px] text-warning flex items-center">
                                        <ShieldAlert className="h-3 w-3 mr-1" /> Stricter rules applied
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Unsubscribe Link</p>
                                    <p className="font-medium text-sm">Included (Mandatory)</p>
                                    <div className="mt-2 text-[10px] text-success flex items-center">
                                        <ShieldCheck className="h-3 w-3 mr-1" /> Compliant
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-3 bg-muted/30 p-4 rounded-md">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="gdpr-basis" checked={complianceAgreed} onCheckedChange={(val) => setComplianceAgreed(!!val)} />
                                <Label htmlFor="gdpr-basis" className="text-sm leading-none cursor-pointer">
                                    I confirm I have a valid legal basis (Legitimate Interest) for this outreach.
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="tos-confirm" />
                                <Label htmlFor="tos-confirm" className="text-sm leading-none cursor-pointer">
                                    I understand I am the data controller for this campaign.
                                </Label>
                            </div>
                        </div>
                    </motion.div>
                );
            case 6: // Review & Launch
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-block p-3 rounded-full bg-success/10 text-success mb-2">
                                <Rocket className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Ready for Blast Off?</h3>
                            <p className="text-sm text-muted-foreground">Run the final pre-flight check to ensure everything is perfect.</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { title: 'Domain Health', result: '9.4/10 - Excellent', icon: Globe, status: 'pass' },
                                { title: 'List Quality', result: '98% Validated - Low Bounce Risk', icon: ShieldCheck, status: 'pass' },
                                { title: 'Sending Volume', result: 'within 50/day provider limit', icon: Zap, status: 'pass' },
                                { title: 'Spam Risk', result: 'Low Copy Risk', icon: ShieldAlert, status: 'pass' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-md bg-white">
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="h-4 w-4 text-primary" />
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase">{item.title}</p>
                                            <p className="text-sm font-medium">{item.result}</p>
                                        </div>
                                    </div>
                                    <Check className="h-5 w-5 text-success" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="max-w-4xl mx-auto shadow-2xl border-none overflow-hidden bg-background/50 backdrop-blur-xl">
            <CardHeader className="border-b bg-muted/30 pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Target className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">New Outreach Campaign</CardTitle>
                                <CardDescription>Step {currentStep} of 6: {WIZARD_STEPS[currentStep - 1].title}</CardDescription>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1.5 p-1 bg-muted rounded-full">
                        {WIZARD_STEPS.map(s => (
                            <div
                                key={s.id}
                                className={`h-2.5 w-8 rounded-full transition-all duration-300 ${currentStep === s.id ? 'bg-primary w-12' : currentStep > s.id ? 'bg-primary/40' : 'bg-muted-foreground/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-8 min-h-[450px]">
                {renderStepContent()}
            </CardContent>
            <CardFooter className="border-t bg-muted/30 py-6 flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="px-8"
                >
                    Back
                </Button>
                <div className="flex gap-3">
                    {currentStep < 6 ? (
                        <Button
                            className="px-8 shadow-lg shadow-primary/20"
                            onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            disabled={!complianceAgreed}
                            className={`px-8 bg-primary shadow-lg shadow-primary/30 ${!complianceAgreed ? 'opacity-50' : 'hover:scale-105 transition-transform'}`}
                            onClick={() => alert('Campaign Successfully Launched!')}
                        >
                            <Rocket className="mr-2 h-4 w-4" /> Launch Campaign
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

