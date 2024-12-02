import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import { usePatchItemMFGMutation, usePatchMFGMutation } from '@/api/ebms/ebms'
import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectUser } from '@/store/slices/auth'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface OnHandCellProps {
    originItem: EBMSItemsData | EBMSItemsData
    disabled: boolean
    cellKey: 'orders' | 'items'
}

export const OnHandCell: React.FC<OnHandCellProps> = ({
    originItem,
    disabled,
    cellKey
}) => {
    const [patchItemMFG] = usePatchItemMFGMutation()
    const [patchMFG] = usePatchMFGMutation()

    const successToast = (message: string) => {
        toast.success(`Mfg of ${originItem.order} order`, {
            description: message + ' successfully'
        })
    }

    const errorToast = (message: string) => {
        toast.error(`Mfg of ${originItem.order} order`, {
            description: message
        })
    }

    const handlePatchSalesOrder = async (value: number, id: string) => {
        const handleFunction = cellKey === 'orders' ? patchMFG : patchItemMFG
        try {
            await handleFunction({
                id,
                origin_order: originItem.origin_order,
                data: {
                    c_mfg: value!
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

    const [currentValue, setCurrentValue] = useState(originItem?.c_mfg)

    const handleItemMutation = useDebouncedCallback((value: number) => {
        handlePatchSalesOrder(value, originItem?.id)
    }, 300)

    useEffect(() => {
        setCurrentValue(originItem?.c_mfg)
    }, [originItem?.c_mfg])

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? Math.abs(+e.target.value) : 0

        if (value > 2000) {
            setCurrentValue(2000)
            handleItemMutation(2000)
        } else {
            setCurrentValue(value)
            handleItemMutation(value)
        }
    }

    const userRole = useAppSelector(selectUser)?.role
    const isWorkerOrUser = userRole === 'worker' || userRole === 'client'

    return (
        <div className='w-full'>
            {isWorkerOrUser ? (
                <Button
                    variant='ghost'
                    className='pointer-events-none w-full text-center font-normal'
                >
                    <span> {currentValue || '-'}</span>
                </Button>
            ) : (
                <Input
                    className='w-full'
                    disabled={disabled}
                    min={0}
                    max={2000}
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
