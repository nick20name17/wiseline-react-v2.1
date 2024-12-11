import { CircleCheck, Clock } from 'lucide-react'
import { useEffect } from 'react'
import { BooleanParam, NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { Toggle } from '@/components/ui/toggle'

const defaultCompleted = false

export const Filters = () => {
    const [, setDate] = useQueryParam('date', StringParam)
    const [overdue, setOverdue] = useQueryParam('overdue', BooleanParam)
    const [completed = defaultCompleted, setCompleted] = useQueryParam(
        'completed',
        BooleanParam
    )

    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [, setOffset] = useQueryParam('offset', NumberParam)
    const [, setGrouped] = useQueryParam('grouped', BooleanParam)

    useEffect(() => {
        if (overdue) {
            setDate(null)
        }
    }, [overdue])

    const handleSetCompleted = (value: boolean) => {
        setCompleted(value ? true : false)
        setOffset(0)

        if (value) {
            setGrouped(null)
        }
    }

    const handleSetOverdue = (value: boolean) => {
        setOverdue(value ? true : null)
        setOffset(0)
    }

    return (
        <div className='flex items-center gap-x-4'>
            {scheduled === false ? null : (
                <>
                    <Toggle
                        pressed={!!overdue}
                        onPressedChange={handleSetOverdue}
                        className='data=[state=on]:border flex items-center gap-x-2 data-[state=on]:border-primary data-[state=on]:bg-background data-[state=on]:text-primary'
                        variant='outline'
                        aria-label='Toggle grouped'
                    >
                        <Clock className='size-4' />
                        <span className='max-sm:hidden'> Overdue</span>
                    </Toggle>
                    <Toggle
                        pressed={!!completed}
                        onPressedChange={handleSetCompleted}
                        className='data=[state=on]:border flex items-center gap-x-2 data-[state=on]:border-primary data-[state=on]:bg-background data-[state=on]:text-primary'
                        variant='outline'
                        aria-label='Toggle grouped'
                    >
                        <CircleCheck className='size-4' />
                        <span className='max-sm:hidden'> Completed</span>
                    </Toggle>
                </>
            )}
        </div>
    )
}
