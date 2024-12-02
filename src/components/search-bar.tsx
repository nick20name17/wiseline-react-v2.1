import { useQueryState } from 'nuqs'
import { useDebouncedCallback } from 'use-debounce'

import { Input } from '@/components/ui/input'

interface SearchBarProps {
    placeholder?: string
    resetOffset?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search...',
    resetOffset = true
}) => {
    const [search, setSearch] = useQueryState('search', {
        defaultValue: ''
    })
    const [, setOffset] = useQueryState('offset', {
        parse: Number
    })

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
            defaultValue={search}
            onChange={handleSearch}
            className='w-48'
            placeholder={placeholder}
        />
    )
}
