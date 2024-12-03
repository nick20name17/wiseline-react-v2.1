import { Pagination } from '../../../controls/pagination'

interface TableFooterProps {
    isDataLoading: boolean
    isDataFetching: boolean
    pageCount: number
}

export const TableFooter = ({
    isDataLoading,
    isDataFetching,
    pageCount
}: TableFooterProps) => {
    return (
        <div
            className='flex h-14 items-center justify-between gap-3 py-2'
            id='order-pagination'
        >
            <Pagination
                pageCount={pageCount}
                isDataLoading={isDataLoading || isDataFetching}
            />
        </div>
    )
}
