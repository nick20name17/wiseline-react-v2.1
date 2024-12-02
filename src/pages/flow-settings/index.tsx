import { AddFlow } from './components/actions/flow/add'
import { AddCapacityDialog } from './components/dialogs/add-capacity'
import { FlowAccordionItem } from './flow-accordion-item'
import { useGetAllCategoriesQuery } from '@/api/ebms/categories/categories'
import { Header } from '@/components/header'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export const FlowSettingsPage = () => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery()

    return (
        <>
            <Header title='Production Category Flow Settingss' />
            <section className='mx-auto mt-4 max-w-[1000px] px-4'>
                {/* <h2 className='scroll-m-20 text-xl font-semibold tracking-tight'>EBMS Production Categories</h2> */}

                {isLoading ? (
                    <FlowsSkeleton />
                ) : (
                    <Accordion type='multiple'>
                        {categories?.map((category) => {
                            const isCapacity =
                                category?.name === 'Trim' ||
                                category?.name === 'Rollforming'

                            return (
                                <AccordionItem
                                    className='mt-4 rounded-md border bg-card'
                                    value={category.name}
                                    key={category.id}
                                >
                                    <AccordionTrigger className='flex min-h-20 items-center px-4'>
                                        <div className='flex flex-col items-start gap-y-2'>
                                            <div className='flex gap-x-2'>
                                                <span className='text-sm font-semibold'>
                                                    {category.name}
                                                </span>
                                                <Badge variant='outline'>
                                                    {category.flow_count} flows
                                                </Badge>
                                            </div>
                                            {isCapacity ? (
                                                <div className='flex gap-x-2'>
                                                    <span className='text-sm'>
                                                        Daily Capacity:
                                                    </span>
                                                    <div className='flex items-center gap-x-1'>
                                                        <span className='text-sm font-bold'>
                                                            {category?.capacity ?? '-'}
                                                        </span>
                                                        <AddCapacityDialog
                                                            capacityId={
                                                                category?.capacity_id
                                                            }
                                                            categoryId={category.id}
                                                            capacity={category?.capacity!}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='flex flex-col gap-y-4 px-4 pt-1'>
                                        <AccordionItem
                                            className='border-none'
                                            value='add-flow'
                                        >
                                            <AddFlow categoryId={category.id} />
                                        </AccordionItem>
                                        <Accordion type='multiple'>
                                            {category.flows?.length ? (
                                                category.flows?.map((flow) => (
                                                    <FlowAccordionItem
                                                        flow={flow}
                                                        key={flow.id}
                                                    />
                                                ))
                                            ) : (
                                                <div className='flex h-full flex-col items-center justify-center gap-4 py-4'>
                                                    No flows
                                                </div>
                                            )}
                                        </Accordion>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                )}
            </section>
        </>
    )
}

const FlowsSkeleton = () => (
    <div className='mt-4 flex flex-col gap-y-2'>
        {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
                key={index}
                className='mt-1 h-20 w-full'
            />
        ))}
    </div>
)
