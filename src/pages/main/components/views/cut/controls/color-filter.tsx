import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useGetColorsQuery } from '@/store/api/ebms/cutting/cutting'

export const Colorfilter = () => {
    const [colorParam, setColorParam] = useQueryParam('color', StringParam)
    const [open, setOpen] = useState(false)
    const [view] = useQueryParam('view', StringParam)
    const [, setOffset] = useQueryParam('offset', NumberParam)

    const { data: colorsData, isLoading } = useGetColorsQuery()

    const colors = [
        { value: 'all', label: 'All colors' },
        ...(colorsData?.values?.map((color) => ({
            value: color,
            label: color
        })) || [])
    ]

    useEffect(() => {
        if (view === 'pipeline') {
            setColorParam('all')
        }
    }, [view])

    useEffect(() => {
        setColorParam(colorParam || 'all')
    }, [colorParam])

    useEffect(() => {
        return () => {
            setColorParam(null)
        }
    }, [])

    const handleSelect = (currentValue: string) => {
        setColorParam(currentValue)
        setOpen(false)
        setOffset(0)
    }

    if (isLoading) return <Skeleton className='h-9 w-[200px]' />

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    disabled={isLoading || colorsData?.values?.length === 0}
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className={cn(
                        'w-[200px] justify-between',
                        colorParam !== 'all' && colorParam !== ''
                            ? 'border-primary text-primary hover:bg-transparent hover:text-primary'
                            : ''
                    )}
                >
                    {colorParam
                        ? colors?.find((color) => color?.value === colorParam)?.label
                        : 'Select color...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput placeholder='Search color' />
                    <CommandList>
                        <CommandEmpty>No color found.</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className='max-h-[300px] overflow-y-auto'>
                                {colors?.map((color) => (
                                    <CommandItem
                                        key={color?.value}
                                        value={color?.value}
                                        onSelect={() => handleSelect(color?.value)}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                colorParam === color?.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {color.label}
                                    </CommandItem>
                                ))}
                            </ScrollArea>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
