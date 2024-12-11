import { StringParam, useQueryParam } from 'use-query-params'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const defaultCategory = 'Rollforming'

export const Categories = () => {
    const [category = defaultCategory, setCategory] = useQueryParam(
        'category',
        StringParam
    )

    const onValueChange = (value: string) => setCategory(value)

    return (
        <Tabs
            onValueChange={onValueChange}
            defaultValue={category || defaultCategory}
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
