import { AreaManagementDashboard } from "@/features/area";
import { fetchAreas } from "@/features/area";

export default async function AreasPage() {
  const {data: areas} = await fetchAreas()
  return (
    <AreaManagementDashboard areas={areas ?? []} />
  )
}
