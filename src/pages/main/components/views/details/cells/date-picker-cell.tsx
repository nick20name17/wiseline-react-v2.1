import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react'
import { animate } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Matcher } from 'react-day-picker'
import { toast } from 'sonner'
import { BooleanParam, useQueryParam } from 'use-query-params'

import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import { useAddItemMutation, usePatchItemMutation } from '@/api/items/items'
import type { ItemAddData, ItemPatchPayload } from '@/api/items/items.types'
import { useGetCompanyProfilesQuery } from '@/api/profiles/profiles'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'
import { cn } from '@/lib/utils'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface DatePickerCellProps {
    originItem: EBMSItemsData
}

export const getDateToastMessage = (
    date: string | null,
    scheduled: boolean | null | undefined
) => {
    const isEmptyDate = date === null

    if (isEmptyDate && scheduled === true) {
        return 'Production date has been reset. Line item moved to Unscheduled'
    }

    if (!isEmptyDate && scheduled === false) {
        return `Production date has been changed to ${date}. Line item moved to Scheduled`
    }

    if (isEmptyDate && scheduled === null) {
        return 'Production date has been reset'
    }

    return `Production date has been changed to ${date}`
}

export const DatePickerCell = ({ originItem }: DatePickerCellProps) => {
    const [isAnimate, setIsAnimate] = useState(false)
    const productionDate = originItem?.item?.production_date
        ? parseISO(originItem?.item?.production_date)
        : undefined

    const [date, setDate] = useState<Date | undefined>(productionDate)

    const [scheduled] = useQueryParam('scheduled', BooleanParam)

    const [open, setOpen] = useState(false)
    const [disabledDays, setDisabledDays] = useState<Matcher[]>([])

    const [patchItem] = usePatchItemMutation()
    const [addItem] = useAddItemMutation()

    const { data: companyProfiles } = useGetCompanyProfilesQuery()

    const close = () => setOpen(false)

    const itemId = originItem?.item?.id
    const orderId = originItem?.origin_order!

    const successToast = (date: string | null, itemId: number) => {
        const toastMessage = getDateToastMessage(date, scheduled)

        toast.success(`Item ${itemId}`, {
            description: toastMessage
        })
    }

    const errorToast = (message: string, itemId: number) =>
        toast.error(`Item ${itemId}`, {
            description: message
        })

    const handleAddItem = async (data: ItemAddData) => {
        try {
            await addItem(data)
                .unwrap()
                .then((data) => {
                    successToast(data.production_date!, data?.id)
                })
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(
                isErrorMessage ? error.data.detail : 'Something went wrong',
                itemId!
            )
        }
    }

    const handlePatchItem = async (data: ItemPatchPayload) => {
        try {
            await patchItem(data)
                .unwrap()
                .then(() => {
                    successToast(data.data.production_date!, itemId!)
                })
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(
                isErrorMessage ? error.data.detail : 'Something went wrong',
                itemId!
            )
        }
    }

    const handleSetDate = () => {
        const data = {
            production_date: format(date!, 'yyyy-MM-dd'),
            order: orderId
        }

        if (itemId) {
            handlePatchItem({
                id: itemId,
                data
            }).then(() => {
                // setIsAnimate(scheduled === true)
            })
        } else {
            handleAddItem({
                ...data,
                origin_item: originItem?.id!
            }).then(() => {
                setIsAnimate(!!scheduled)
            })
        }

        close()
    }

    const handleResetDate = () => {
        handlePatchItem({
            id: itemId!,
            data: {
                production_date: null,
                order: orderId
            }
        }).then(() => {
            setIsAnimate(!!scheduled)
        })

        setDate(undefined)
        close()
    }

    useEffect(() => {
        if (companyProfiles?.working_weekend) {
            setDisabledDays([{ dayOfWeek: [0, 6] }])
        }
    }, [companyProfiles?.working_weekend])

    // useEffect(() => {
    //     setDate(productionDate ? new Date(productionDate) : undefined)
    // }, [productionDate])

    useEffect(() => {
        const trHeaderElement = document?.getElementById('tr-header-' + originItem?.id)!
        const trElement = document?.getElementById('tr-' + originItem?.id)!

        if (isAnimate) {
            if (trHeaderElement) {
                animate(trHeaderElement, {})
            }
            if (trElement) {
                animate(trElement, {})
            }
        }
    }, [isAnimate])

    const isWorkerOrClient = useCurrentUserRole(['worker', 'client'])

    return isWorkerOrClient ? (
        <Button
            variant='ghost'
            className={cn(
                'pointer-events-none justify-start text-left font-normal',
                !date && 'text-muted-foreground'
            )}
        >
            <CalendarIcon className='flex-shrink-0' />

            {date ? format(date, 'dd.MM.yyyy EEE') : <span>Not selected</span>}
        </Button>
    ) : (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    disabled={originItem?.completed}
                    variant={'outline'}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className='flex-shrink-0' />
                    {date ? format(date, 'dd.MM.yyyy EEE') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    disabled={disabledDays}
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
                <div className='flex w-full items-center justify-start gap-x-3 p-3 pt-0'>
                    <Button
                        className='flex-1'
                        onClick={handleSetDate}
                    >
                        Set Date
                    </Button>
                    <Button
                        onClick={close}
                        className='flex-1'
                        variant='secondary'
                    >
                        Cancel
                    </Button>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                disabled={!productionDate}
                                onClick={handleResetDate}
                                size='icon'
                                variant='destructive'
                            >
                                <RotateCcw className='h-4 w-4 flex-shrink-0' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Reset date</span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </PopoverContent>
        </Popover>
    )
}

//
