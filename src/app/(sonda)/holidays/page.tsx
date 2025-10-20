import { HolidayManagementDashboard } from "@/features/holiday"
import { fetchHolidaysServer } from "@/features/holiday/service/holidayApiServer"

export const metadata = {
    title: "Feriados - Sonda",
    description: "Manage company holidays efficiently with Sonda's Holiday Management Dashboard.", 
}

export default async function HolidaysPage() {
    const holidayResponse = await fetchHolidaysServer()
    const holidays = holidayResponse?.data ?? []
    return (
        <HolidayManagementDashboard initialHolidays={holidays ?? []} />
    )
}