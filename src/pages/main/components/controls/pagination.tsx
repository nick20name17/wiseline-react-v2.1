import { ArrowLeft, ArrowRight, SkipBack, SkipForward } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { tableConfig } from '@/config/table'

interface PaginationProps {
    pageCount: number
    isDataLoading: boolean
}

export const Pagination = ({ pageCount, isDataLoading }: PaginationProps) => {
    const [offset, setOffset] = useQueryState('offset', {
        parse: Number,
        // clearOnDefault: false,
        defaultValue: tableConfig.pagination.pageIndex * tableConfig.pagination.pageSize
    })
    const [limit, setLimit] = useQueryState('limit', {
        parse: Number,
        // clearOnDefault: false,
        defaultValue: tableConfig.pagination.pageSize
    })

    const currentPage = Math.floor(offset / limit) + 1

    const handlePageChange = (newPage: number) => {
        const newOffset = (newPage - 1) * limit
        setOffset(newOffset)
    }

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setOffset(0)
    }

    useEffect(() => {
        if (!offset) {
            setOffset(offset)
        }

        if (!limit) {
            setLimit(limit)
        }
    }, [])

    return (
        <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-2'>
                <p className='text-sm font-medium'>Rows per page</p>
                <Select
                    disabled={pageCount === 0 || isDataLoading}
                    value={`${limit}`}
                    onValueChange={(value) => handleLimitChange(Number(value))}
                >
                    <SelectTrigger className='h-8 w-[70px]'>
                        <SelectValue placeholder={`${limit}`} />
                    </SelectTrigger>
                    <SelectContent side='top'>
                        {tableConfig.pageSizeOptions.map((pageSize) => (
                            <SelectItem
                                key={pageSize}
                                value={`${pageSize}`}
                            >
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='flex items-center gap-4'>
                <div className='flex w-[105px] items-center justify-center text-left text-sm font-medium'>
                    Page {currentPage} of {pageCount}
                </div>

                <div className='flex items-center space-x-2'>
                    <Button
                        variant='outline'
                        className='flex h-8 w-8 p-0'
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1 || isDataLoading}
                    >
                        <span className='sr-only'>Go to first page</span>
                        <SkipBack className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='h-8 w-8 p-0'
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isDataLoading}
                    >
                        <span className='sr-only'>Go to previous page</span>
                        <ArrowLeft className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='h-8 w-8 p-0'
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pageCount || isDataLoading}
                    >
                        <span className='sr-only'>Go to next page</span>
                        <ArrowRight className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='flex h-8 w-8 p-0'
                        onClick={() => handlePageChange(pageCount)}
                        disabled={currentPage === pageCount || isDataLoading}
                    >
                        <span className='sr-only'>Go to last page</span>
                        <SkipForward className='h-4 w-4' />
                    </Button>
                </div>
            </div>
        </div>
    )
}
