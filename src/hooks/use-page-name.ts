import { useLocation } from 'react-router-dom'

import { appName } from '@/config/app'
import { capitalize } from '@/utils/text'

export const usePageTitle = () => {
    const location = useLocation()
    const path = location.pathname.replace('/', '')

    const formattedPath = path.split('-').map(capitalize).join(' ')

    return formattedPath || appName
}
