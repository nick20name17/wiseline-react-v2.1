import { AppSidebar } from '@/components/app-sidebar'
import { ProfileMenu } from '@/components/profile-menu'
import { OrdersViewTabs } from './orders-view-tabs'


export const OrdersHeader = () => {
    return (
        <header
            className='relative'
            id='order-header'>
            <div className='flex h-20 items-center justify-between gap-6'>
                <div className='flex items-center gap-x-6'>
                    <AppSidebar />
                    <OrdersViewTabs />
                </div>

                {/* <div className='flex items-center gap-x-6'> */}
                {/* <WeekFilters /> */}
                <ProfileMenu />
                {/* </div> */}
            </div>
        </header>
    )
}
