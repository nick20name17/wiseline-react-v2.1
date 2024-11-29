import { useLayoutEffect, useState } from 'react'

interface MediaQueryValues {
    isMobile: boolean
    isTablet: boolean
    isMedium: boolean
    isDesktop: boolean
}

const queries = [
    '(max-width: 500px)',
    '(max-width: 768px)',
    '(max-width: 980px)',
    '(max-width: 1200px)'
]

export const useMatchMedia = () => {
    const mediaQueryLists = queries.map((query) => window.matchMedia(query))

    const getValues = () => mediaQueryLists.map((list) => list.matches)

    const [values, setValues] = useState<boolean[]>(getValues)

    useLayoutEffect(() => {
        const handler = () => setValues(getValues)

        mediaQueryLists.forEach((list) => list.addEventListener('change', handler))

        return () =>
            mediaQueryLists.forEach((list) => list.removeEventListener('change', handler))
    }, [])

    const mediaQueryValues: MediaQueryValues = {
        isMobile: values[0],
        isTablet: values[1],
        isMedium: values[2],
        isDesktop: values[3]
    }

    return mediaQueryValues
}
