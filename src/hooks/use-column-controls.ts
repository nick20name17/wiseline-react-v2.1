import type { ColumnDef, Table, VisibilityState } from '@tanstack/react-table'
import type { DragEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { UsersProfileData } from '@/api/profiles/profiles.types'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

type PageType = 'items' | 'orders'

const DEFAULT_COLUMNS = {
    items: ['select', 'arrow', 'flow', 'status', 'production_date'],
    orders: ['select', 'arrow']
}

export const useColumnOrder = (usersProfilesData: UsersProfileData[], page: PageType) => {
    const defaultOrder =
        usersProfilesData
            .find((profile) => profile.page === page)
            ?.show_columns?.split(',') ?? []

    const [columnOrder, setColumnOrder] = useState<string[]>(defaultOrder)

    useEffect(() => {
        setColumnOrder(defaultOrder)
    }, [usersProfilesData, page])

    return {
        columnOrder: [...DEFAULT_COLUMNS[page], ...columnOrder]
    }
}

export const useColumnVisibility = <TData, TValue>(
    usersProfilesData: UsersProfileData[],
    page: PageType,
    columns: ColumnDef<TData, TValue>[]
) => {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    useEffect(() => {
        const profile = usersProfilesData.find((p) => p.page === page)
        if (!profile) return

        const showColumns = profile.show_columns?.split(',') ?? []
        const tableColumns = columns
            .map((column) => (column as any).accessorKey)
            .filter(Boolean)

        const newVisibility = tableColumns.reduce<VisibilityState>((acc, column) => {
            acc[column] = showColumns.includes(column)
            return acc
        }, {})

        setColumnVisibility(newVisibility)
    }, [usersProfilesData, page, columns])

    return { columnVisibility }
}

export const useColumnDragDrop = <T>(
    table: Table<T>,
    page: PageType,
    // handleFunction: (arg: { show_columns: string; page: PageType }) => Promise<void>
    handleFunction: any
) => {
    const [columnBeingDragged, setColumnBeingDragged] = useState<number | null>(null)

    const onDragStart = useCallback((e: DragEvent<HTMLElement>) => {
        setColumnBeingDragged(Number(e.currentTarget.dataset.columnIndex))
    }, [])

    const onDrop = useCallback(
        (e: DragEvent<HTMLElement>) => {
            e.preventDefault()
            if (columnBeingDragged === null) return

            const newPosition = Number(e.currentTarget.dataset.columnIndex)
            const currentCols = table.getVisibleLeafColumns().map((c) => c.id)
            const colToBeMoved = currentCols.splice(columnBeingDragged, 1)

            currentCols.splice(newPosition, 0, colToBeMoved[0])
            table.setColumnOrder(currentCols)

            const filteredCols = currentCols.filter(
                (col) => !DEFAULT_COLUMNS[page].includes(col)
            )

            handleFunction({ show_columns: filteredCols.join(','), page }).catch(
                (error: any) => {
                    const message = isErrorWithMessage(error)
                        ? error.data.detail
                        : 'Something went wrong'
                    toast.error(message)
                }
            )

            setColumnBeingDragged(null)
        },
        [columnBeingDragged, table, page, handleFunction]
    )

    return { onDragStart, onDrop }
}
