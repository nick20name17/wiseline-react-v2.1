import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { routes } from "@/config/routes"
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks"
import { logout, selectUser } from "@/store/slices/auth"
import { getUpperCaseInitials } from "@/utils/get-uppercase-initials"
import { LogOut, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"

export const ProfileMenu = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

    const isAdmin = user?.role === 'admin'

    const userFullName = user?.first_name + ' ' + user?.last_name
    const initials = getUpperCaseInitials(userFullName)

    const handleLogout = () => {
       dispatch(logout())
    }

    return (

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
             <Button className="rounded-full focus-visible:ring-0 border border-muted-foreground" variant='ghost' size='icon'>
             <Avatar className="size-full rounded-full">
                  <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
                </Avatar>
             </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-44 rounded-lg"
              align="end"
              sideOffset={4}
            >
             <>
             <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-full">
                    <AvatarFallback className="rounded-full">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userFullName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

               <Link to={routes.userSettings}>
               <DropdownMenuItem>
                  <Settings />
                  User settings
                </DropdownMenuItem>
               </Link>
               {isAdmin ? (
                        <Link to={routes.companySettings}>
                            <DropdownMenuItem>
                                <Settings  />
                                <span>Company settings</span>
                            </DropdownMenuItem>
                        </Link>
                    ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
             </>
            </DropdownMenuContent>
          </DropdownMenu>

    )
  }
