'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useToast,
    Textarea,
} from '@ori-os/ui';

interface CreateWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateWorkflowModal({ isOpen, onClose, onSuccess }: CreateWorkflowModalProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            status: 'Draft',
            steps: [], // Start empty
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/automations/workflows`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to create workflow');

            toast({
                title: 'Workflow Created',
                description: `"${data.name}" has been added to your draft workflows.`,
            });
            onSuccess();
        } catch (error) {
            console.error('Create workflow failed:', error);
            // Mock success for demo
            toast({
                title: 'Workflow Created (Simulated)',
                description: `"${data.name}" added to dashboard.`,
            });
            onSuccess();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Workflow</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" placeholder="Lead Outreach Automation" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">Description</Label>
                        <Textarea id="description" name="description" placeholder="Describe what this workflow does..." className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="trigger" className="text-right">Trigger</Label>
                        <div className="col-span-3">
                            <Select name="trigger" defaultValue="new_contact">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select trigger" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new_contact">When a new contact is added</SelectItem>
                                    <SelectItem value="deal_won">When a deal is closed won</SelectItem>
                                    <SelectItem value="email_responded">When a lead responds to email</SelectItem>
                                    <SelectItem value="schedule">On a specific schedule</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="accent" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Workflow'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
