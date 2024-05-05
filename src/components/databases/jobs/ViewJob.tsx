import { Job } from "./jobs";
import { CheckIcon } from "@radix-ui/react-icons";
import { Badge } from "~/components/ui/badge";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "~/components/ui/popover";
import { useAuth0 } from "@auth0/auth0-react";
import { http } from "~/services/http";

export const ViewJob = ({ job }: { job: Job }) => {
  const borderColor =
    job.status === "Complete"
      ? "border-green-500"
      : job.status === "Pending"
        ? "border-gray-500"
        : "border-red-500";

  const { getAccessTokenSilently } = useAuth0();

  const handleUndoJob = async () => {
    const token = await getAccessTokenSilently();
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await http.delete(`/users/jobs/${job.id}/undo`);
    console.log(res.status);
  };

  return (
    <div
      className={`flex gap-4 border-2 ${borderColor} rounded-md p-2 shadow-sm w-full my-2`}
    >
      <div className="flex items-center">
        <CheckIcon className="text-white bg-green-500 rounded-full min-w-[2rem] min-h-[2rem]" />
        {/* <Cross1Icon className="text-white bg-green-500 rounded-full min-w-[2rem] min-h-[2rem]" /> */}
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between">
          <h1 className="text-xs font-semibold">{job.id}</h1>
          {job.jobType === "ExportData" && (
            <Popover>
              <PopoverTrigger asChild>
                <DotsHorizontalIcon className="text-gray-500 cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="bg-white">
                <Button
                  onClick={handleUndoJob}
                  className="text-white bg-blue-800 hover:bg-pink-300"
                >
                  Undo job
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </div>
        {/* <p className="text-xs">Type: {job.jobType}</p> */}
        <div className="flex gap-2">
          <Badge className="w-min text-white bg-blue-800">{job.jobType}</Badge>
          <Badge className="w-min text-white bg-pink-300">{job.status}</Badge>
        </div>
        <p className="text-xs">
          Created At: {new Date(job.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
