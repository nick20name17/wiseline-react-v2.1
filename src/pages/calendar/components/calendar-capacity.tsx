import type { DailyDataCategory } from '@/api/ebms/calendar/calendar.types'
import { Badge } from '@/components/ui/badge'

export const Capacity = ({
    dailyData,
    totalCapacity
}: {
    dailyData: DailyDataCategory
    totalCapacity: number
}) => {
    return (
        <div className='text-sm'>
            <div className='mx-auto flex h-8 items-center justify-between gap-x-2 rounded-md border bg-muted px-2'>
                <Badge
                    className='pointer-events-none'
                    variant={dailyData?.count_orders ? 'default' : 'outline'}
                >
                    {dailyData?.count_orders || '0'}
                </Badge>
                {dailyData?.capacity || '0'} / {totalCapacity || '0'}
            </div>
        </div>
    )
}
