import {
    Asterisk,
    Calendar,
    CircleUserRound,
    Cog,
    Gauge,
    Menu,
    MenuSquare,
    Package2,
    PackageIcon,
    Truck
} from 'lucide-react'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import logo from '@/assets/images/logo.svg'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandShortcut
} from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { isAdminRoute, routes } from '@/config/routes'
import { useCurrentUserRole } from '@/hooks'
import { cn } from '@/lib/utils'

const navigationItems = [
    {
        icon: MenuSquare,
        label: 'Orders',
        link: routes.main,
        soon: false
    },
    {
        icon: Cog,
        label: 'Flow Settings',
        link: routes.flowSettings,
        soon: false
    },
    {
        icon: CircleUserRound,
        label: 'Users',
        link: routes.users,
        soon: false
    },
    {
        icon: Calendar,
        label: 'Calendar',
        link: routes.calendar,
        soon: false
    },
    {
        icon: Asterisk,
        label: 'Priorities',
        link: routes.priorities,
        soon: false
    },
    {
        icon: Gauge,
        label: 'Dashboard',
        link: '/dashboard',
        soon: true
    },
    {
        icon: PackageIcon,
        label: 'Packaging',
        link: '/packaging',
        soon: true
    },
    {
        icon: Package2,
        label: 'Dispatch',
        link: '/dispatch',
        soon: true
    },
    {
        icon: Truck,
        label: 'Delivery',
        link: '/delivery',
        soon: true
    }
]

export const SideBar = () => {
    const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

    const locaiton = useLocation()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant='secondary'
                    size='icon'>
                    <Menu className='size-5' />
                </Button>
            </SheetTrigger>
            <SheetContent
                className='z-[1001] w-[300px]'
                side='left'>
                <SheetHeader>
                    <NavLink
                        to={{
                            pathname: routes.main,
                            search: locaiton.search
                        }}>
                        <SheetTitle asChild>
                            <div className='flex items-center gap-x-3 uppercase'>
                                <img
                                    src={logo}
                                    alt='Wiseline'
                                />
                                Wiseline
                            </div>
                        </SheetTitle>
                    </NavLink>
                </SheetHeader>

                <Separator className='my-4' />

                <Command>
                    <CommandList className='max-h-fit'>
                        <CommandGroup>
                            {navigationItems.map((item) =>
                                isClientOrWorker && isAdminRoute(item.link) ? null : (
                                    <CommandItem
                                        asChild
                                        key={item.label}
                                        className={cn(
                                            'mt-2 cursor-pointer',
                                            item.soon
                                                ? 'pointer-events-none text-muted-foreground'
                                                : ''
                                        )}>
                                        <NavLink
                                            className={cn(
                                                locaiton.pathname === item.link
                                                    ? 'bg-muted'
                                                    : ''
                                            )}
                                            to={{
                                                pathname: item.link,
                                                search:
                                                    locaiton.pathname === item.link
                                                        ? locaiton.search
                                                        : ''
                                            }}>
                                            {React.createElement(item.icon, {
                                                className: 'mr-2 w-4 h-4'
                                            })}
                                            <span>{item.label}</span>
                                            {item?.soon ? (
                                                <CommandShortcut>
                                                    <Badge
                                                        variant='outline'
                                                        className='pointer-events-none font-normal tracking-normal'>
                                                        Soon
                                                    </Badge>
                                                </CommandShortcut>
                                            ) : null}
                                        </NavLink>
                                    </CommandItem>
                                )
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </SheetContent>
        </Sheet>
    )
}
