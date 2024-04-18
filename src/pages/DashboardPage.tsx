import { DatabaseCards } from "~/components/dashboard/database/DatabaseCards";
import { Jobs } from "~/components/dashboard/jobs/Jobs";

export const DashboardPage = () => {
  return (
    <div className="flex">
      <DatabaseCards />
      <Jobs />
    </div>
  );
};
