import { PriorityActions } from './actions'
import { AddPriority } from './actions/add-priority'
import { PrioritiesSkeleton } from './priorities-skeleton'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetPrioritiesQuery } from '@/store/api/priorities/priorities'

export const Priorities = () => {
    const { data: priorities, isLoading } = useGetPrioritiesQuery()

    const newPriorities = priorities
        ? [...priorities]?.sort((a, b) => b.position - a.position)
        : []

    return (
        <section className='mx-auto mt-10 max-w-[1000px] px-3'>
            <AddPriority />

            <div className='mt-5'>
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
                                                    className='h-5 w-5 rounded-md'></div>
                                                {priority.name} — {priority.position}
                                            </div>
                                            <PriorityActions priority={priority!} />
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
    )
}
