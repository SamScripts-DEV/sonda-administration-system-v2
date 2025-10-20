import { UserManagementDashboard } from "@/features/user";

import { fetchUsersServer } from "@/features/user/services/userApiServer";

export const metadata = {
    title: "Usuarios - Sonda",
    description: "Manage user accounts and permissions within the Sonda application.",
}

export default async function UsersPage() {
    const userResponse = await fetchUsersServer()
    const users = userResponse?.data ?? []


    return (
        <UserManagementDashboard initialUsers={users ?? []}/>
    );
}