import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { useQueryState } from 'nuqs'

interface DataTableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    title: string
    sortable?: boolean
}

export const DataTableColumnHeader = <TData, TValue>({
    column,
    title
}: DataTableColumnHeaderProps<TData, TValue>) => {
    const [grouped] = useQueryState('grouped', {
        parse: Boolean
    })
    const [completed] = useQueryState('completed', {
        parse: Boolean
    })
    const [view] = useQueryState('view')

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
