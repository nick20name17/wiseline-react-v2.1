import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { tableConfig } from '@/config/table'

interface TableSkeletonProps {
    columnsCount: number
}

export const TableSkeleton = ({ columnsCount: cellCount }: TableSkeletonProps) => {
    return Array.from({ length: tableConfig.pagination.pageSize }).map((_, index) => (
        <TableRow
            className='p-0'
            key={index}
        >
            <TableCell
                colSpan={cellCount}
                className='h-[41px] px-1 py-1.5'
            >
                <Skeleton className='h-[41px] w-full' />
            </TableCell>
        </TableRow>
    ))
}
