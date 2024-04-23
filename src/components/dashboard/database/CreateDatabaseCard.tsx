import { Button } from "~/components/ui/button";
import { BsDatabaseFillAdd } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateDatabaseCard = () => {
  const [datasource, setDatasource] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      <Card className="flex flex-col cursor-pointer w-[350px]">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <BsDatabaseFillAdd fontSize="1.5rem" />
            <h3>New Database View</h3>
          </CardTitle>
          <CardDescription>
            Create a new database view from an existing data source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setDatasource}>
            <SelectTrigger>
              <SelectValue placeholder="select a datasource" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="airtable" className="cursor-pointer">
                Airtable
              </SelectItem>
              <SelectItem value="google" className="cursor-pointer">
                Google Workspace
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button
            className="ml-auto"
            disabled={!!!datasource}
            onClick={() => {
              navigate(`/datasource/${datasource}/configure`);
            }}
          >
            Configure
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
