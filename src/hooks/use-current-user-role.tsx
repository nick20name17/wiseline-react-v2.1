import type { Roles } from '@/api/users/users.types'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectUserRole } from '@/store/slices/auth'

export const useCurrentUserRole = (role: Roles | Roles[]) => {
    const currentRole = useAppSelector(selectUserRole)!
    return Array.isArray(role) ? role.includes(currentRole) : role === currentRole
}
