import { useGetPrioritiesQuery } from '@/api/priorities/priorities'
import { Header } from '@/components/header'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AddPriority } from './components/actions/add'
import { PriorityMenu } from './components/actions/menu'

export const PrioritiesPage = () => {
    const { data: priorities, isLoading } = useGetPrioritiesQuery()

    const newPriorities = priorities
        ? [...priorities]?.sort((a, b) => b.position - a.position)
        : []

    return (
      <>
      <Header title='Production Priorities Settings'/>
      <section className='mx-auto mt-8 max-w-[1000px] px-r'>
            <AddPriority />

            <div className='mt-4'>
                {isLoading ? (
                    <PrioritiesSkeleton />
                ) : (
                    <div className='flex flex-col gap-y-4'>
                        {newPriorities?.length ? (
                            newPriorities?.map((priority) => (
                                <Card key={priority.id}>
                                    <CardHeader>
                                        <CardTitle className='flex items-center justify-between gap-x-4'>
                                            <div className='flex items-center gap-x-2 text-lg'>
                                                <div
                                                    style={{
                                                        backgroundColor: priority.color
                                                    }}
                                                    className='size-5 rounded-md'></div>
                                                {priority.name} — {priority.position}
                                            </div>
                                            <PriorityMenu priority={priority!} />
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center justify-center text-center text-base'>
                                        No priorities found
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </section>
      </>
    )
}

const PrioritiesSkeleton = () => (
    <div className='mt-4 flex flex-col gap-y-2'>
        {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton
                key={index}
                className='mt-1 h-20 w-full'
            />
        ))}
    </div>
)
