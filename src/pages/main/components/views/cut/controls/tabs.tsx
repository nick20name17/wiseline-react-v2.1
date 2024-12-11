import { useQueryState } from 'nuqs'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const CutViewTabs = () => {
    const [cutView, setCutView] = useQueryState('cut-view')

    const [, setOffset] = useQueryState('offset', {
        parse: Number
    })

    const onValueChange = (tab: string) => {
        setCutView(tab)
        setOffset(0)
    }

    // useEffect(() => {
    //     setCutView(cutView)
    //     return () => {
    //         setCutView(null)
    //     }
    // }, [])

    return (
        <Tabs
            onValueChange={onValueChange}
            defaultValue={cutView || 'pipeline'}
            className='w-fit'
        >
            <TabsList>
                <TabsTrigger value='pipeline'>Cut List Pipeline</TabsTrigger>
                <TabsTrigger value='orders'>Orders</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
