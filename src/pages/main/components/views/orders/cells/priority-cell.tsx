import { RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { OrdersData } from '@/api/ebms/ebms.types'
import { useGetPrioritiesQuery } from '@/api/priorities/priorities'
import {
    useAddSalesOrderMutation,
    usePatchSalesOrderMutation
} from '@/api/sales-orders/sales-orders'
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
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface PriorityCellProps {
    order: OrdersData
}

export const PriorityCell = ({ order }: PriorityCellProps) => {
    const { data: priorities, isLoading } = useGetPrioritiesQuery()

    const priorityId = order?.sales_order?.priority?.id

    const [defalutValue, setDefaultValue] = useState(priorityId ? String(priorityId) : '')

    useEffect(() => {
        setDefaultValue(priorityId ? String(priorityId) : '')
    }, [priorityId])

    const [addSalesOrder] = useAddSalesOrderMutation()
    const [patchSalesOrder] = usePatchSalesOrderMutation()

    const successToast = (message: string) => {
        toast.success(`Priority of ${order.invoice} order`, {
            description: message + ' successfully'
        })
    }

    const errorToast = (message: string) => {
        toast.error(`Priority of ${order.invoice} order`, {
            description: message
        })
    }

    const handleAddSalesOrder = async (value: string) => {
        try {
            await addSalesOrder({
                order: order.id,
                priority: +value
            })
                .unwrap()
                .then(() => {
                    successToast('Added')
                })
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)

            const errorMessage = isErrorMessage
                ? error.data.detail
                : 'Something went wrong'

            errorToast(errorMessage)
        }
    }

    const handlePatchSalesOrder = async (value: string, id: number) => {
        try {
            await patchSalesOrder({
                id,
                data: {
                    order: order?.id,
                    priority: +value
                }
            })
                .unwrap()
                .then(() => {
                    successToast('Updated')
                })
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)

            const errorMessage = isErrorMessage
                ? error.data.detail
                : 'Something went wrong'

            errorToast(errorMessage)
        }
    }

    const [open, setOpen] = useState(false)

    const handleResetPriority = async (id: number) => {
        setOpen(false)

        const data = {
            priority: null,
            order: order.id
        }

        try {
            await patchSalesOrder({
                data,
                id
            })
                .unwrap()
                .then(() => {
                    successToast('Reseted')
                })
        } catch (error) {
            toast.error('Error reseting priority')
        }
    }

    const handleItemMutation = (value: string) => {
        if (order?.sales_order?.id) {
            handlePatchSalesOrder(value, order?.sales_order?.id)
        } else {
            handleAddSalesOrder(value)
        }
    }

    const onValueChange = (value: string) => {
        setDefaultValue(value)
        handleItemMutation(value)
    }

    const isWorkerOrClient = useCurrentUserRole(['worker', 'client'])

    return isWorkerOrClient ? (
        <Button
            variant='ghost'
            className='pointer-events-none text-center font-normal'
        >
            <span>
                {order?.sales_order?.priority?.name || (
                    <span className='opacity-50'>Not selected</span>
                )}
            </span>
        </Button>
    ) : (
        <Select
            open={open}
            onOpenChange={setOpen}
            disabled={!priorities?.length || isWorkerOrClient || isLoading}
            defaultValue={defalutValue}
            value={defalutValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger className='text-left'>
                <SelectValue placeholder='Priority' />
            </SelectTrigger>
            <SelectContent className='max-h-[230px]'>
                {priorities?.map((priority) => (
                    <SelectItem
                        key={priority.id}
                        value={priority.id?.toString()}
                    >
                        <div className='flex items-center justify-between gap-x-1.5'>
                            <div
                                className='h-3 w-3 rounded-sm'
                                style={{
                                    backgroundColor: priority?.color
                                }}
                            ></div>
                            {priority.name}
                        </div>
                    </SelectItem>
                ))}

                <Separator className='my-1' />

                <Button
                    disabled={!priorities?.length || isWorkerOrClient || isLoading}
                    onClick={() => handleResetPriority(order?.sales_order?.id)}
                    className='h-8 w-full font-normal'
                    variant='ghost'
                >
                    <RefreshCcw className='mr-2 h-3 w-3' />
                    Reset
                </Button>
            </SelectContent>
        </Select>
    )
}
