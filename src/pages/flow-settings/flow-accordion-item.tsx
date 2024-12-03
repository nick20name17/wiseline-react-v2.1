import {
    DndContext,
    type DragEndEvent,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { FlowMenu } from './components/actions/flow/menu'
import { AddStatus } from './components/actions/stage/add'
import { StatusMenu } from './components/actions/stage/menu'
import type { FlowData } from '@/api/flows/flows.types'
import { usePatchStageMutation } from '@/api/stages/stages'
import type { StageData, StagePatchPayload } from '@/api/stages/stages.types'
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface FlowAccordionItemProps {
    flow: FlowData
}

interface SortableCardProps {
    stage: StageData
}

export const FlowAccordionItem = ({ flow }: FlowAccordionItemProps) => {
    const [patchStage] = usePatchStageMutation()

    const currentStages = flow?.stages || []

    const [items, setItems] = useState(currentStages)

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 12
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 50,
                tolerance: 8
            }
        })
    )

    const handlePatchStage = async (data: StagePatchPayload) => {
        try {
            await patchStage(data).unwrap()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }

        const currentData = event.over?.data?.current!

        if (currentData.stageName !== 'Unscheduled' && currentData.stageName !== 'Done') {
            handlePatchStage({
                id: event.active.id as number,
                data: {
                    position: currentData.position as unknown as number,
                    flow: flow.id
                }
            })
        }
    }

    const doneStage = currentStages.find((stage) => stage.name === 'Done')
    const unscheduledStage = currentStages.find((stage) => stage.name === 'Unscheduled')

    useEffect(() => {
        setItems(currentStages)
    }, [currentStages])

    return (
        <AccordionItem
            key={flow.id}
            className='mb-4 w-full border-none last:mb-0'
            value={flow.id.toString()}
        >
            <Card>
                <AccordionTrigger className='px-4'>
                    <CardHeader className='flex w-full flex-row items-center justify-between gap-x-4 p-1 pr-4'>
                        <CardTitle className='text-lg'>{flow.name}</CardTitle>
                        <FlowMenu
                            id={flow.id}
                            name={flow.name}
                        />
                    </CardHeader>
                </AccordionTrigger>

                <AccordionContent>
                    <CardContent className='flex flex-col gap-y-4'>
                        <AddStatus flowId={flow.id} />

                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center justify-between gap-x-4'>
                                    <div className='flex items-center gap-x-2 text-lg'>
                                        <div
                                            style={{
                                                backgroundColor: unscheduledStage?.color
                                            }}
                                            className='h-5 w-5 rounded-md'
                                        ></div>
                                        {unscheduledStage?.name}
                                    </div>
                                </CardTitle>

                                <CardDescription>
                                    {unscheduledStage?.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={items}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((stage) =>
                                    stage.name !== 'Done' &&
                                    stage.name !== 'Unscheduled' ? (
                                        <SortableCard
                                            key={stage.id}
                                            stage={stage}
                                        />
                                    ) : null
                                )}
                            </SortableContext>
                        </DndContext>

                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center justify-between gap-x-4'>
                                    <div className='flex items-center gap-x-2 text-lg'>
                                        <div
                                            style={{
                                                backgroundColor: doneStage?.color
                                            }}
                                            className='h-5 w-5 rounded-md'
                                        ></div>
                                        {doneStage?.name}
                                    </div>
                                </CardTitle>

                                <CardDescription>
                                    {doneStage?.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </CardContent>
                </AccordionContent>
            </Card>
        </AccordionItem>
    )
}

const SortableCard = ({ stage }: SortableCardProps) => {
    const disabled = stage.name === 'Unscheduled' || stage.name === 'Done'

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: stage.id,
        disabled,
        data: {
            position: stage.position,
            stageName: stage.name
        }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <CardHeader>
                <CardTitle className='flex items-center justify-between gap-x-4'>
                    <div className='flex items-center gap-x-2 text-lg'>
                        <div
                            style={{
                                backgroundColor: stage.color
                            }}
                            className='h-5 w-5 rounded-md'
                        ></div>
                        {stage.name}
                    </div>
                    {disabled ? null : (
                        <StatusMenu
                            color={stage.color}
                            description={stage?.description!}
                            id={stage.id}
                            name={stage.name}
                        />
                    )}
                </CardTitle>

                <CardDescription>{stage.description}</CardDescription>
            </CardHeader>
        </Card>
    )
}
