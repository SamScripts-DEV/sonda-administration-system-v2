import { fectchShiftConfigServer } from "@/features/shift-config/services/shiftConfigApiServer";
import { ShiftTypeManagementDashboard } from "@/features/shift-config/ShiftConfig";

export const metadata = {
    title: "Configuración de Turnos",
    description: "Manage shift types, schedules, and role assignments.",
}

export default async function ShiftConfigPage() {

    const ShiftConfigResponse = await fectchShiftConfigServer();
    const shiftTypes = ShiftConfigResponse?.data ?? [];
    return (
        <ShiftTypeManagementDashboard initialShiftConfig={shiftTypes ?? []} />
    );
}