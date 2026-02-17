'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Badge,
    ScrollArea,
} from '@ori-os/ui';
import { CheckCircle2, Clock, XCircle, ChevronRight, Zap } from 'lucide-react';

interface ExecutionLogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExecutionLogModal({ isOpen, onClose }: ExecutionLogModalProps) {
    const logs = [
        { id: '1', workflow: 'Auto-reply to New Leads', status: 'Success', time: '2 mins ago', steps: 4 },
        { id: '2', workflow: 'Slack Notify: Big Deal', status: 'Success', time: '1 hour ago', steps: 2 },
        { id: '3', workflow: 'Monthly Report Sync', status: 'Failed', time: '1 day ago', steps: 1, error: 'API Auth Error' },
        { id: '4', workflow: 'Auto-reply to New Leads', status: 'In Progress', time: 'Just now', steps: 2 },
        { id: '5', workflow: 'Database Backup', status: 'Success', time: '2 hours ago', steps: 1 },
        { id: '6', workflow: 'Lead Enrichment Sync', status: 'Success', time: '3 hours ago', steps: 12 },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-tangerine" />
                        Automation Execution Logs
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[500px] p-6 pt-2">
                    <div className="space-y-3">
                        {logs.map((log) => (
                            <div key={log.id} className="p-4 rounded-sm border border-border bg-card/50 hover:bg-muted/50 transition-all cursor-pointer group hover:border-tangerine/30">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        {log.status === 'Success' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                                            log.status === 'Failed' ? <XCircle className="h-4 w-4 text-destructive" /> :
                                                <Clock className="h-4 w-4 text-tangerine animate-pulse" />}
                                        <span className="font-semibold text-foreground">{log.workflow}</span>
                                    </div>
                                    <Badge variant={log.status === 'Success' ? 'success' : log.status === 'Failed' ? 'destructive' : 'secondary'}>
                                        {log.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" />
                                            {log.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Zap className="h-3 w-3" />
                                            {log.steps} steps
                                        </span>
                                    </div>
                                    {log.error && (
                                        <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 py-0 px-2 h-5">
                                            {log.error}
                                        </Badge>
                                    )}
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-tangerine" />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-tighter opacity-50">
                        Showing last 30 days of execution logs
                    </Badge>
                </div>
            </DialogContent>
        </Dialog>
    );
}
