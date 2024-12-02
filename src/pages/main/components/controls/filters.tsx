import { CircleCheck, Clock } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'

import { Toggle } from '@/components/ui/toggle'

export const Filters = () => {
    const [, setDate] = useQueryState('date')
    const [overdue, setOverdue] = useQueryState('overdue', {
        parse: Boolean,
        clearOnDefault: false
    })
    const [completed = false, setCompleted] = useQueryState('completed', {
        parse: Boolean,
        clearOnDefault: false
    })
    const [scheduled] = useQueryState('scheduled', {
        parse: Boolean,
        clearOnDefault: false
    })
    const [, setOffset] = useQueryState('offset', {
        parse: Number
    })
    const [, setGrouped] = useQueryState('grouped', {
        parse: Boolean,
        clearOnDefault: false
    })

    useEffect(() => {
        if (overdue) {
            setDate(null)
        }
    }, [overdue])

    useEffect(() => {
        setOverdue(overdue === false ? null : overdue)
        setCompleted(completed)
    }, [completed, overdue])

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
