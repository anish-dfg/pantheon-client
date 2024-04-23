import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { http } from "~/services/http";
import { Job } from "./jobs";
import { ViewJob } from "./ViewJob";

export const ViewJobs = ({
  datasourceViewId,
}: {
  datasourceViewId: string;
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { isPending, data, error } = useQuery({
    queryKey: ["view-jobs"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      const res = await http.get(`/datasource/${datasourceViewId}/jobs`);
      return res.data as Job[];
    },
  });

  return (
    <div className="flex flex-col gap-4 p-6 mb-4 ml-5 w-full rounded-md border border-gray-200">
      <div>
        <h1 className="mb-1 font-semibold text-center">Jobs</h1>
        <p className="text-sm">Jobs associated with this view</p>
      </div>
      <div>
        {!isPending &&
          data &&
          data.map((job) => <ViewJob key={job.id} job={job} />)}
      </div>
    </div>
  );
};
