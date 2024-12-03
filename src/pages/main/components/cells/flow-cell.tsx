import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useGetAllCategoriesQuery } from '@/api/ebms/categories/categories'
import type { EBMSItemData, EBMSItemsData } from '@/api/ebms/ebms.types'
import {
    useAddItemMutation,
    useAddOrderItemMutation,
    usePatchItemMutation,
    usePatchOrderItemMutation
} from '@/api/items/items'
import type { ItemAddData, ItemPatchPayload } from '@/api/items/items.types'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'

interface FlowCellProps {
    item: EBMSItemData | EBMSItemsData | undefined
}

export const FlowCell = ({ item }: FlowCellProps) => {
    const [category] = useQueryState('category')

    const { data: categoriesData } = useGetAllCategoriesQuery()

    const flows = categoriesData?.find(
        (category) => category.name.toLowerCase() === item?.category?.toLowerCase()
    )
    const flowsData = flows?.flows || []

    const { flow, id: itemId } = item?.item || {}
    const flowId = flow?.id

    const [defalutValue, setDefaultValue] = useState(flowId ? String(flowId) : '')

    const [patchItemStatus] = usePatchItemMutation()
    const [patchOrderStatus] = usePatchOrderItemMutation()

    const [addItem] = useAddItemMutation()
    const [addOrderItem] = useAddOrderItemMutation()

    const handlePatchItem = async (data: ItemPatchPayload) => {
        try {
            if (category === 'All') {
                await patchOrderStatus(data).unwrap()
            } else {
                await patchItemStatus(data).unwrap()
            }
        } catch (error) {
            toast.error('Error patching item')
        }
    }

    const handleAddItem = async (data: Partial<ItemAddData>) => {
        try {
            if (category === 'All') {
                await addOrderItem(data).unwrap()
            } else {
                await addItem(data).unwrap()
            }
        } catch (error) {
            toast.error('Error adding item')
        }
    }

    const onValueChange = (value: string) => {
        const flowName = flowsData?.find((flow) => flow.id === +value)?.name

        const data = {
            flow: +value,
            flowName,
            order: item?.origin_order
        }

        setDefaultValue(value)

        if (itemId) {
            handlePatchItem({
                id: itemId!,
                data
            })
        } else {
            handleAddItem({
                order: item?.origin_order,
                flowName,
                origin_item: item?.id,
                flow: +value
            })
        }
    }

    useEffect(() => {
        setDefaultValue(flowId ? String(flowId) : '')
    }, [flowId])

    const isClient = useCurrentUserRole('client')
    const isWorker = useCurrentUserRole('worker')

    return isClient || (isWorker && !item?.production_date) ? (
        <Button
            variant='ghost'
            className='pointer-events-none w-full text-center font-normal'
        >
            <span>
                {' '}
                {item?.item?.flow?.name || (
                    <span className='opacity-50'>Not selected</span>
                )}
            </span>
        </Button>
    ) : (
        <Select
            // key={defalueValue}
            disabled={!flowsData?.length || isClient}
            defaultValue={defalutValue}
            value={defalutValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger className='w-full text-left'>
                <SelectValue placeholder='Select flow' />
            </SelectTrigger>
            <SelectContent>
                {flowsData?.map((flow) => (
                    <SelectItem
                        key={flow.id}
                        value={String(flow.id)}
                    >
                        {flow.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
