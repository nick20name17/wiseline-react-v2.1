import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
    date: Date | undefined
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    disabled?: boolean
    placeholder?: string
}

export const DatePicker = ({
    date,
    setDate,
    disabled = false,
    placeholder = 'Pick a date'
}: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={'outline'}
                    className={cn(
                        'w-40 flex-1 justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon />
                    {date ? format(date, 'dd.MM.yyyy EEE') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
