import { RoleManagementDashboard } from "@/features/role";
import { fetchRolesServer } from "@/features/role/services/rolApiServer";

export default async function RolesPage() {
    const responseRoles = await fetchRolesServer();
    const roles = responseRoles?.data ?? [];

    return (
        <RoleManagementDashboard initialRoles={roles ?? []} />
    );
}
