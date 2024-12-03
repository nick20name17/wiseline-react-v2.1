import { useQueryState } from 'nuqs'
import { useEffect } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const CutViewTabs = () => {
    const [cutView = 'pipeline', setCutView] = useQueryState('cut-view')
    const [, setOffset] = useQueryState('offset', {
        parse: Number
    })

    const onValueChange = (tab: string) => {
        setCutView(tab)
        setOffset(0)
    }

    useEffect(() => {
        setCutView(cutView)

        return () => {
            setCutView(null)
        }
    }, [])

    return (
        <Tabs
            onValueChange={onValueChange}
            defaultValue={cutView!}
            className='w-fit'
        >
            <TabsList className='bg-secondary'>
                <TabsTrigger value='pipeline'>Cut List Pipeline</TabsTrigger>
                <TabsTrigger value='orders'>Orders</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
