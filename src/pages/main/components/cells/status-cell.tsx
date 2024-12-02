import { RefreshCcw } from 'lucide-react'
import { animate } from 'motion/react'
import { useQueryState } from 'nuqs'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useLazyGetOrderQuery } from '@/api/ebms/ebms'
import type { EBMSItemData, EBMSItemsData } from '@/api/ebms/ebms.types'
import {
    usePatchItemMutation,
    usePatchOrderItemMutation,
    useResetItemStagesMutation
} from '@/api/items/items'
import type { ItemPatchPayload } from '@/api/items/items.types'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'
import { hexToRGBA } from '@/utils/hex-to-rgba'

interface StatusCellProps {
    item: EBMSItemData | EBMSItemsData | undefined
}

export const StatusCell: React.FC<StatusCellProps> = ({ item }) => {
    const { flow, stage, id: itemId } = item?.item || {}

    const originOrderId = item?.origin_order
    const invoice = item?.order

    const [view] = useQueryState('view')
    const [completed] = useQueryState('completed', {
        parse: Boolean
    })

    const [trigger] = useLazyGetOrderQuery()

    const stageId = stage?.id
    const flowId = flow?.id
    const isFlow = !!flowId

    const [defaultStatus, setDefaultStatus] = useState(stageId ? String(stageId) : '')
    const [open, setOpen] = useState(false)

    const statuses = useMemo(
        () => flow?.stages?.slice().sort((a, b) => a.position - b.position),
        [flow?.stages]
    )

    const orderCompletedToast = () =>
        toast.success(`Order ${originOrderId}`, {
            description: 'Has been moved to Completed'
        })

    const successToast = (status: string, color: string) => {
        const isDone = status === 'Done'

        const isFromMessage = stage?.color && stage?.name

        const fromMessage = (
            <span>
                from{' '}
                {
                    <div
                        className='inline-block h-3 w-3 rounded-sm align-middle'
                        style={{
                            backgroundColor: stage?.color
                        }}
                    ></div>
                }{' '}
                {stage?.name}
            </span>
        )

        const toMessage = (
            <span>
                to{' '}
                {
                    <div
                        className='inline-block h-3 w-3 rounded-sm align-middle'
                        style={{
                            backgroundColor: color
                        }}
                    ></div>
                }{' '}
                {status}
            </span>
        )

        const isItemDone = isDone && view === 'lines'

        const allOrdersDescription = isItemDone ? (
            'Has been moved to Completed'
        ) : isFromMessage ? (
            <span>
                Status has been changed {fromMessage} ➝ {toMessage}
            </span>
        ) : (
            <span>Status has been changed {toMessage}</span>
        )

        const completedDescription = !isDone
            ? 'Has been moved to All orders'
            : 'Status has been changed to Done'

        const description = completed ? completedDescription : allOrdersDescription

        const successHeading =
            view === 'lines' ? `Item ${item?.id}` : `Item ${item?.id} of Order ${invoice}`

        toast.success(successHeading, {
            description: <div>{description}</div>
        })
    }

    const errorToast = (message: string) =>
        toast.error(`Item ${item?.item?.origin_item}`, {
            description: message
        })

    const [patchItem] = usePatchItemMutation()
    const [patchOrderItem] = usePatchOrderItemMutation()

    const patchFunction = view === 'lines' ? patchItem : patchOrderItem

    const handlePatchItem = async (data: ItemPatchPayload) => {
        try {
            await patchFunction({
                id: data.id,
                data: data.data
            })
                .unwrap()
                .then(() => {
                    if (view === 'orders') {
                        trigger(
                            {
                                autoid: originOrderId
                            },
                            false
                        )
                            .unwrap()
                            .then((response) => {
                                const trHeaderElement = document?.getElementById(
                                    'tr-header-' + item?.item?.order || item?.id!
                                )!
                                const trElement = document?.getElementById(
                                    'tr-' + item?.item?.order || item?.id!
                                )!

                                if (
                                    (!response.completed &&
                                        data.stageName !== 'Done' &&
                                        completed) ||
                                    (data.stageName === 'Done' &&
                                        response.completed &&
                                        !completed)
                                ) {
                                    animate(
                                        trHeaderElement,
                                        { x: '-100%', opacity: 0 },
                                        { duration: 1.2, type: 'spring' }
                                    )
                                    animate(
                                        trElement,
                                        { x: '-100%', opacity: 0 },
                                        { duration: 1.2, type: 'spring' }
                                    )
                                }

                                response.completed ? orderCompletedToast() : null
                            })
                    }
                })
                .then(() => successToast(data.stageName!, data.stageColor!))
        } catch (error) {
            // const isErrorMessage = isErrorWithMessage(error)
            errorToast('Something went wrong')
        }
    }

    const onValueChange = (value: string) => {
        const currentStatus = statuses?.find((stage) => stage.id === +value)

        const stageName = currentStatus?.name
        const stageColor = currentStatus?.color

        setDefaultStatus(value)

        const data = {
            order: originOrderId,
            stage: +value
        }

        handlePatchItem({
            id: itemId!,
            data,
            stageName,
            stageColor
        }).then(() => {
            if (
                (!completed && stageName === 'Done') ||
                (completed && stageName !== 'Done')
            ) {
                const currentId = view === 'lines' ? item?.id : item?.item?.id
                const trHeaderElement = document?.getElementById(
                    'tr-header-' + currentId
                )!
                const trElement = document?.getElementById('tr-' + currentId)!

                if (trHeaderElement) {
                    animate(
                        trHeaderElement,
                        { x: '-100%', opacity: 0 },
                        { duration: 1.2, type: 'spring', delay: 0.2 }
                    )
                }
                if (trElement) {
                    animate(
                        trElement,
                        { x: '-100%', opacity: 0 },
                        { duration: 1.2, type: 'spring', delay: 0.2 }
                    )
                }
            }
        })
    }

    const isDisabled = !isFlow || flow.stages.length === 0

    const [resetStages] = useResetItemStagesMutation()

    const handleResetStages = async () => {
        setOpen(false)

        try {
            await resetStages(item?.item?.id!)
                .unwrap()
                .then(() =>
                    toast.success(
                        `Statuses of Item ${item?.id} have been successfully reset`,
                        {
                            description: 'All statuses have been removed from the item'
                        }
                    )
                )
        } catch {}
    }

    useEffect(() => {
        setDefaultStatus(stageId ? String(stageId) : '')
    }, [stageId])

    const isClient = useCurrentUserRole('client')
    const isWorker = useCurrentUserRole('worker')

    return isClient || (isWorker && (!flowId || !item?.production_date)) ? (
        <Button
            variant='ghost'
            className='pointer-events-none w-full text-center font-normal'
        >
            <span>
                {' '}
                {item?.item?.stage?.name || (
                    <span className='opacity-50'>Not selected</span>
                )}
            </span>
        </Button>
    ) : (
        <Select
            open={open}
            onOpenChange={setOpen}
            onValueChange={onValueChange}
            defaultValue={defaultStatus}
            value={defaultStatus}
            disabled={isDisabled}
        >
            <SelectTrigger className='w-full'>
                <span className='block w-full truncate text-left'>
                    <SelectValue placeholder='Select status' />
                </span>
            </SelectTrigger>
            <SelectContent>
                {statuses?.map((status) => {
                    const wasSelected = status?.item_ids?.includes(item?.item?.id!)
                    return (
                        <SelectItem
                            style={{
                                backgroundColor: wasSelected
                                    ? hexToRGBA(status.color, 20)
                                    : ''
                            }}
                            className='mt-1 !block transition-all duration-150 ease-in-out first:mt-0 hover:!bg-accent'
                            key={status.id}
                            value={String(status.id)}
                        >
                            <div className='-mt-0.5 flex items-center justify-between gap-x-1.5'>
                                <div className='flex items-center justify-between gap-x-1.5'>
                                    <div
                                        className='h-3 w-3 rounded-sm'
                                        style={{
                                            backgroundColor: status.color
                                        }}
                                    ></div>
                                    {status.name}
                                </div>
                            </div>
                        </SelectItem>
                    )
                })}

                <Separator className='my-1' />

                <Button
                    disabled={
                        item?.item?.stage?.item_ids.length === 0 || isWorker || isClient
                    }
                    onClick={handleResetStages}
                    className='h-8 w-full font-normal'
                    variant='ghost'
                >
                    <RefreshCcw className='mr-2 h-3 w-3' />
                    Reset history
                </Button>
            </SelectContent>
        </Select>
    )
}
