"use client"

import { useState, useEffect } from "react"

export interface Company {
    id: string
    name: string
    domain?: string
    industry?: string
    size?: string
    location?: string
    description?: string
    status: "Customer" | "Prospect" | "Lead"
    contactsCount: number
}

export function useCompanies() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCompanies = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/companies`)
            if (!response.ok) throw new Error("Failed to fetch companies")
            const data = await response.json()

            const normalizedData = data.map((c: any) => ({
                ...c,
                status: c.status || 'Prospect',
                contactsCount: c.contacts?.length || 0,
            }))

            setCompanies(normalizedData)
            setError(null)
        } catch (err) {
            console.error('Fetch companies failed, using mock data:', err)
            setError(err instanceof Error ? err.message : "Something went wrong")
            setCompanies([
                { id: '1', name: 'TechCorp', domain: 'techcorp.com', industry: 'Technology', size: '500-1000', location: 'San Francisco, CA', status: 'Customer', contactsCount: 12 },
                { id: '2', name: 'ScaleUp Inc', domain: 'scaleup.io', industry: 'SaaS', size: '100-250', location: 'New York, NY', status: 'Prospect', contactsCount: 8 }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCompanies()
    }, [])

    return { companies, isLoading, error, refresh: fetchCompanies }
}
