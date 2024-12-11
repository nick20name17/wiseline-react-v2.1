import { BooleanParam, useQueryParam } from 'use-query-params'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const defaultCuttingComplete = null

const getDefaultValue = (cuttingComplete: boolean) => {
    switch (cuttingComplete) {
        case false:
            return 'active'
        case true:
            return 'archived'
        default:
            return 'all'
    }
}

export const StatusesFilter = () => {
    const [cuttingComplete = defaultCuttingComplete, setCuttingComplete] = useQueryParam(
        'cutting_complete',
        BooleanParam
    )

    const onCuttingComplete = (value: string | null) => {
        if (value === 'all') {
            setCuttingComplete(null)
        } else {
            setCuttingComplete(value === 'archived')
        }
    }

    return (
        <Select
            defaultValue={getDefaultValue(cuttingComplete!)}
            onValueChange={onCuttingComplete}
        >
            <SelectTrigger
                className={cn(
                    '!w-40 text-left font-medium',
                    cuttingComplete !== null ? 'border-primary text-primary' : ''
                )}
            >
                <SelectValue placeholder='Select flow' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='archived'>Archived</SelectItem>
            </SelectContent>
        </Select>
    )
}
