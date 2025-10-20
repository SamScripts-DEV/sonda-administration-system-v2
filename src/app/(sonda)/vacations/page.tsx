import { fetchVacationsServer } from "@/features/vacation/service/vacationApiServer";
import { VacationManagementDashboard } from "@/features/vacation/Vacation";


export const metadata = {
    title: "Vacaciones - Sonda",
    description: "Manage your vacations with Sonda",
}

export default async function VacationsPage() {

    const vacationResponse = await fetchVacationsServer()
    const vacations = vacationResponse?.data ?? []

    return <VacationManagementDashboard initialVacations={vacations ?? []} />;
}