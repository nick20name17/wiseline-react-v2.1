import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import type { Matcher } from 'react-day-picker'

import { useGetCompanyProfilesQuery } from '@/api/profiles/profiles'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface MultipatchDatePickerProps {
    date: Date | undefined
    disabled?: boolean
    placeholder?: string
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}
export const MultipatchDatePicker: React.FC<MultipatchDatePickerProps> = ({
    date,
    setDate,
    disabled = false,
    placeholder = 'Pick a date'
}) => {
    const [open, setOpen] = useState(false)

    const close = () => setOpen(false)

    const { data } = useGetCompanyProfilesQuery()
    const isWorkingWeekend = data?.working_weekend

    const [disabledDays, setDisabledDays] = useState<Matcher[]>([])

    useEffect(() => {
        if (!isWorkingWeekend) {
            setDisabledDays([{ dayOfWeek: [0, 6] }])
        }
    }, [isWorkingWeekend])

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={'outline'}
                    className={cn(
                        'w-40 flex-1 justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className='mr-2 h-3 w-3 flex-shrink-0' />

                    {date ? format(date, 'dd.MM.yyyy EEE') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    disabled={disabledDays}
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
                <div className='flex w-full items-center justify-start gap-x-3 p-3 pt-0'>
                    <Button
                        className='flex-1'
                        onClick={close}
                    >
                        Set Date
                    </Button>
                    <Button
                        onClick={close}
                        className='flex-1'
                        variant='secondary'
                    >
                        Cancel
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
