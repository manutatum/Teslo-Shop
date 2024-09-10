export const revalidate = 0

import { Title } from '@/components';

import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';
import { getPaginatedUsers } from '@/actions';

export default async function UsersAdminPage() {

    const { ok, users = [] } = await getPaginatedUsers();

    if (!ok) {
        redirect('/auth/login');
    }

    return (
        <>
            <Title title="Mantenimiento de Users" />

            <div className="mb-10">
                <UsersTable users={users}/>
            </div>
        </>
    );
}