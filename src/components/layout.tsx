import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/sonner'
import { ErrorPage } from '@/pages/error-page'
import { RoleProvider } from '@/providers/role'
import { MetaHead } from './meta-head'

export const Layout = () => {
    return (
         <>
             <MetaHead />
            <main>
                <ErrorBoundary fallback={<ErrorPage />}>
                    <div className='mx-auto'>
                        <RoleProvider>
                            <Outlet />
                        </RoleProvider>
                    </div>
                </ErrorBoundary>
            </main>
            <Toaster
                richColors
                duration={5000}
            />
         </>
    )
}
