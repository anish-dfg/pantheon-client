import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";

export const DatabasePaginationButtonGroup = <T,>({
  table,
}: {
  table: Table<T>;
}) => {
  return (
    <div className="flex justify-end items-center py-4 space-x-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
};
