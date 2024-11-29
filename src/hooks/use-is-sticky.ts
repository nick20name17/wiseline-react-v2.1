import { useEffect, useState } from 'react'

export const useIsSticky = (ref: React.RefObject<HTMLElement>, offset: number = 0) => {
    const [isSticky, setIsSticky] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                setIsSticky(rect.top <= offset)
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [ref, offset])

    return isSticky
}
