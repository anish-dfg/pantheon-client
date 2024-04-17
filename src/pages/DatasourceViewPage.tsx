import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Checkbox } from "~/components/ui/checkbox";
import { DataTable, GenericRecord } from "~/components/ui/data-table";
import { http } from "~/services/http";

export const DatasourceViewPage = () => {
  const [columns, setColumns] = useState<ColumnDef<GenericRecord>[]>([]);
  const { id, datasource } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { isPending, data, error } = useQuery({
    queryKey: ["datasource"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      let res = await http.post(`/datasource/${datasource}/${id}`, {});

      // {
      //   id: "select",
      //   header: ({ table }) => (
      //     <div className="flex">
      //       <IndeterminateCheckbox
      //         {...{
      //           checked: table.getIsAllRowsSelected(),
      //           indeterminate: table.getIsSomeRowsSelected(),
      //           onChange: table.getToggleAllRowsSelectedHandler(),
      //         }}
      //       />
      //     </div>
      //   ),
      //   cell: ({ row }) => (
      //     <div className="">
      //       <IndeterminateCheckbox
      //         {...{
      //           checked: row.getIsSelected(),
      //           disabled: !row.getCanSelect(),
      //           indeterminate: row.getIsSomeSelected(),
      //           onChange: row.getToggleSelectedHandler(),
      //         }}
      //       />
      //     </div>
      //   ),
      // },

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

  return (
    <div className="container flex flex-col mx-auto">
      {!isPending && !error && <DataTable columns={columns} data={data} />}
    </div>
  );
};
