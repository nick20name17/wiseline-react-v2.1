import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { useGetAllCategoriesQuery } from '@/store/api/ebms/categories/categories'
import { AddCapacityDialog } from './add-capacity-dialog'
import { FlowAccordionItem } from './flow-accordion-item'
import { AddFlowDialog } from './flow-actions/add-flow-dialog'
import { FlowsSkeleton } from './flows-skeleton'

export const FlowSettings = () => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery()

    return (
        <section className='mx-auto mt-4 max-w-[1000px] px-3'>
            <h1 className='text-2xl font-semibold'>EBMS Production Categories:</h1>

            {isLoading ? (
                <FlowsSkeleton />
            ) : (
                <Accordion type='multiple'>
                    {categories?.map((category) => {
                        const isCapacity =
                            category?.name === 'Trim' || category?.name === 'Rollforming'

                        return (
                            <AccordionItem
                                className='mt-4 rounded-md border bg-card'
                                value={category.name}
                                key={category.id}>
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
                                                        capacityId={category?.capacity_id}
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
                                <AccordionContent className='flex flex-col gap-y-3 px-4 pt-1'>
                                    <AccordionItem
                                        className='border-none'
                                        value='add-flow'>
                                        <AddFlowDialog categoryId={category.id} />
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
    )
}
