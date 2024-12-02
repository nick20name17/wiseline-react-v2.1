import { ProfileMenu } from './profile-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface HeaderProps {
    title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
    <header className='relative border-b px-4'>
        <div className='py-4'>
            <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-x-6'>
                    <div className='flex items-center gap-x-2'>
                        <SidebarTrigger />
                    </div>
                    <h1 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
                        {title}
                    </h1>
                </div>
                <ProfileMenu />
            </div>
        </div>
    </header>
)
