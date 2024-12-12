import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { BooleanParam, useQueryParam } from 'use-query-params'

interface DataTableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    title: string
}

export const DataTableColumnHeader = <TData, TValue>({
    column,
    title
}: DataTableColumnHeaderProps<TData, TValue>) => {
    const [grouped] = useQueryParam('grouped', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)
    const [view] = useQueryParam('view')

    const isLinesDisabled = view === 'lines' && (completed! || grouped!)

    if (!column.getCanSort()) {
        return <div>{title}</div>
    }

    return (
        <button
            disabled={isLinesDisabled}
            onClick={column.getToggleSortingHandler()}
            className='inline-flex size-full items-center justify-between whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
        >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
                <ArrowDown />
            ) : column.getIsSorted() === 'asc' ? (
                <ArrowUp />
            ) : (
                <ChevronsUpDown />
            )}
        </button>
    )
}
