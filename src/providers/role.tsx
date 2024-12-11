import type { PropsWithChildren } from 'react'

export const RoleProvider = ({ children }: PropsWithChildren) => {
    // const location = useLocation()
    // const isWorkerOrClient = useCurrentUserRole(['worker', 'client'])

    // if (isWorkerOrClient && isAdminRoute(location.pathname)) {
    //     return (
    //         <Navigate
    //             to={routes.main}
    //             state={{ from: location }}
    //             replace
    //         />
    //     )
    // }

    return children
}
