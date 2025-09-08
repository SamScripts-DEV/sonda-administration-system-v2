import { UserManagementDashboard } from "@/features/user";
import { fetchUsers } from "@/features/user";

export default async function UsersPage() {

    const {data: users} = await fetchUsers()

    return (
        <UserManagementDashboard initialUsers={users ?? []}/>
    );
}