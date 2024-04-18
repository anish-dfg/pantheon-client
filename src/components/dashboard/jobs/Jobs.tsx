import { JobsCard } from "./JobsCard";

export const Jobs = () => {
  return (
    <div className="flex flex-col gap-4 mt-[2rem] ml-[2rem]">
      <h1 className="text-4xl font-bold font-['catamaran']">Jobs</h1>
      <div className="flex gap-[2rem] m-[1rem]">
        <JobsCard />
      </div>
    </div>
  );
};
