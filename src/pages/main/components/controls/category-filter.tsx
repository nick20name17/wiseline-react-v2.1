import { useQueryState } from 'nuqs'
import { useEffect } from 'react'

import { useGetAllCategoriesQuery } from '@/api/ebms/categories/categories'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export const CategoryFilter = () => {
    const [category, setCategory] = useQueryState('category')
    const [_, setOffset] = useQueryState('offset', {
        parse: Number
    })

    const { data: categoriesData, isLoading } = useGetAllCategoriesQuery()

    const tabs = categoriesData?.map((category) => category.name)

    const onValueChange = (value: string) => {
        setOffset(0)
        setCategory(value)
    }

    useEffect(() => {
        setCategory(category || 'All')
    }, [])

    if (isLoading) {
        return <Skeleton className='h-9 w-40' />
    }

    return (
        <Select
            key={category}
            defaultValue={category!}
            disabled={isLoading || categoriesData?.length === 0}
            onValueChange={onValueChange}
        >
            <SelectTrigger
                className={cn(
                    '!w-40 text-left font-medium',
                    category !== 'All' ? 'border-primary text-primary' : ''
                )}
            >
                <SelectValue placeholder='Select flow' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='All'>All Categories</SelectItem>
                {tabs?.map((category) => (
                    <SelectItem
                        key={category}
                        value={category}
                    >
                        {category}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
