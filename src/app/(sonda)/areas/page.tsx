import { AreaManagementDashboard } from "@/features/area";
import { fetchAreasServer } from "@/features/area/services/areaApiServer";

export const metadata = {
  title: "Áreas - Sonda",
  description: "Manage and organize your areas within the Sonda platform.",
}


export default async function AreasPage() {
  const areasResponse = await fetchAreasServer();
  const areas = areasResponse?.data ?? [];
  
  return (
    <AreaManagementDashboard initialAreas={areas ?? []} />
  )
}
