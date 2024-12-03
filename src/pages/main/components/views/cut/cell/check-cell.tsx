import { CheckCircle2, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { usePatchItemCuttingCompleteMutation } from '@/api/items/items'
import { Toggle } from '@/components/ui/toggle'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'
import { cn } from '@/lib/utils'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface CheckCellProps {
    autoids: string[]
    complete: boolean
}

export const CheckCell = ({ autoids, complete }: CheckCellProps) => {
    const [isChecked, setIsChecked] = useState(complete)

    const [patchItemCuttingComplete, { isLoading }] =
        usePatchItemCuttingCompleteMutation()

    useEffect(() => {
        setIsChecked(complete)
    }, [complete])

    const isWorkerOrUser = useCurrentUserRole(['worker', 'client'])

    const successToast = (autoid: string) => {
        toast.success(`Cutting complete of ${autoid}`, {
            description: 'Updated successfully'
        })
    }

    const errorToast = (autoid: string, description: string) => {
        toast.error(`Cutting complete of ${autoid}`, {
            description
        })
    }

    const handlePatchSalesOrder = async (complete: boolean, autoid: string) => {
        try {
            await patchItemCuttingComplete({
                autoid,
                data: {
                    cutting_complete: complete
                }
            })
                .unwrap()
                .then(() => successToast(autoid))
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)

            const errorMessage = isErrorMessage
                ? error.data.detail
                : 'Something went wrong'

            errorToast(autoid, errorMessage)
        }
    }

    const onPressChanage = (checked: boolean) => {
        setIsChecked(checked)
        autoids.forEach((autoid) => handlePatchSalesOrder(checked, autoid))
    }

    return (
        <div className='mx-auto flex w-full justify-center'>
            {isWorkerOrUser ? (
                <div
                    className={cn(
                        'flex items-center',
                        isLoading && 'cursor-not-allowed opacity-50 grayscale'
                    )}
                >
                    <CheckCircle2 className='mr-1.5 h-4 w-4 flex-shrink-0 text-green-700' />
                    Yes
                </div>
            ) : (
                <Toggle
                    disabled={isLoading}
                    pressed={isChecked}
                    onPressedChange={onPressChanage}
                    className={cn(
                        'h-8 w-16 cursor-pointer data-[state=on]:border-green-600 data-[state=on]:bg-green-700/10',
                        isLoading && 'cursor-not-allowed opacity-50 grayscale'
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
