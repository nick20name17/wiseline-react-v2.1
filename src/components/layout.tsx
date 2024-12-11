import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import { SidebarProvider } from './ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { MetaHead } from '@/components/meta-head'
import { ErrorPage } from '@/pages/error-page'
import { RoleProvider } from '@/providers/role'

export const Layout = () => {
    return (
        <>
            <MetaHead />
            <QueryParamProvider adapter={ReactRouter6Adapter}>
                <SidebarProvider>
                    <AppSidebar />

                    <main>
                        <ErrorBoundary fallback={<ErrorPage />}>
                            <RoleProvider>
                                <Outlet />
                            </RoleProvider>
                        </ErrorBoundary>
                    </main>
                </SidebarProvider>

                <Toaster
                    richColors
                    duration={5000}
                />
            </QueryParamProvider>
        </>
    )
}
