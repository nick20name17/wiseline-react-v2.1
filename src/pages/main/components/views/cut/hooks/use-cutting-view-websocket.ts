import { useEffect, useState } from 'react'

import type { CuttingItem } from '@/store/api/ebms/cutting/cutting.types'
import type { AccessToken } from '@/types/auth'

interface CuttingItemsWebSocket {
    currentData: CuttingItem[]
    refetch: () => void
}

export const useCuttingItemsWebSocket = ({
    currentData,
    refetch
}: CuttingItemsWebSocket) => {
    const [dataToRender, setDataToRender] = useState<CuttingItem[]>(currentData || [])

    useEffect(() => {
        setDataToRender(currentData || [])
    }, [currentData])

    const token = JSON.parse(
        localStorage.getItem('token') || sessionStorage.getItem('token') || ''
    ) as AccessToken

    useEffect(() => {
        const websocket = new WebSocket(
            'wss://api.wiseline.app/ws/cutting-view/',
            token.access
        )

        websocket.addEventListener('message', (event) => {
            const dataToPatch = JSON.parse(event.data) as CuttingItem

            refetch()
            setDataToRender((prevData) => {
                const newData = prevData.map((item) => {
                    if (item.autoid === dataToPatch.autoid) {
                        return dataToPatch
                    } else {
                        return item
                    }
                })
                return newData
            })
        })

        return () => {
            websocket.close()
            websocket.removeEventListener('message', () => {})
        }
    }, [])

    return {
        dataToRender
    }
}
