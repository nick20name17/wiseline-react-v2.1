import { useDebouncedCallback } from 'use-debounce'
import { NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { Input } from '@/components/ui/input'

interface SearchBarProps {
    placeholder?: string
    resetOffset?: boolean
}

const defaultSearch = ''

export const SearchBar = ({
    placeholder = 'Search...',
    resetOffset = true
}: SearchBarProps) => {
    const [search = defaultSearch, setSearch] = useQueryParam('search', StringParam)
    const [, setOffset] = useQueryParam('offset', NumberParam)

    const debouncedSetSearch = useDebouncedCallback((searchTerm: string | null) => {
        setSearch(searchTerm)
        if (resetOffset) {
            setOffset(0)
        }
    }, 300)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value
        debouncedSetSearch(searchTerm ? searchTerm : null)
    }

    return (
        <Input
            defaultValue={search || defaultSearch}
            onChange={handleSearch}
            className='w-48'
            placeholder={placeholder}
        />
    )
}
