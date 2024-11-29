import { type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { store } from '@/store/index'
import { AuthProvider } from './auth'
import { ThemeProvider } from './theme'

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Provider store={store}>
            <AuthProvider>
                <ThemeProvider
                    defaultTheme='light'
                    storageKey='vite-ui-theme'>
                    {children}
                </ThemeProvider>
            </AuthProvider>
        </Provider>
    )
}
