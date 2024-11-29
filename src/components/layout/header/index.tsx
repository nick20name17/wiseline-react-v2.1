import { SideBar } from './sidebar'
import { UserMenu } from './user-menu'

interface HeaderProps {
    title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
    <header className='relative border-b border-b-input'>
        <div className='py-5'>
            <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-x-6'>
                    <div className='flex items-center gap-x-2'>
                        <SideBar />
                    </div>
                    <h1 className='text-xl font-semibold text-secondary-foreground'>
                        {title}
                    </h1>
                </div>
                <UserMenu />
            </div>
        </div>
    </header>
)
