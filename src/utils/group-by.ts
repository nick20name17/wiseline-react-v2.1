import { parseISO } from 'date-fns'

type KeyFinder<T> = ((item: T) => string) | keyof T | string

type Grouped<T> = Array<[string, T[]]>

const getNestedValue = <T>(obj: T, path: string): any => {
    const keys = path.split('.')
    let current = obj
    for (const key of keys) {
        if (current == null) return undefined
        current = (current as any)[key]
    }
    return current
}

export const groupBy = <T>(values: T[], keyFinder: KeyFinder<T>): Grouped<T> => {
    const groupedObj = new Map<string, T[]>()

    for (const item of values) {
        let key: string
        if (typeof keyFinder === 'function') {
            key = keyFinder(item)
        } else if (typeof keyFinder === 'string') {
            key = getNestedValue(item, keyFinder)
        } else {
            key = String(item[keyFinder as keyof T])
        }

        const group = groupedObj.get(key)
        if (group) {
            group.push(item)
        } else {
            groupedObj.set(key, [item])
        }
    }

    return Array.from(groupedObj.entries())
}

const isISODate = (value: string): boolean => {
    const parsedDate = Date.parse(value)
    return !isNaN(parsedDate) && value === new Date(parsedDate).toISOString()
}

export const groupByDate = <T>(values: T[], keyFinder: KeyFinder<T>): Grouped<T> => {
    const groupedObj = new Map<string, T[]>()

    for (const item of values) {
        let key: string | Date
        if (typeof keyFinder === 'function') {
            key = keyFinder(item)
        } else if (typeof keyFinder === 'string') {
            key = getNestedValue(item, keyFinder)
        } else {
            key = String(item[keyFinder as keyof T])
        }

        if (typeof key === 'string' && isISODate(key)) {
            key = parseISO(key).toISOString() // Normalize to ISO format
        }

        const keyString = key instanceof Date ? key.toISOString() : String(key)
        const group = groupedObj.get(keyString)
        if (group) {
            group.push(item)
        } else {
            groupedObj.set(keyString, [item])
        }
    }

    return Array.from(groupedObj.entries())
}
