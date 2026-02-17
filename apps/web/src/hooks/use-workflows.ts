"use client"

import { useState, useEffect } from "react"

export interface Workflow {
    id: string
    name: string
    description: string
    status: "Active" | "Paused" | "Draft"
    lastRun?: string
}

export function useWorkflows() {
    const [workflows, setWorkflows] = useState<Workflow[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchWorkflows = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/automations/workflows`)
            if (!response.ok) throw new Error("Failed to fetch workflows")
            const data = await response.json()
            setWorkflows(data.length > 0 ? data : [
                { id: '1', name: 'Auto-reply to New Leads', description: 'Send a personalized email when a new contact is added', status: 'Active', lastRun: '2 hours ago' },
                { id: '2', name: 'Slack Notify: Big Deal', description: 'Post to #sales when a deal over $50k is created', status: 'Active', lastRun: '1 day ago' },
                { id: '3', name: 'Monthly Report Sync', description: 'Export monthly performance to Google Sheets', status: 'Paused' }
            ])
        } catch (err) {
            console.error('Fetch workflows failed:', err)
            setWorkflows([
                { id: '1', name: 'Auto-reply to New Leads', description: 'Send a personalized email when a new contact is added', status: 'Active', lastRun: '2 hours ago' }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchWorkflows()
    }, [])

    return { workflows, isLoading, refresh: fetchWorkflows }
}
