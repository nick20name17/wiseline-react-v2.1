import { Loader2 } from 'lucide-react'

export const PageLoader = () => (
    <div className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary'>
        <Loader2 className='size-9 animate-spin' />
    </div>
)
