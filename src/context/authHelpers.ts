import { UserPayload } from "@/features/auth";
import { Permission } from "@/features/permission";
import { group } from "console";


export function hasPermission(user: UserPayload | null, ...permissions: string[]): boolean {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
}

export function hasRole(user: UserPayload | null, ...roles: string[]): boolean {
    if (!user) return false;
    return user.roles.some(r => roles.includes(r.name));
}

export function hasRoleScope(user: UserPayload | null, scope: "GLOBAL" | "LOCAL") {
    if (!user) return false;
    return user.roles.some(r => r.scope === scope);
}


export function hasModuleGroupPermission(
    user: UserPayload | null,
    permissions: Permission[],
    module: string,
    group?: string
): boolean {
    if (!user) return false;
    const filtered  = permissions.filter(
        p => p.module === module && (!group || p.group === group)
    );
    return user.permissions.some(code => filtered.map(f => f.code).includes(code))

}