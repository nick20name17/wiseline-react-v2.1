import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar"
import { isAdminRoute, routes } from "@/config/routes"
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"

import { useCurrentUserRole } from "@/hooks/use-current-user-role"
import { cn } from "@/lib/utils"
import {
    Asterisk,
    Calendar,
    CircleUserRound,
    Cog,
    Gauge,
    MenuSquare,
    Package2,
    PackageIcon,
    Truck
} from 'lucide-react'
import { NavLink, useLocation } from "react-router-dom"
import { badgeVariants } from "./ui/badge"

const navItems = [
    {
        icon: MenuSquare,
        title: 'Orders',
        url: routes.main,
        soon: false
    },
    {
        icon: Cog,
        title: 'Flow Settings',
        url: routes.flowSettings,
        soon: false
    },
    {
        icon: CircleUserRound,
        title: 'Users',
        url: routes.users,
        soon: false
    },
    {
        icon: Calendar,
        title: 'Calendar',
        url: routes.calendar,
        soon: false
    },
    {
        icon: Asterisk,
        title: 'Priorities',
        url: routes.priorities,
        soon: false
    },
    {
        icon: Gauge,
        title: 'Dashboard',
        url: '/dashboard',
        soon: true
    },
    {
        icon: PackageIcon,
        title: 'Packaging',
        url: '/packaging',
        soon: true
    },
    {
        icon: Package2,
        title: 'Dispatch',
        url: '/dispatch',
        soon: true
    },
    {
        icon: Truck,
        title: 'Delivery',
        url: '/delivery',
        soon: true
    }
]


export const AppSidebar = () => {
    const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

    const { pathname } = useLocation()
    const { setOpenMobile } = useSidebar()

    return (
        <Sidebar>
            <AppSidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((navItem) => isClientOrWorker && isAdminRoute(navItem.url) ? null : (
                                <SidebarMenuItem aria-disabled={navItem.soon} key={navItem.title}>
                                    <SidebarMenuButton onClick={() => setOpenMobile(false)} aria-disabled={navItem.soon} disabled={navItem.soon} isActive={pathname === navItem.url} asChild>
                                        <NavLink to={navItem.url}>
                                            <navItem.icon />
                                            <span>{navItem.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                    {
                                        navItem.soon ? <SidebarMenuBadge className={cn(badgeVariants({ variant: 'outline' }))}>Soon</SidebarMenuBadge> : null
                                    }
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}


export const AppSidebarHeader = () => {
    const { setOpenMobile } = useSidebar()
    const { search } = useLocation()
    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger onClick={() => setOpenMobile(false)} asChild>
                            <NavLink to={{
                                pathname: routes.main,
                                search
                            }}>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <img src="/logo.svg" alt="Wiseline" className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">Wiseline</span>
                                        <span className="text-xs">Production management</span>
                                    </div>
                                </SidebarMenuButton>
                            </NavLink>
                        </DropdownMenuTrigger>

                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

    )
}
