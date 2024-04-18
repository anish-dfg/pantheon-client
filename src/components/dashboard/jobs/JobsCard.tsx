import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { http } from "~/services/http";
import { Job } from "./JobCard";
import { JobCard } from "./JobCard";

export const JobsCard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { data } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      const res = await http.get("/jobs");
      return res.data as Job[];
    },
  });

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Jobs</CardTitle>
        <CardDescription>All asynchronously started jobs</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {data?.map((job) => <JobCard job={job} />)}
      </CardContent>
    </Card>
  );
};
