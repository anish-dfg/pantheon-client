import { useAuth0 } from "@auth0/auth0-react";
import { Table } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { GenericRecord } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useToast } from "~/components/ui/use-toast";
import { http } from "~/services/http";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";
import { SelectValue } from "@radix-ui/react-select";

const DownloadOptionsSchema = z.object({
  format: z.string(),
  sendTo: z.string().email(),
  fields: z.array(z.string()),
});

type DownloadOptions = z.infer<typeof DownloadOptionsSchema>;

export const DownloadUsersAsCsvAction = ({
  table,
  viewId,
}: {
  table: Table<GenericRecord>;
  viewId: string;
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();

  const allowedFields = table
    .getAllColumns()
    .filter((col) => col.id !== "select")
    .map((col) => col.id);

  const [fields, setFields] = useState([] as string[]);

  const form = useForm<DownloadOptions>({
    resolver: zodResolver(DownloadOptionsSchema),
    defaultValues: {
      fields: [],
    },
  });

  const handleDownloadUsers = async () => {
    const token = await getAccessTokenSilently();
    http.defaults.headers.common.Authorization = `Bearer ${token}`;

    const { sendTo, fields, format } = form.getValues();

    try {
      const userData = table.getCoreRowModel().rows.map((row) => {
        // const rowData: any = {};
        // fields.forEach((field: string) => {
        //   rowData[field] = row.original[field];
        // });
        // console.log(rowData);
        // return rowData;
        return {
          firstName: row.original.FirstName,
          lastName: row.original.LastName,
          email: row.original.Email,
          recordId: row.original.RecordID,
          project: row.original["ProjectName (from OrgName)"]?.toString(),
        };
      });

      console.log(userData);

      const data = {
        sendTo,
        format,
        userData,
        columns: fields,
      };

      const res = await http.post(`/users/download/${viewId}`, data);
      if (res.status === 200) {
        toast({
          title: "Success",
          description:
            "Started new job to download users as csv file. Hang tight -- this may take a few minutes as it is a slow operation.",
          className: "bg-green-600 text-white",
        });
      } else {
        toast({
          title: "Error",
          description:
            "Something went wrong. Please notify anish@developforgood of this error.",
          className: "bg-red-600 text-white",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: `${e}`,
        className: "bg-red-600 text-white",
      });
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="text-blue-800 border border-blue-800 hover:text-white hover:bg-blue-800"
            variant="outline"
          >
            Download Users
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white w-[600px]">
          <DialogHeader>
            <DialogTitle>Download Options</DialogTitle>
            <DialogDescription>Configure your download here</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-2">
              <FormField
                control={form.control}
                name="sendTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send To</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username@developforgood.org"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Who to send the data to</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File format</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="download format" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Csv" className="cursor-pointer">
                            Csv
                          </SelectItem>
                          <SelectItem
                            value="Json"
                            className="cursor-pointer"
                            disabled
                          >
                            JSON
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The format to export the data as
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fields</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(f) => {
                          if (form.getValues().fields?.includes(f)) {
                            field.onChange(
                              form.getValues().fields?.filter((x) => x !== f),
                            );
                          } else {
                            field.onChange([...form.getValues().fields, f]);
                          }
                        }}
                      >
                        <SelectTrigger className="container max-h-[5rem]">
                          <div className="flex gap-1">
                            {form.getValues().fields?.map((f) => {
                              const randColSeed = f.charCodeAt(0) % 3;

                              console.log(randColSeed);
                              const bgCol =
                                randColSeed === 0
                                  ? "bg-blue-800"
                                  : randColSeed === 1
                                    ? "bg-pink-300"
                                    : "bg-purple-400";

                              return (
                                <Badge
                                  key={f}
                                  className={`text-white ${bgCol}`}
                                >
                                  {f}
                                </Badge>
                              );
                            })}
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {allowedFields?.map((f) => (
                            <SelectItem
                              key={f}
                              value={f}
                              className="cursor-pointer"
                            >
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The fields to include in your view
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button type="button" onClick={handleDownloadUsers}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
