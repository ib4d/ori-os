'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Input,
    Label,
    useToast
} from '@ori-os/ui';

export default function ContentPage() {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleCreate = () => {
        setIsOpen(false);
        toast({
            title: "Content Created",
            description: "A new template has been added to your library.",
        });
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <div className="flex items-center justify-between mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Content Library
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Manage your email templates, documents, and assets
                    </p>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-none font-semibold hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    New Content
                </motion.button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Content</DialogTitle>
                        <DialogDescription>
                            Create a new email template or document for your campaigns.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="e.g. Welcome Email Template" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Content Type</Label>
                            <select className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>Email Template</option>
                                <option>Document</option>
                                <option>Sales Script</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button variant="accent" onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="mb-6">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search content..."
                        className="flex-1 pl-10 pr-4 py-2 border border-border rounded-none bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 rounded-none border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-none bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">Sample Template {i}</h3>
                                <p className="text-sm text-muted-foreground">Last modified 2 days ago</p>
                            </div>
                            <span className="text-xs text-muted-foreground">Email Template</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
