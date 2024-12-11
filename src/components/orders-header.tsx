import { OrdersViewTabs } from './orders-view-tabs'
import { SidebarTrigger } from './ui/sidebar'
import { ProfileMenu } from '@/components/profile-menu'

export const OrdersHeader = () => {
    return (
        <header
            className='relative flex items-center justify-between gap-6 py-4'
            id='order-header'
        >
            <div className='flex items-center gap-x-6'>
                <SidebarTrigger />
                <OrdersViewTabs />
            </div>

            <ProfileMenu />
        </header>
    )
}
