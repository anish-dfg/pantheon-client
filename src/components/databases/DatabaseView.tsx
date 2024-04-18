import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Checkbox } from "~/components/ui/checkbox";
import { GenericRecord } from "~/components/ui/data-table";
import { http } from "~/services/http";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { DatabasePaginationButtonGroup } from "./DatabasePaginationButtonGroup";
import { DatabasePageSizeDropdown } from "./DatabasePageSizeDropdown";
import { DatabaseActions } from "./DatabaseActions";

export const DatabaseView = () => {
  const [columns, setColumns] = useState<ColumnDef<GenericRecord>[]>([]);

  const { id, datasource } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { isPending, data, error } = useQuery({
    queryKey: ["datasource"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      let res = await http.post(`/datasource/${datasource}/${id}`, {});

      const columns: ColumnDef<GenericRecord>[] = [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllRowsSelected() ||
                (table.getIsSomeRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...Object.keys(res.data.records[0].fields as GenericRecord).map(
          (key) => ({ accessorKey: key, header: key }),
        ),
        // .slice(0, 10),
      ];

      setColumns(columns);

      return res.data.records.map((rec: GenericRecord) => rec.fields);
    },
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 12,
      },
    },
  });

  if (isPending) {
    return <div>Loading</div>;
  }
  return (
    <div className="container flex flex-col mx-auto">
      <div className="flex items-center py-4">
        <DatabasePageSizeDropdown table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="overflow-hidden cursor-pointer h-[1.5rem] w-[5rem]">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="p-2 break-words bg-white shadow-md max-w-[12rem]">
                              {JSON.stringify(
                                cell.getContext().renderValue(),
                              ).replace(/"/g, "")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between align-middle">
        <DatabaseActions table={table} />
        <DatabasePaginationButtonGroup table={table} />
      </div>
    </div>
  );
};
