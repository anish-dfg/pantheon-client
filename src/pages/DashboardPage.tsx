import { DatabaseCards } from "~/components/dashboard/database/DatabaseCards";
import { Jobs } from "~/components/dashboard/jobs/Jobs";
import { Button } from "~/components/ui/button";

export const DashboardPage = () => {
  return (
    <div className="flex">
      <div className="flex flex-col">
        <DatabaseCards />
      </div>
      {/* <Jobs /> */}
    </div>
  );
};
