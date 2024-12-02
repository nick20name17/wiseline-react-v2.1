import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react'
import { animate } from 'motion/react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import type { Matcher } from 'react-day-picker'
import { toast } from 'sonner'
import { BooleanParam, useQueryParam } from 'use-query-params'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { useCurrentUserRole } from '@/hooks'
import { cn } from '@/lib/utils'
import type { OrdersData } from '@/store/api/ebms/ebms.types'
import { useMultiPatchItemsMutation } from '@/store/api/multiupdates/multiupdate'
import { useGetCompanyProfilesQuery } from '@/store/api/profiles/profiles'
import {
    useAddSalesOrderMutation,
    usePatchSalesOrderMutation
} from '@/store/api/sales-orders/sales-orders'
import type {
    SalesOrdersAddData,
    SalesOrdersPatchData
} from '@/store/api/sales-orders/sales-orders.types'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface DatePickerCellProps {
    order: OrdersData
}

export const getDateToastMessage = (
    date: string | null,
    scheduled: boolean | null | undefined
) => {
    const isEmptyDate = date === null

    if (isEmptyDate && scheduled === true) {
        return 'Production date has been reset. Order moved to Unscheduled'
    }

    if (!isEmptyDate && scheduled === false) {
        return `Production date has been changed to ${format(date, 'MM/dd/yy EEE')}. Order moved to Scheduled`
    }

    if (isEmptyDate && scheduled === undefined) {
        return 'Production date has been reset'
    }

    return `Production date has been changed to ${format(date || '', 'MM/dd/yy EEE')}`
}

export const DatePickerCell: React.FC<DatePickerCellProps> = ({ order }) => {
    const productionDate = order.sales_order?.production_date
        ? parseISO(order.sales_order?.production_date)
        : undefined

    const [date, setDate] = useState<Date | undefined>(productionDate)

    const [isAnimate, setIsAnimate] = useState(false)

    const salesOrderId = order.sales_order?.id
    const orderId = order.id

    const [scheduled] = useQueryParam('scheduled', BooleanParam)

    const [open, setOpen] = useState(false)

    const { data: companyProfiles } = useGetCompanyProfilesQuery()

    const [patchSalesOrder] = usePatchSalesOrderMutation()
    const [addSalesOrder] = useAddSalesOrderMutation()
    const [patchItems] = useMultiPatchItemsMutation()

    const close = () => setOpen(false)

    const successToast = (date: string | null, orderId: string) => {
        const toastMessage = getDateToastMessage(date, scheduled)

        toast.success(`Order ${orderId}`, {
            description: toastMessage
        })
    }

    const errorToast = (description: string, orderId: string) =>
        toast.error(`Order ${orderId}`, {
            description
        })

    const handlePatchSalesOrder = async (data: SalesOrdersPatchData) => {
        try {
            await patchSalesOrder(data)
                .unwrap()
                .then(() => successToast(data.data.production_date!, orderId))
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(
                isErrorMessage ? error.data.detail : 'Something went wrong',
                orderId
            )
        }
    }

    const handleAddSalesOrder = async (data: Partial<SalesOrdersAddData>) => {
        try {
            await addSalesOrder(data)
                .unwrap()
                .then(() => successToast(data.production_date!, orderId))
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)

            errorToast(
                isErrorMessage ? error.data.detail : 'Something went wrong',
                orderId
            )
        }
    }

    const handleSetDate = () => {
        const productionDate = format(date!, 'yyyy-MM-dd')

        const data = {
            production_date: productionDate,
            order: orderId
        }

        if (!salesOrderId) {
            handleAddSalesOrder(data).then(() => {
                setIsAnimate(!!scheduled)
            })
        } else {
            handlePatchSalesOrder({
                id: salesOrderId!,
                data
            }).then(() => {
                // setIsAnimate(scheduled === undefined ? false : true)
            })
        }

        if (order.origin_items.length > 0) {
            patchItems({
                origin_items: order.origin_items.map((item) => item.id),
                production_date: productionDate
            }).then(() =>
                toast.success(`Line items of Order ${orderId}`, {
                    description:
                        'Production date has been changed to ' +
                        format(date!, 'MM/dd/yy EEE')
                })
            )
        }

        close()
    }

    const handleResetDate = () => {
        handlePatchSalesOrder({
            id: salesOrderId!,
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

    const [disabledDays, setDisabledDays] = useState<Matcher[]>([])

    useEffect(() => {
        if (!companyProfiles?.working_weekend) {
            setDisabledDays([{ dayOfWeek: [0, 6] }])
        }
    }, [companyProfiles?.working_weekend])

    // useEffect(() => {
    //     setDate(productionDate)
    // }, [productionDate, order?.id])

    const isWorkerOrClient = useCurrentUserRole(['worker', 'client'])

    useEffect(() => {
        const trHeaderElement = document?.getElementById('tr-header-' + order?.id)!
        const trElement = document?.getElementById('tr-' + order?.id)!

        if (isAnimate) {
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
    }, [isAnimate])

    return isWorkerOrClient ? (
        <Button
            variant='ghost'
            className={cn(
                'pointer-events-none w-full justify-start px-2 text-left font-normal',
                !date && 'text-muted-foreground'
            )}
        >
            <CalendarIcon className='mr-2 size-3 flex-shrink-0' />

            {date ? format(date, 'MM/dd/yy EEE') : <span>Not selected</span>}
        </Button>
    ) : (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    disabled={order?.completed}
                    variant='outline'
                    className={cn(
                        'w-full justify-start px-2 text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className='mr-2 size-3 flex-shrink-0' />
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
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    disabled={!productionDate}
                                    onClick={handleResetDate}
                                    size='icon'
                                    variant='destructive'
                                >
                                    <RotateCcw className='h-4 w-4' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Reset date</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </PopoverContent>
        </Popover>
    )
}
