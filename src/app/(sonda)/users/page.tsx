import { UserManagementDashboard } from "@/features/user";
import { fetchUsers } from "@/features/user";
import { fetchUsersServer } from "@/features/user/services/userApiServer";

export default async function UsersPage() {
    const userResponse = await fetchUsersServer()
    const users = userResponse?.data ?? []


    return (
        <UserManagementDashboard initialUsers={users ?? []}/>
    );
}