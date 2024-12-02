import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCurrentUserRole } from '@/hooks'
import {
    useAddSalesOrderMutation,
    usePatchSalesOrderMutation
} from '@/store/api/sales-orders/sales-orders'
import { capitalize } from '@/utils/capitalize'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface Props {
    name: 'packages' | 'location'
    value: number
    orderId: string
    itemId: number | undefined
    invoice: string
}

export const SalesOrderCell: React.FC<Props> = ({
    value,
    orderId,
    name,
    itemId,
    invoice
}) => {
    const [addSalesOrder] = useAddSalesOrderMutation()
    const [patchSalesOrder] = usePatchSalesOrderMutation()

    const successToast = (message: string) => {
        toast.success(`${capitalize(name)} of ${invoice} order`, {
            description: message + ' successfully'
        })
    }

    const errorToast = (message: string) => {
        toast.error(`${capitalize(name)} of ${invoice} order`, {
            description: message
        })
    }

    const handleAddSalesOrder = async (value: number) => {
        try {
            await addSalesOrder({
                order: orderId,
                [name]: value
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

    const handlePatchSalesOrder = async (value: number, id: number) => {
        try {
            await patchSalesOrder({
                id,
                data: {
                    order: orderId,
                    [name]: value
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

    const [currentValue, setCurrentValue] = useState(value)

    const handleItemMutation = useDebouncedCallback((value: number) => {
        if (itemId) {
            handlePatchSalesOrder(value, itemId)
        } else {
            handleAddSalesOrder(value)
        }
    }, 300)

    useEffect(() => {
        setCurrentValue(value)
    }, [value])

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +e.target.value
        setCurrentValue(value)
        handleItemMutation(value)
    }

    const isWorkerOrClient = useCurrentUserRole(['worker', 'client'])

    return (
        <div>
            {isWorkerOrClient ? (
                <Button
                    variant='ghost'
                    className='pointer-events-none w-full text-center font-normal'
                >
                    <span> {currentValue || '-'}</span>
                </Button>
            ) : (
                <Input
                    min={0}
                    value={currentValue || ''}
                    type='number'
                    inputMode='numeric'
                    placeholder='0'
                    onChange={onValueChange}
                />
            )}
        </div>
    )
}
