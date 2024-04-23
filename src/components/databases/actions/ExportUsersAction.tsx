import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { GenericRecord } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Switch } from "~/components/ui/switch";

export const ExportUsersAction = ({
  table,
}: {
  table: Table<GenericRecord>;
}) => {
  const [useBothFirstAndLastNames, setUseBothFirstAndLastNames] =
    useState(true);
  const [addUniqueNumericSuffix, setAddUniqueNumericSuffix] = useState(true);
  const [separator, setSeparator] = useState("");
  const [generatedPasswordLength, setGeneratedPasswordLength] = useState(8);
  const [changePasswordAtNextLogin, setChangePasswordAtNextLogin] =
    useState(true);

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="text-blue-800 border border-blue-800 hover:text-white hover:bg-blue-800"
            variant="outline"
          >
            Export Users
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-white">
          <SheetHeader>
            <SheetTitle>Export Users</SheetTitle>
            <SheetDescription>
              Specify where and how you want users exported from this view
            </SheetDescription>
            <div className="flex flex-col gap-4 pt-4">
              <div>
                <h4 className="mb-3 font-medium leading-none">Parameters</h4>
                <p className="text-sm text-muted-foreground">
                  Define the creation policy for the new users
                </p>
              </div>

              <Separator className="bg-gray-300" />

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
                  defaultValue={generatedPasswordLength.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="8" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="6" className="cursor-pointer">
                      6
                    </SelectItem>
                    <SelectItem value="8" className="cursor-pointer">
                      8
                    </SelectItem>
                    <SelectItem value="10" className="cursor-pointer">
                      10
                    </SelectItem>
                    <SelectItem value="12" className="cursor-pointer">
                      12
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
