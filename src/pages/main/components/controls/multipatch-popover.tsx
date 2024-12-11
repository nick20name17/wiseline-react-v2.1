import type { Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BooleanParam, useQueryParam } from 'use-query-params'

// import { DatePicker } from '@/components/ui/multipatch-date-picker'
import type { OrdersData } from '@/api/ebms/ebms.types'
import {
    useMultiPatchItemsMutation,
    useMultiPatchOrdersMutation
} from '@/api/multiupdates/multiupdate'
import type {
    MultiPatchItemsData,
    MultiPatchOrdersData
} from '@/api/multiupdates/multiupdate.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface MultipatchPopoverProps {
    table: Table<OrdersData>
}

export const MultipatchPopover = ({ table }: MultipatchPopoverProps) => {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date>()
    const [shipDate, setShipDate] = useState<Date>()
    const [flow, setFlow] = useState(-1)

    const selectedRows = table.getSelectedRowModel().rows
    const [currentRows, setCurrentRows] = useState(selectedRows)

    const orderItems = selectedRows.map((row) => row.original.origin_items).flat()
    const originItemsIds = orderItems.map((row) => row.id)

    const originOrdersIds = selectedRows.map((row) => row.original.id)
    const isSaveDisabled = flow === -1 && !date && !shipDate

    const handleRowReset = () => table.resetRowSelection()

    const [patchItems, { isLoading }] = useMultiPatchItemsMutation()
    const [patchOrders] = useMultiPatchOrdersMutation()

    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)

    const successToast = (
        date: string,
        isOrders: boolean = false,
        shipDate: string | null = null
    ) => {
        const message = (
            <span>
                {date && isOrders && scheduled === false ? (
                    <>
                        Order(s) move to <span className='font-semibold'>Scheduled</span>.
                        Production date ➝ <span className='font-semibold'>{date}</span>
                        {shipDate && (
                            <>
                                <br />
                                Ship date ➝{' '}
                                <span className='font-semibold'>{shipDate}</span>
                            </>
                        )}
                        <br />
                    </>
                ) : (
                    <>
                        Production date ➝ <span className='font-semibold'>{date}</span>
                        {shipDate && (
                            <>
                                <br />
                                Ship date ➝{' '}
                                <span className='font-semibold'>{shipDate}</span>
                            </>
                        )}
                        <br />
                    </>
                )}
            </span>
        )
        toast.success(
            `${isOrders ? originOrdersIds.length : originItemsIds.length} ${
                isOrders ? 'order' : 'item'
            }(s) updated`,
            {
                description: message
            }
        )
    }

    const errorToast = (message: string) =>
        toast.error('Something went wrong', {
            description: message
        })

    const handlePatchItem = async (date: string | null) => {
        const dataToPatch: MultiPatchItemsData = {
            origin_items: originItemsIds,
            production_date: date
        }

        try {
            await patchItems(dataToPatch)
                .unwrap()
                .then((response) =>
                    successToast(format(response.production_date!, 'yyyy-MM-dd'))
                )
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Unknown error')
        }
    }

    const handlePatchOrder = async (date: string | null, shipDate: string | null) => {
        const dataToPatch: MultiPatchOrdersData = {
            origin_orders: originOrdersIds,
            production_date: date!
        }

        if (shipDate) {
            dataToPatch.ship_date = shipDate
        }

        try {
            await patchOrders(dataToPatch)
                .unwrap()
                .then((response) =>
                    successToast(
                        format(response.production_date!, 'yyyy-MM-dd'),
                        true,
                        response?.ship_date!
                    )
                )
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Unknown error')
        }
    }

    const onClose = () => {
        setOpen(false)
        setFlow(-1)
        setDate(undefined)
        handleRowReset()
    }

    const onSave = () => {
        const dateToPatch = date ? format(date!, 'yyyy-MM-dd') : null
        const shipDateToPatch = shipDate ? format(shipDate!, 'yyyy-MM-dd') : null

        if (originItemsIds.length > 0 && dateToPatch) {
            handlePatchItem(dateToPatch)
        }

        onClose()

        handlePatchOrder(dateToPatch, shipDateToPatch)
    }

    useEffect(() => setOpen(originOrdersIds.length > 0), [originOrdersIds.length])
    useEffect(() => {
        if (JSON.stringify(selectedRows) !== JSON.stringify(currentRows)) {
            setCurrentRows(selectedRows)
        }
    }, [selectedRows])

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger className='fixed bottom-20 left-1/2 z-10 -translate-x-1/2'></PopoverTrigger>
            <PopoverContent className='w-96'>
                <div className='grid gap-4'>
                    <div className='space-y-2'>
                        <h4 className='flex items-center gap-x-2 font-medium leading-none'>
                            <Badge className='hover:bg-primary'>
                                {originOrdersIds.length}
                            </Badge>
                            Row(s) selected
                        </h4>
                    </div>

                    {completed ? (
                        <p className='text-sm text-gray-500'>
                            You can't update date for completed orders
                        </p>
                    ) : null}
                    <div className='flex items-center gap-x-3'>
                        <DatePicker
                            date={date}
                            setDate={setDate}
                            disabled={completed!}
                        />
                        <DatePicker
                            date={shipDate}
                            setDate={setShipDate}
                            disabled={completed!}
                            placeholder='Pick a ship date'
                        />
                    </div>
                    <div className='flex items-center justify-between gap-x-2'>
                        <Button
                            onClick={onSave}
                            className='flex-1'
                            disabled={isSaveDisabled}
                        >
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Save'
                            )}
                        </Button>
                        <Button
                            onClick={onClose}
                            className='flex-1'
                            variant='secondary'
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
