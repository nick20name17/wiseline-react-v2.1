import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export const TableSkeleton = () => {
    return Array.from({ length: 10 }).map((_, index) => (
        <TableRow
            className='!p-0'
            key={index}>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableCell
                    key={index}
                    className='h-8 px-1 py-1.5'>
                    <Skeleton className='h-8 w-full' />
                </TableCell>
            ))}
        </TableRow>
    ))
}
