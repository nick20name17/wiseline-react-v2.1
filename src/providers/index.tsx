import { type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { AuthProvider } from './auth'
import { ThemeProvider } from './theme'
import { store } from '@/store/index'

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Provider store={store}>
            <AuthProvider>
                <ThemeProvider
                    defaultTheme='light'
                    storageKey='vite-ui-theme'
                >
                    {children}
                </ThemeProvider>
            </AuthProvider>
        </Provider>
    )
}
