import { useQueryState } from 'nuqs'
import { useEffect } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Statuses = () => {
    const [category] = useQueryState('category')
    const [scheduled, setScheduled] = useQueryState('scheduled', {
        parse: Boolean
    })
    const [, setOverdue] = useQueryState('overdue', {
        parse: Boolean
    })
    const [, setOffset] = useQueryState('offset', {
        parse: Number
    })
    const [, setCompleted] = useQueryState('completed', {
        parse: Boolean
    })

    const onValueChange = (tab: string) => {
        if (tab === 'unscheduled') {
            setCompleted(false)
        }

        setScheduled(tab === 'all' ? null : tab === 'scheduled')
        setOffset(0)
    }

    const getDefaultValue = () => {
        switch (scheduled) {
            case false:
                // setOverdue(null)
                return 'unscheduled'
            case true:
                return 'scheduled'
            default:
                return 'all'
        }
    }

    useEffect(() => {
        if (scheduled === false) {
            setCompleted(false)
        }
    }, [scheduled])

    return (
        <Tabs
            key={category! + scheduled!}
            onValueChange={onValueChange}
            defaultValue={getDefaultValue()}
        >
            <TabsList>
                <TabsTrigger value='all'>All</TabsTrigger>
                <TabsTrigger value='unscheduled'>Unscheduled</TabsTrigger>
                <TabsTrigger value='scheduled'>Scheduled</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
