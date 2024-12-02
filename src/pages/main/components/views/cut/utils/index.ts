import type { Column, Row } from '@tanstack/react-table'

import type { MergedCuttingItem } from '../table/table'

import { cn } from '@/lib/utils'
import type { CuttingItem } from '@/store/api/ebms/cutting/cutting.types'

export const groupByPriority = (
    data: Row<MergedCuttingItem>[]
): {
    priority: string
    cuttingItems: Row<MergedCuttingItem>[]
}[] => {
    const groupedData: { [key: string]: Row<MergedCuttingItem>[] } = {}

    data.forEach((item) => {
        if (!groupedData[item.original.priority_name]) {
            groupedData[item.original.priority_name] = []
        }
        groupedData[item.original.priority_name].push(item)
    })

    return Object.keys(groupedData).map((priority) => ({
        priority,
        cuttingItems: groupedData[priority]
    }))
}

export const groupByGauge = (
    data: Row<MergedCuttingItem>[]
): {
    gauge: string
    cuttingItems: Row<MergedCuttingItem>[]
}[] => {
    const groupedData: { [key: string]: Row<MergedCuttingItem>[] } = {}

    data.forEach((item) => {
        if (!groupedData[item.original.gauge]) {
            groupedData[item.original.gauge] = []
        }
        groupedData[item.original.gauge].push(item)
    })

    return Object.keys(groupedData).map((gauge) => ({
        gauge,
        cuttingItems: groupedData[gauge]
    }))
}

export const groupBy = <T>(array: T[], keyPath: string): { [key: string]: T[] } => {
    const getNestedValue = (obj: any, keyPath: string) => {
        return keyPath.split('.').reduce((value, key) => value?.[key], obj)
    }

    return array.reduce(
        (result, currentValue) => {
            const groupKey = getNestedValue(currentValue, keyPath)
            if (!result[groupKey]) {
                result[groupKey] = []
            }
            result[groupKey].push(currentValue)
            return result
        },
        {} as { [key: string]: T[] }
    )
}

export const mergeItems = (data: CuttingItem[]) => {
    const result = []

    const itemMap = data.reduce((map: any, item) => {
        const {
            gauge,
            color,
            size,
            autoid,
            quantity,
            flow_name,
            production_date,
            priority_name,
            cutting_complete,
            length
        } = item
        const key = `${gauge}_${color}_${size}_${production_date}_${priority_name}_${cutting_complete}_${length}`

        if (!map[key]) {
            map[key] = {
                ...item,
                autoids: [autoid],
                quantity: quantity,
                flow_names: { [flow_name]: quantity }
            }
        } else {
            map[key].quantity += quantity
            map[key].autoids.push(autoid)
            if (!map[key].flow_names[flow_name]) {
                map[key].flow_names[flow_name] = 0
            }
            map[key].flow_names[flow_name] += quantity
        }

        return map
    }, {})

    for (const key in itemMap) {
        const { autoid, flow_name, ...rest } = itemMap[key]
        result.push(rest)
    }

    return result
}

export const getCommonPinningStyles = <T>(column: Column<T>) => {
    const isPinned = column.getIsPinned()

    return cn({
        'sticky top-0 bg-secondary dark:bg-background z-10': isPinned,
        'right-0 border-l border-border': isPinned === 'right',
        'left-0 border-r border-border': isPinned === 'left',
        relative: !isPinned
    })
}
