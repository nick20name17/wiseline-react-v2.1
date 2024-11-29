import { OrdersViewTabs } from './orders-view-tabs'
import { SideBar } from './sidebar'
import { UserMenu } from './user-menu'

export const OrdersHeader = () => {
    return (
        <header
            className='relative'
            id='order-header'>
            <div className='flex h-20 items-center justify-between gap-6'>
                <div className='flex items-center gap-x-6'>
                    <SideBar />
                    <OrdersViewTabs />
                </div>

                <div className='flex items-center gap-x-6'>
                    {/* <WeekFilters /> */}
                    <UserMenu />
                </div>
            </div>
        </header>
    )
}
