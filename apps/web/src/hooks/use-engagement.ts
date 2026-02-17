"use client"

import { useState, useEffect, useCallback } from "react"

export interface Sequence {
    id: string
    name: string
    contacts: number
    sent: number
    opened: number
    replied: number
    status: "Active" | "Paused"
}

export interface Message {
    id: string
    from: string
    subject: string
    preview: string
    time: string
    unread: boolean
}

export function useEngagement() {
    const [sequences, setSequences] = useState<Sequence[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [seqRes, msgRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/engagement/sequences`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/engagement/inbox`)
            ])

            const seqData = await seqRes.json()
            const msgData = await msgRes.json()

            setSequences(seqData.length > 0 ? seqData : [
                { id: '1', name: 'Q1 Outreach', contacts: 150, sent: 450, opened: 180, replied: 45, status: 'Active' },
                { id: '2', name: 'Re-engagement', contacts: 200, sent: 400, opened: 160, replied: 32, status: 'Active' }
            ])

            setMessages(msgData.length > 0 ? msgData : [
                { id: '1', from: 'Sarah Chen', subject: 'Re: Partnership opportunity', preview: "Thanks for reaching out! I'd love to discuss...", time: '10 min ago', unread: true },
                { id: '2', from: 'Michael Torres', subject: 'Follow up on our call', preview: 'Hi, following up on our conversation from...', time: '1 hour ago', unread: true }
            ])
        } catch (err) {
            console.error('Fetch engagement failed, using mock data:', err)
            setSequences([
                { id: '1', name: 'Q1 Outreach', contacts: 150, sent: 450, opened: 180, replied: 45, status: 'Active' }
            ])
            setMessages([
                { id: '1', from: 'Sarah Chen', subject: 'Re: Partnership opportunity', preview: "Thanks for reaching out!", time: '10 min ago', unread: true }
            ])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { sequences, messages, isLoading, refresh: fetchData }
}
