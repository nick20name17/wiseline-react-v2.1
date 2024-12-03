import { type PropsWithChildren } from 'react'

import { useGetUserQuery } from '@/api/users/users'
import { PageLoader } from '@/components/ui/page-loader'

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const userId =
        JSON.parse(localStorage.getItem('id') || 'null')?.id ??
        JSON.parse(sessionStorage.getItem('id') || 'null')?.id

    const { isLoading } = useGetUserQuery(userId)

    return isLoading ? <PageLoader /> : children
}
