import { useEffect } from 'react'
import { NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const defaultCutView = 'pipeline'

export const CutViewTabs = () => {
    const [cutView = defaultCutView, setCutView] = useQueryParam('cut-view', StringParam)

    const [, setOffset] = useQueryParam('offset', NumberParam)

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
            defaultValue={cutView || defaultCutView}
            className='w-fit'
        >
            <TabsList>
                <TabsTrigger value='pipeline'>Cut List Pipeline</TabsTrigger>
                <TabsTrigger value='orders'>Orders</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
