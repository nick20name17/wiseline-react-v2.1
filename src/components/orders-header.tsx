import { OrdersViewTabs } from './orders-view-tabs'
import { AppSidebar } from '@/components/app-sidebar'
import { ProfileMenu } from '@/components/profile-menu'

export const OrdersHeader = () => {
    return (
        <header
            className='relative flex items-center justify-between gap-6 pb-2 pt-4'
            id='order-header'
        >
            <div className='flex items-center gap-x-6'>
                <AppSidebar />
                <OrdersViewTabs />
            </div>

            <ProfileMenu />
        </header>
    )
}
