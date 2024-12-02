import { BooleanParam, useQueryParam } from 'use-query-params'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export const StatusesFilter = () => {
    const [cuttingComplete, setCuttingComplete] = useQueryParam(
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

    const getDefaultValue = () => {
        switch (cuttingComplete) {
            case false:
                return 'active'
            case true:
                return 'archived'
            default:
                return 'all'
        }
    }

    return (
        <Select
            defaultValue={getDefaultValue()}
            onValueChange={onCuttingComplete}
        >
            <SelectTrigger
                className={cn(
                    '!w-40 text-left font-medium',
                    cuttingComplete !== undefined ? 'border-primary text-primary' : ''
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
