export const tableConfig = {
    pagination: {
        pageSize: 20,
        pageIndex: 0
    },
    pageSizeOptions: [20, 40, 60, 80, 100]
}

export const trimOnlyColumns = [
    'gauge',
    'assigned',
    'release_to_production',
    'cutting_complete',
    'c_mfg',
    'on_hand'
]
export const alwaysVisibleColumns = [
    'flow',
    'status',
    'production_date',
    'priority',
    'select',
    'arrow'
]

export const alwayVisibleItemsColumns = ['flow', 'status', 'production_date', 'select']

export const alwaysVisibleOrdersColumns = [
    ...alwayVisibleItemsColumns,
    'priority',
    'arrow'
]

export const fixesColumns = ['flow', 'status', 'production_date']

export const shouldRenderCell = (
    columnId: string,
    category: string,
    isClientOrWorker: boolean,
    cellIndex: number
) => {
    return !isClientOrWorker || cellIndex !== 0
        ? !trimOnlyColumns.includes(columnId) || category === 'Trim'
        : false
}

export const tableAnimation = {
    exit: {
        opacity: 0
    },
    transition: { duration: 0.7, type: 'spring' }
}
