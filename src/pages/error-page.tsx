import { Button } from '@/components/ui/button'

interface ErrorPageProps {
    message?: string
}

export const ErrorPage = ({ message = 'Something went wrong' }: ErrorPageProps) => {
    return (
        <div className='flex min-h-[100vh] items-center justify-center'>
            <div className='flex flex-col items-center gap-y-4'>
                <h1 className='text-center text-5xl'>{message}</h1>
                <Button onClick={() => window.location.reload()}>Try again</Button>
            </div>
        </div>
    )
}
