import { SalaryManagementDashboard } from "@/features/salaries";

export const metadata = {
    title: "Privado - Sonda",
    description: "Manage and view salary information within the Sonda application.",
}

export default function SalariesPage() {
    return(
        <SalaryManagementDashboard/>
    )
}