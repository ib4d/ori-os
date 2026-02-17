"use client"

import { useState, useEffect, useCallback } from "react"

export interface Deal {
    id: string
    name: string
    value: number
    stage: string
    probability: number
    expectedClose?: string
    company?: string // Virtual property for UI
    owner?: string // Virtual property for UI
}

export function useDeals() {
    const [deals, setDeals] = useState<Deal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDeals = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/deals`)
            if (!response.ok) throw new Error("Failed to fetch deals")
            const data = await response.json()

            const normalizedData = data.map((d: any) => ({
                ...d,
                company: d.organization?.name || 'Private',
                owner: 'Sarah Chen',
                expectedClose: d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString() : 'TBD'
            }))

            setDeals(normalizedData.length > 0 ? normalizedData : [
                {
                    id: '1',
                    name: 'Enterprise TechCorp',
                    value: 450000,
                    stage: 'Negotiation',
                    probability: 75,
                    company: 'TechCorp',
                    owner: 'Sarah Chen',
                    expectedClose: '3/15/2024'
                },
                {
                    id: '2',
                    name: 'Acme Corp Expansion',
                    value: 280000,
                    stage: 'Proposal',
                    probability: 50,
                    company: 'Acme Corp',
                    owner: 'Michael Torres',
                    expectedClose: '3/22/2024'
                }
            ])
        } catch (err) {
            console.error('Fetch deals failed, using mock data:', err)
            setError(err instanceof Error ? err.message : "Something went wrong")
            setDeals([
                {
                    id: '1',
                    name: 'Enterprise TechCorp',
                    value: 450000,
                    stage: 'Negotiation',
                    probability: 75,
                    company: 'TechCorp',
                    owner: 'Sarah Chen',
                    expectedClose: '3/15/2024'
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDeals()
    }, [fetchDeals])

    return { deals, isLoading, error, refresh: fetchDeals }
}
