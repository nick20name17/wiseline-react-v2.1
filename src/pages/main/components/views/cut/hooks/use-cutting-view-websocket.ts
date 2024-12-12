import { useCallback, useEffect, useState } from 'react'

import type { CuttingItem } from '@/api/ebms/cutting/cutting.types'
import type { AccessToken } from '@/api/types/auth'

interface CuttingItemsWebSocket {
    currentData: CuttingItem[]
    refetch: () => void
}

export const useCuttingItemsWebSocket = ({
    currentData,
    refetch
}: CuttingItemsWebSocket) => {
    const [dataToRender, setDataToRender] = useState<CuttingItem[]>(currentData || [])

    const stableRefetch = useCallback(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        if (JSON.stringify(dataToRender) !== JSON.stringify(currentData)) {
            setDataToRender(currentData || [])
        }
    }, [currentData, dataToRender])

    useEffect(() => {
        const tokenStr =
            localStorage.getItem('token') || sessionStorage.getItem('token') || ''
        const token = JSON.parse(tokenStr) as AccessToken

        const websocket = new WebSocket(
            'wss://api.wiseline.app/ws/cutting-view/',
            token.access
        )

        const handleWebSocketMessage = (event: MessageEvent) => {
            const dataToPatch = JSON.parse(event.data) as CuttingItem

            setDataToRender((prevData) =>
                prevData.map((item) =>
                    item.autoid === dataToPatch.autoid ? dataToPatch : item
                )
            )

            stableRefetch()
        }

        websocket.addEventListener('message', handleWebSocketMessage)

        return () => {
            websocket.removeEventListener('message', handleWebSocketMessage)
            websocket.close()
        }
    }, [stableRefetch])

    return {
        dataToRender
    }
}
