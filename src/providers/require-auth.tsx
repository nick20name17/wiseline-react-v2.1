import { type PropsWithChildren } from 'react'

export const RequireAuthProvider = ({ children }: PropsWithChildren) => {
    // const location = useLocation()

    // const isAuth = useAppSelector(selectIsAuth)

    // if (!isAuth) {
    //     return (
    //         <Navigate
    //             to={routes.login}
    //             state={{ from: location }}
    //             replace
    //         />
    //     )
    // }

    return children
}
