import { http } from "~/services/http";
import { Button } from "../ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Table } from "@tanstack/react-table";
import { GenericRecord } from "../ui/data-table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const DatabaseActions = ({ table }: { table: Table<GenericRecord> }) => {
  const { getAccessTokenSilently } = useAuth0();

  const [useBothFirstAndLastNames, setUseBothFirstAndLastNames] =
    useState(true);
  const [addUniqueNumericSuffix, setAddUniqueNumericSuffix] = useState(true);
  const [changePasswordAtNextLogin, setChangePasswordAtNextLogin] =
    useState(true);
  const [separator, setSeparator] = useState("");
  const [generatedPasswordLength, setGeneratedPasswordLength] = useState(8);

  const handleExportUsers = async () => {
    const token = await getAccessTokenSilently();

    const emailPolicy = {
      useBothFirstAndLastNames,
      addUniqueNumericSuffix,
      separator,
    };

    const passwordPolicy = {
      changePasswordAtNextLogin,
      generatedPasswordLength,
    };

    const users = table
      .getSelectedRowModel()
      .flatRows.filter(
        (row) =>
          row.original.FirstName && row.original.LastName && row.original.Email,
      )
      .map((row) => ({
        firstName: (row.original.FirstName as string).trim(),
        lastName: (row.original.LastName as string).trim(),
        email: (row.original.Email as string).trim(),
      }));

    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await http.post("/users/export", {
      // users,
      users,
      emailPolicy,
      passwordPolicy,
    });

    console.log(res.status);
  };
  return (
    <div className="flex py-4 h-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Export Users</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white ml-[1rem]">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Parameters</h4>
              <p className="text-sm text-muted-foreground">
                Define the email creation policy for the new users
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex gap-4 justify-between items-center">
                <Label htmlFor="useBothFirstAndLastNames">
                  Use Both First and Last Names?
                </Label>
                <Switch
                  checked={useBothFirstAndLastNames}
                  onCheckedChange={setUseBothFirstAndLastNames}
                />
              </div>
              <div className="flex gap-4 justify-between items-center">
                <Label htmlFor="useBothFirstAndLastNames">
                  Add unique numeric suffix?
                </Label>
                <Switch
                  checked={addUniqueNumericSuffix}
                  onCheckedChange={setAddUniqueNumericSuffix}
                />
              </div>
              <div className="flex gap-4 justify-between items-center">
                <Label htmlFor="separator">Email Names Separator</Label>
                <Input
                  id="separator"
                  className="h-8 max-w-[5rem]"
                  value={separator}
                  placeholder="_"
                  onChange={(e) => {
                    setSeparator(e.target.value);
                  }}
                />
              </div>
              <div className="flex gap-4 justify-between items-center">
                <Label htmlFor="separator">
                  Change Password at Next Login?
                </Label>
                <Switch
                  checked={changePasswordAtNextLogin}
                  onCheckedChange={setChangePasswordAtNextLogin}
                />
              </div>
              <div className="flex gap-4 justify-between items-center">
                <Label>Password Length</Label>
                <Select
                  onValueChange={(v) => setGeneratedPasswordLength(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="8" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4 items-center ml-auto">
                <Button onClick={handleExportUsers}>Export</Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
