import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { isAdminRoute, routes } from '@/config/routes'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'

export const RoleProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const location = useLocation()
    const isWorkerOrClient = useCurrentUserRole(['worker', 'client'])

    if (isWorkerOrClient && isAdminRoute(location.pathname)) {
        return (
            <Navigate
                to={routes.main}
                state={{ from: location }}
                replace
            />
        )
    }

    return children
}
