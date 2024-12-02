import { useQueryState } from 'nuqs'

import { DetailsView } from './components/views/details'
import { useGetPrioritiesQuery } from '@/api/priorities/priorities'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { useMatchMedia } from '@/hooks/use-match-media'

export const MainPage = () => {
    const [view] = useQueryState('view')

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

    return <DetailsView />
}
