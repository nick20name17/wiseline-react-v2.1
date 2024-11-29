import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Layout } from '@/components/layout'
import { routes } from '@/config/routes'
import { CompanySettingsPage } from './pages/company-settings'
import { ErrorPage } from './pages/error-page'
import { MainPage } from './pages/main'
import { UserSettingsPage } from './pages/user-settings'
import { UsersPage } from './pages/users'
import { RequireAuthProvider } from './providers/require-auth'


const router = createBrowserRouter([
    {
        path: routes.main,
        element:    <RequireAuthProvider><Layout /></RequireAuthProvider>,
        errorElement: <ErrorPage message='Page not found' />,
        children: [
            {
                index: true,
                element: (

                        <MainPage />

                )
            },
            {
                path: routes.users,
                element: (

                        <UsersPage />

                )
            },
            {
                path: routes.companySettings,
                element: (

                        <CompanySettingsPage />

                )
            },
            {
                path: routes.userSettings,
                element: (

                        <UserSettingsPage />

                )
            },
            // {
            //     path: routes.calendar,
            //     element: (

            //             <CalendarPage />

            //     )
            // },
            // {
            //     path: routes.flowSettings,
            //     element: (

            //             <FlowSettingsPage />

            //     )
            // },
            // {
            //     path: routes.priorities,
            //     element: (

            //             <PrioritiesPage />

            //     )
            // },
            // {
            //     path: routes.passwordResetConfirm,
            //     element: <PasswordResetConfirmPage />
            // },
            // {
            //     path: routes.login,
            //     element: <LoginPage />
            // }
        ]
    },
    {
        path: '*',
        element: <ErrorPage message='Page not found' />,
    }
])

export const App = () => <RouterProvider router={router} />
