import { Providers } from '@/providers'
import { createRoot } from 'react-dom/client'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import { App } from '@/app'
import '@/index.css'

if (process.env.NODE_ENV === 'production') {
    disableReactDevTools()
}


createRoot(document.getElementById('root')!).render(
   <Providers> <App /></Providers>
)
