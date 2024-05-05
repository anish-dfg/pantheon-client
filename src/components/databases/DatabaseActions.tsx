import { Table } from "@tanstack/react-table";
import { GenericRecord } from "../ui/data-table";
import { ExportUsersAction } from "./actions/ExportUsersAction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ReimportDataAction } from "./actions/ReimportDataAction";
import { DownloadUsersAsCsvAction } from "./actions/DownloadUsersAsCsvAction";

export const DatabaseActions = ({
  table,
  viewId,
}: {
  table: Table<GenericRecord>;
  viewId: string;
}) => {
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
                <ExportUsersAction table={table} viewId={viewId} />
                <DownloadUsersAsCsvAction table={table} viewId={viewId} />
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
