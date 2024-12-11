import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Matcher } from 'react-day-picker'
import { toast } from 'sonner'
import { BooleanParam, useQueryParam } from 'use-query-params'

import { usePatchEBMSOrdersMutation } from '@/api/ebms/ebms'
import type { EBMSOrdersPatchPayload, OrdersData } from '@/api/ebms/ebms.types'
import { useGetCompanyProfilesQuery } from '@/api/profiles/profiles'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'
import { cn } from '@/lib/utils'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface ShipDatePickerCellProps {
    order: OrdersData
}
export const ShipDatePickerCell = ({ order }: ShipDatePickerCellProps) => {
    const orderId = order?.id
    const shipDate = order?.ship_date ? parseISO(order?.ship_date) : undefined

    const [date, setDate] = useState<Date | undefined>(shipDate)

    const [scheduled] = useQueryParam('scheduled', BooleanParam)

    const [open, setOpen] = useState(false)
    const [disabledDays, setDisabledDays] = useState<Matcher[]>([])

    const close = () => setOpen(false)

    const [patchEBMSOrders] = usePatchEBMSOrdersMutation()

    const { data: companyProfiles } = useGetCompanyProfilesQuery()

    const successToast = (date: string | null, orderId: string) => {
        const isDateNull = date === null

        const dateMessage = isDateNull
            ? 'Ship date has been reset'
            : `Ship date has been changed to ${date}`

        const scheduledDescription = !isDateNull
            ? dateMessage
            : 'Ship date has been reset.'

        const unscheduledDescription = isDateNull
            ? dateMessage
            : `Ship date has been ${!!date ? 'updated' : 'added'}.`

        const description = scheduled ? scheduledDescription : unscheduledDescription

        toast.success(`Order ${orderId}`, { description })
    }

    const errorToast = (description: string, orderId: string) =>
        toast.error(`Order ${orderId} ship date`, {
            description
        })

    const handlePatchSalesOrder = async (data: EBMSOrdersPatchPayload) => {
        try {
            await patchEBMSOrders(data)
                .unwrap()
                .then(() => successToast(data.data.ship_date!, orderId))
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(
                isErrorMessage ? error?.data?.detail : 'Something went wrong',
                orderId
            )
        }
    }

    const handleSetDate = () => {
        handlePatchSalesOrder({
            id: orderId!,
            data: {
                ship_date: format(date!, 'yyyy-MM-dd')
            }
        })

        close()
    }

    useEffect(() => {
        if (!companyProfiles?.working_weekend) {
            setDisabledDays([{ dayOfWeek: [0, 6] }])
        }
    }, [companyProfiles?.working_weekend])

    // useEffect(() => {
    //     setDate(shipDate ? new Date(shipDate) : undefined)
    // }, [shipDate, orderId])

    const isWorkerOrClient = useCurrentUserRole(['worker', 'client'])

    return isWorkerOrClient ? (
        <Button
            variant='ghost'
            className={cn(
                'pointer-events-none w-full justify-start text-left font-normal',
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
                    disabled={order?.completed}
                    variant='outline'
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
                </div>
            </PopoverContent>
        </Popover>
    )
}
