import { useEffect, useState } from 'react'

import type { EBMSItemsData, OrdersData } from '@/api/ebms/ebms.types'
import type { AccessToken } from '@/api/types/auth'
import { useQueryState } from 'nuqs'

interface OrdersWebSocket {
    endpoint: 'orders'
    currentData: OrdersData[]
    refetch: () => void
}

interface ItemsWebSocket {
    endpoint: 'items'
    currentData: EBMSItemsData[]
    refetch: () => void
}

type UseWebsocketProps = OrdersWebSocket | ItemsWebSocket

export const useWebSocket = <T extends UseWebsocketProps>({
    currentData,
    refetch,
    endpoint
}: T) => {
    const [dataToRender, setDataToRender] = useState<(OrdersData | EBMSItemsData)[]>(
        currentData || []
    )
    const [category] = useQueryState('category')

    useEffect(() => {
        setDataToRender(currentData || [])
    }, [currentData])

    useEffect(() => {
        const tokenStr =
            localStorage.getItem('token') || sessionStorage.getItem('token') || ''
        const token = JSON.parse(tokenStr) as AccessToken
        const websocket = new WebSocket(
            `wss://api.wiseline.app/ws/${endpoint}/`,
            token.access
        )

        const handleWebSocketMessage = (event: MessageEvent) => {
            const dataToPatch = JSON.parse(event.data) as OrdersData | EBMSItemsData
            refetch()

            setDataToRender((prevData) => {
                return prevData.map((item) => {
                    if (item.id === dataToPatch.id) {
                        if (endpoint === 'orders') {
                            return {
                                ...dataToPatch,
                                origin_items:
                                    category && category !== 'All'
                                        ? (
                                              dataToPatch as OrdersData
                                          ).origin_items?.filter(
                                              (item) => item?.category === category
                                          )
                                        : (dataToPatch as OrdersData).origin_items
                            }
                        }
                        return dataToPatch
                    }
                    return item
                })
            })
        }

        websocket.addEventListener('message', handleWebSocketMessage)

        return () => {
            websocket.removeEventListener('message', handleWebSocketMessage)
            websocket.close()
        }
    }, [endpoint, refetch, category])

    return {
        dataToRender
    } as T extends { endpoint: 'orders' }
        ? { dataToRender: OrdersData[] }
        : { dataToRender: EBMSItemsData[] }
}