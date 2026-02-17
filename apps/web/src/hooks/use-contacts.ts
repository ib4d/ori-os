"use client"

import { useState, useEffect } from "react"

export interface Contact {
    id: string
    firstName: string
    lastName: string
    name?: string // Virtual property for UI
    email: string
    phone?: string
    jobTitle?: string
    company?: string // Virtual property for UI
    location?: string
    status: "Active" | "Inactive"
}

export function useContacts() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchContacts = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/contacts`)
            if (!response.ok) throw new Error("Failed to fetch contacts")
            const data = await response.json()

            const normalizedData = data.map((c: any) => ({
                ...c,
                name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email,
                company: c.organization?.name || 'Private',
            }))

            setContacts(normalizedData)
            setError(null)
        } catch (err) {
            console.error('Fetch contacts failed, using mock data:', err)
            setError(err instanceof Error ? err.message : "Something went wrong")
            setContacts([
                { id: '1', firstName: 'Sarah', lastName: 'Chen', name: 'Sarah Chen', email: 'sarah.chen@techcorp.com', company: 'TechCorp', jobTitle: 'VP of Sales', status: 'Active', location: 'San Francisco, CA' },
                { id: '2', firstName: 'Michael', lastName: 'Torres', name: 'Michael Torres', email: 'm.torres@scaleup.io', company: 'ScaleUp Inc', jobTitle: 'Account Executive', status: 'Active', location: 'New York, NY' }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    return { contacts, isLoading, error, refresh: fetchContacts }
}
