import { RoleManagementDashboard } from "@/features/role";
import { fetchRolesServer } from "@/features/role/services/rolApiServer";

export const metadata = {
    title: "Roles - Sonda",
    description: "Manage user roles within the Sonda application.",
}

export default async function RolesPage() {
    const responseRoles = await fetchRolesServer();
    const roles = responseRoles?.data ?? [];

    return (
        <RoleManagementDashboard initialRoles={roles ?? []} />
    );
}
