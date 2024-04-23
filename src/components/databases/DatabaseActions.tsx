import { http } from "~/services/http";
import { useAuth0 } from "@auth0/auth0-react";
import { Table } from "@tanstack/react-table";
import { GenericRecord } from "../ui/data-table";
import { useState } from "react";
import { ExportUsersAction } from "./actions/ExportUsersAction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ReimportDataAction } from "./actions/ReimportDataAction";

export const DatabaseActions = ({
  table,
  viewId,
}: {
  table: Table<GenericRecord>;
  viewId: string;
}) => {
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
    <div className="flex w-full h-full">
      <div className="flex flex-col items-center mt-4 ml-5 w-full rounded-md border border-gray-200">
        <h1 className="my-2 font-semibold text-center font">Actions</h1>
        <div className="w-[90%]">
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid grid-cols-2 gap-4 justify-between p-0">
              <TabsTrigger
                value="export"
                className="text-blue-800 data-[state=active]:text-white data-[state=active]:bg-blue-800"
              >
                Export
              </TabsTrigger>

              <TabsTrigger
                value="import"
                className="text-blue-800 data-[state=active]:text-white data-[state=active]:bg-blue-800"
              >
                Import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="export">
              <div className="grid grid-cols-2 gap-4 justify-between my-4 rounded-md">
                <ExportUsersAction table={table} />
              </div>
            </TabsContent>
            <TabsContent value="import">
              <ReimportDataAction id={viewId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
