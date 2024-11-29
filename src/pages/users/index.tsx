import { useGetAllUsersQuery } from '@/api/users/users'
import { Header } from '@/components/header'
import { Controls } from './components/controls'
import { columns } from './components/table/columns'
import { UsersTable } from './components/table/table'


export const UsersPage = () => {
    const { data, isLoading } = useGetAllUsersQuery({})

    return (
        <>
            <Header title='Users' />
            <section className='mx-auto mt-4 px-4'>
                <Controls />
                <UsersTable
                    columns={columns}
                    data={data || []}
                    isLoading={isLoading}
                />
            </section>
        </>
    )
}
