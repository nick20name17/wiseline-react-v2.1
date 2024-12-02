import { toast } from 'sonner'

import { PasswordChange } from './components/password-change'
import { UserSettingsForms } from './components/user-settings-forms'
import { useRemoveUserProfilesMutation } from '@/api/profiles/profiles'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

export const UserSettingsPage = () => {
    const [removeUserProfiles, { isLoading }] = useRemoveUserProfilesMutation()

    const successToast = () =>
        toast.success(`Account settings`, {
            description: 'Column settings reset successfully'
        })

    const errorToast = (error: string) => {
        toast.error(`Account settings`, {
            description: error
        })
    }

    const handleRemoveUserProfiles = async () => {
        try {
            await removeUserProfiles().unwrap().then(successToast)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    return (
        <>
            <Header title='User Settings' />
            <section className='mx-auto mt-8 max-w-[1120px] px-4'>
                <div className='flex flex-wrap gap-4'>
                    <UserSettingsForms />
                    <PasswordChange />
                </div>
                <div className='mt-8'>
                    <h2 className='scroll-m-20 text-xl font-semibold tracking-tight'>
                        Accounts settings
                    </h2>

                    <div className='mt-4'>
                        <Button
                            disabled={isLoading}
                            onClick={handleRemoveUserProfiles}
                            variant='outline'
                        >
                            Reset columns settings
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}
