import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const JobSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(["error", "pending", "complete"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Job = z.infer<typeof JobSchema>;

export const JobCard = ({ job }: { job: Job }) => {
  const { id } = job;
  console.log("HERE");
  return (
    <div className="flex flex-col rounded-md shadow-sm">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{id}</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};
