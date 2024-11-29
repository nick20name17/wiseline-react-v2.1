import { useEffect, useState } from 'react'

interface UseTableScrollProps {
    tableRef: React.RefObject<HTMLTableElement>
    enableScroll?: boolean
    isCuttingView?: boolean
}

export const useTableScroll = ({
    tableRef,
    enableScroll,
    isCuttingView = false
}: UseTableScrollProps) => {
    const [tableHeight, setTableHeight] = useState<number>(window.innerHeight)

    useEffect(() => {
        const headerElement = document.querySelector('#order-header')
        const statusesElement = document.querySelector('#order-statuses')
        const paginationElement = document.querySelector('#order-pagination')
        const cuttingViewControls = document.querySelector('#cutting-view-controls')

        const handleResize = () => {
            const headerHeight = headerElement?.clientHeight || 0
            const statusesHeight = statusesElement?.clientHeight || 0
            const paginationHeight = paginationElement?.clientHeight || 0
            const cuttingViewControlsHeight = cuttingViewControls?.clientHeight || 0

            setTableHeight(
                isCuttingView
                    ? window.innerHeight -
                          headerHeight -
                          paginationHeight -
                          cuttingViewControlsHeight -
                          15
                    : window.innerHeight -
                          headerHeight -
                          statusesHeight -
                          paginationHeight -
                          15
            )
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        if (tableRef?.current && enableScroll) {
            tableRef.current.style.height = `${tableHeight}px`
            tableRef.current.style.overflowY = 'auto'
        } else if (tableRef?.current && !enableScroll) {
            tableRef.current.style.height = 'auto'
            tableRef.current.style.overflowY = 'unset'
        }

        return () => window.removeEventListener('resize', handleResize)
    }, [tableRef, tableHeight, enableScroll])
}
