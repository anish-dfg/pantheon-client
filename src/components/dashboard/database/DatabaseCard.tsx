import { BsDatabaseFill } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DatasourceView } from "./datasource";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { useNavigate } from "react-router-dom";

type DatabaseViewProps = {
  data: DatasourceView;
};

export const DatabaseCard = ({ data }: DatabaseViewProps) => {
  const navigate = useNavigate();
  const { id, createdAt, updatedAt, viewName, datasourceName, description } =
    data;

  const handleCardClick = () => {
    navigate(`/database/${datasourceName}/${id}`);
  };

  return (
    <Card
      className="flex flex-col cursor-pointer w-[350px] hover:filter hover:brightness-90"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <BsDatabaseFill fontSize="1.5rem" />
          <h3>{viewName}</h3>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Badge className="text-white bg-purple-300">{datasourceName}</Badge>
          {new Date().getTime() - new Date(createdAt).getTime() <
            1000 * 60 * 60 * 24 * 3 && (
            <Badge className="text-white bg-pink-300">new</Badge>
          )}
        </div>
        <div className="flex flex-col my-[1rem] gap-y-[1.5rem]">
          <div>
            <Label>Database ID</Label>
            <p className="text-xs">{id}</p>
          </div>
          <div>
            <Label>Last visited</Label>
            <p className="text-xs">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label>Last modified</Label>
            <p className="text-xs">
              {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-between mt-auto"> */}
      {/*   <Button>Options</Button> */}
      {/*   <Button>View</Button> */}
      {/* </CardFooter> */}
    </Card>
  );
};
