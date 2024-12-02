import { useQueryState } from 'nuqs'
import { useEffect } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Categories = () => {
    const [category, setCategory] = useQueryState('category', {
        defaultValue: 'Rollforming',
        clearOnDefault: false
    })

    const onValueChange = (value: string) => setCategory(value)

    useEffect(() => {
        setCategory(category)
    }, [])

    return (
        <Tabs
            onValueChange={onValueChange}
            defaultValue={category}
        >
            <TabsList>
                <TabsTrigger
                    value='Rollforming'
                    key='Rollforming'
                >
                    Rollforming
                </TabsTrigger>
                <TabsTrigger
                    value='Trim'
                    key='Trim'
                >
                    Trim
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
