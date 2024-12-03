import { useQueryState } from 'nuqs'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Categories = () => {
    const [category, setCategory] = useQueryState('category', {
        defaultValue: 'Rollforming'
    })

    const onValueChange = (value: string) => setCategory(value)

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
