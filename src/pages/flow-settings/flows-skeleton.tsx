import { Skeleton } from '@/components/ui/skeleton'

export const FlowsSkeleton = () => (
    <div className='mt-4 flex flex-col gap-y-2'>
        {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
                key={index}
                className='mt-1 h-20 w-full'
            />
        ))}
    </div>
)
