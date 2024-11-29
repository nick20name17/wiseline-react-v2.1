import { SearchBar } from '@/components/search-bar'
import { AddUser } from './actions/add'

export const Controls = () => {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <SearchBar resetOffset={false} />
            <AddUser />
        </div>
    )
}
