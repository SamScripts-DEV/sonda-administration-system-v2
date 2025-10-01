import { AreaManagementDashboard } from "@/features/area";
import { fetchAreasServer } from "@/features/area/services/areaApiServer";

export default async function AreasPage() {
  const areasResponse = await fetchAreasServer();
  const areas = areasResponse?.data ?? [];
  
  return (
    <AreaManagementDashboard initialAreas={areas ?? []} />
  )
}
