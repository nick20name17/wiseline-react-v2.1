import type { SortingState } from '@tanstack/react-table'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
export const useSorting = (defaultValues: SortingState) => {
    const [ordering, setOrdering] = useQueryState('ordering')

    const getInitialSorting = () => {
        if (ordering) {
            return ordering.split(',').map((sort) => ({
                id: sort.replace('-', ''),
                desc: sort.startsWith('-')
            }))
        }

        return defaultValues
    }

    const [sorting, setSorting] = useState(() => getInitialSorting())

    useEffect(() => {
        const currentSortingTerms = sorting
            .map((sort) => (sort.desc ? `-${sort.id}` : sort.id))
            .join(',')

        setOrdering(currentSortingTerms || null)
    }, [sorting])

    return { sorting, setSorting }
}
