import { CheckCircle2, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import {
    useAddSalesOrderMutation,
    usePatchSalesOrderMutation
} from '@/store/api/sales-orders/sales-orders'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectUser } from '@/store/slices/auth'
import { isErrorWithMessage } from '@/utils'

interface CheckCellProps {
    disabled?: boolean
    checked: boolean
    orderId: string
    name: 'assigned' | 'release_to_production' | 'cutting_complete'
    invoice: string
    itemId: number
}

export const CheckCell: React.FC<CheckCellProps> = ({
    disabled = false,
    checked,
    orderId,
    invoice,
    name,
    itemId
}) => {
    const [addSalesOrder, { isLoading: isLoadingAdd }] = useAddSalesOrderMutation()
    const [patchSalesOrder, { isLoading: isLoadingPatch }] = usePatchSalesOrderMutation()

    const isMutationLoading = isLoadingAdd || isLoadingPatch

    const getDisplayName = () => {
        switch (name) {
            case 'assigned':
                return 'Assigned'
            case 'release_to_production':
                return 'Release to production'
            case 'cutting_complete':
                return 'Cutting complete'
            default:
                return name
        }
    }

    const successToast = (message: string) => {
        toast.success(`${getDisplayName()} of ${invoice} order`, {
            description: message + ' successfully'
        })
    }

    const errorToast = (message: string) => {
        toast.error(`${getDisplayName()} of ${invoice} order`, {
            description: message
        })
    }

    const handleAddSalesOrder = async (value: boolean) => {
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

    const handlePatchSalesOrder = async (value: boolean, id: number) => {
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

    const [isChecked, setIsChecked] = useState(checked)

    const handleItemMutation = useDebouncedCallback((checked: boolean) => {
        if (itemId) {
            handlePatchSalesOrder(checked, itemId)
        } else {
            handleAddSalesOrder(checked)
        }
    }, 300)

    useEffect(() => {
        setIsChecked(checked)
    }, [checked])

    const onPressChanage = (checked: boolean) => {
        setIsChecked(checked)
        handleItemMutation(checked)
    }

    const userRole = useAppSelector(selectUser)?.role
    const isWorkerOrUser = userRole === 'worker' || userRole === 'client'

    return (
        <div className='mx-auto flex items-center justify-center'>
            {isWorkerOrUser || name === 'cutting_complete' ? (
                <div
                    className={cn(
                        'flex items-center',
                        (disabled || isMutationLoading) &&
                            'cursor-not-allowed opacity-50 grayscale'
                    )}
                >
                    {isChecked ? (
                        <>
                            <CheckCircle2 className='mr-1.5 h-4 w-4 flex-shrink-0 text-green-700' />
                            Yes
                        </>
                    ) : (
                        <>
                            <Circle className='mr-1.5 h-4 w-4 flex-shrink-0 text-foreground' />
                            No
                        </>
                    )}
                </div>
            ) : (
                <Toggle
                    disabled={disabled || isMutationLoading}
                    pressed={isChecked}
                    onPressedChange={onPressChanage}
                    className={cn(
                        'h-8 cursor-pointer data-[state=on]:border-green-600 data-[state=on]:bg-green-700/10',
                        (disabled || isMutationLoading) &&
                            'cursor-not-allowed opacity-50 grayscale'
                    )}
                    variant='outline'
                    asChild
                    aria-label='Toggle grouped'
                >
                    {isChecked ? (
                        <div>
                            <CheckCircle2 className='mr-1.5 h-4 w-4 flex-shrink-0 text-green-700' />
                            Yes
                        </div>
                    ) : (
                        <div>
                            <Circle className='mr-1.5 h-4 w-4 flex-shrink-0 text-foreground' />
                            No
                        </div>
                    )}
                </Toggle>
            )}
        </div>
    )
}
