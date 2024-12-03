import { toast } from 'sonner'

import {
    useAddCompanyProfilesMutation,
    useGetCompanyProfilesQuery
} from '@/api/profiles/profiles'
import type { CompanyProfileData } from '@/api/profiles/profiles.types'
import { Header } from '@/components/header'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

const errorToast = (description: string) =>
    toast.error('Change Password', { description })

export const CompanySettingsPage = () => {
    const isAdmin = useCurrentUserRole('admin')
    const { data, isLoading } = useGetCompanyProfilesQuery()
    const [addCompanyProfiles] = useAddCompanyProfilesMutation()

    const handleAddCompanyProfiles = async (newData: CompanyProfileData) => {
        try {
            await addCompanyProfiles(newData).unwrap()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onCheckedChange = (checked: boolean) => {
        handleAddCompanyProfiles({ working_weekend: checked })
    }

    return (
        <>
            <Header title='Company Settings' />
            <section className='mx-auto mt-8 max-w-[1120px] px-4'>
                <div className='mx-auto flex w-64 items-center justify-between gap-x-4 rounded-md border bg-muted/40 p-4'>
                    <Label htmlFor='working_weekend'>Working weekend</Label>
                    <Switch
                        disabled={!isAdmin || isLoading}
                        checked={data?.working_weekend ?? false}
                        onCheckedChange={onCheckedChange}
                        id='working_weekend'
                    />
                </div>
            </section>
        </>
    )
}
