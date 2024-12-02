import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { EditUser } from '../actions/edit'
import { RemoveUser } from '../actions/remove'

import type { Roles, User } from '@/api/users/users.types'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const getRoleBadge = (role: Roles) => {
    const colors = {
        admin: 'text-yellow-500 border-yellow-500',
        worker: 'text-blue-500 border-blue-500',
        manager: 'text-green-500 border-green-500',
        client: 'text-orange-500 border-orange-500'
    } as const

    return (
        <Badge
            className={cn(colors[role])}
            variant='outline'
        >
            {role === 'client' ? 'View only' : role}
        </Badge>
    )
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Email'
            />
        ),
        size: 280
    },
    {
        accessorKey: 'first_name',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='First Name'
            />
        ),
        size: 280
    },
    {
        accessorKey: 'last_name',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Last Name'
            />
        ),
        size: 280
    },
    {
        accessorKey: 'role',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Role'
            />
        ),
        cell: ({ row }) => getRoleBadge(row.original.role),
        size: 96
    },
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title=''
            />
        ),
        cell: ({ row }) => (
            <div className='flex w-full items-center justify-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='mx-auto'
                        >
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='flex flex-col'
                        align='end'
                    >
                        <DropdownMenuItem asChild>
                            <RemoveUser user={row.original} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <EditUser user={row.original} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 48
    }
]
