import { OrdersView } from './components/views/orders'
import { useGetPrioritiesQuery } from '@/api/priorities/priorities'
import { OrdersHeader } from '@/components/orders-header'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { useMatchMedia } from '@/hooks/use-match-media'

export const MainPage = () => {
    // const [view] = useQueryState('view')

    const { isTablet } = useMatchMedia()

    useBodyScrollLock(!isTablet)

    const {} = useGetPrioritiesQuery()

    // const ordersView = useMemo(() => {
    //     switch (view) {
    //         case 'cut':
    //             return <CutView />
    //         case 'lines':
    //             return <AllDetailsView />
    //         default:
    //             return <AllOrdersView />
    //     }
    // }, [view])

    return (
        <>
            <OrdersHeader />
            <OrdersView />
        </>
    )
}
