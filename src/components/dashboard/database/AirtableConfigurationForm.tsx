import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { http } from "~/services/http";
import { useAuth0 } from "@auth0/auth0-react";
import { AirtableBaseSchema, Base, View } from "./airtable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { ScrollArea } from "~/components/ui/scroll-area";

export const AirtableConfigurationSchema = z.object({
  base: z.string(),
  table: z.string(),
  view: z.string(),
  fields: z.array(z.string()),
  isUserTable: z.boolean(),
  userFirstNameColumn: z.string(),
  userLastNameColumn: z.string(),
  userEmailColumn: z.string(),
});

export type AirtableConfiguration = z.infer<typeof AirtableConfigurationSchema>;

export const AirtableConfigurationForm = ({
  form,
}: {
  form: UseFormReturn<AirtableConfiguration, any, undefined>;
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [fields, setFields] = useState([] as string[]);

  const [views, setViews] = useState<View[]>([]);

  const {
    isPending: isBaseDataPending,
    data: baseData,
    error: fetchBaseDataError,
  } = useQuery({
    queryKey: ["bases"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      const res = await http.get("/airtable/bases");
      return res.data.bases as Base[];
    },
  });

  const { isPending, data, error } = useQuery({
    queryKey: ["schema"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();

      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      const res = await http.get(
        `/airtable/base/${form.getValues().base}/schema`,
      );
      return res.data as AirtableBaseSchema;
    },
    enabled: form.getValues().base !== undefined,
  });

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="base"
          render={({ field }) => (
            <FormItem className="my-[0.5rem]">
              <FormLabel>Base</FormLabel>
              <Select
                onValueChange={(value) => {
                  console.log(value);
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a base" />
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {fetchBaseDataError ? (
                        <span>Error</span>
                      ) : isBaseDataPending ? (
                        <span>Loading...</span>
                      ) : (
                        baseData?.map((base) => (
                          <SelectItem value={base.id} key={base.id}>
                            {base.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="table"
          render={({ field }) => (
            <FormItem className="my-[0.5rem]">
              <FormLabel>Table</FormLabel>
              <Select
                onValueChange={(value) => {
                  console.log(value);
                  field.onChange(value);
                  const tableViews = data?.tables?.find(
                    (table) => table.id === value,
                  )?.views;
                  setViews(() => tableViews || []);
                }}
                defaultValue={field.value}
                disabled={!!!form.getValues().base}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a table" />
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {error ? (
                        <span>Error</span>
                      ) : isPending ? (
                        <span>Loading...</span>
                      ) : (
                        data?.tables.map((table) => (
                          <SelectItem value={table.id} key={table.id}>
                            {table.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="view"
          render={({ field }) => (
            <FormItem className="my-[0.5rem]">
              <FormLabel>View</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const selectedTable = form.getValues().table;
                  const table = data!.tables.find(
                    (table) => (table.id = selectedTable),
                  )!;
                  const fields = table.fields.map((f) => f.name);
                  setFields(fields);
                }}
                disabled={!!!form.getValues().base || !!!form.getValues().table}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a view" />
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {error ? (
                        <span>Error</span>
                      ) : isPending ? (
                        <span>Loading...</span>
                      ) : (
                        views.length > 0 &&
                        views
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((view) => (
                            <SelectItem key={view.id} value={view.id}>
                              {view.name}
                            </SelectItem>
                          ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fields"
          render={({ field }) => (
            <FormItem className="my-[0.5rem]">
              <Select
                onValueChange={(e) => {
                  const fields = form.getValues().fields;
                  console.log(fields);

                  if (fields) {
                    // form.setValue("fields", [...fields, e]);
                    field.onChange([...fields, e]);
                  } else {
                    // form.setValue("fields", [e]);
                    field.onChange([e]);
                  }
                }}
                disabled={!!!form.getValues().view}
              >
                <FormControl>
                  <SelectTrigger>
                    <p>Select fields</p>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {fields
                    .sort((a, b) =>
                      a.toLowerCase().localeCompare(b.toLowerCase()),
                    )
                    .map((f) => (
                      <SelectItem value={f}>{f}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {form.getValues().fields?.map((f) => {
                return (
                  <Badge key={f} className="m-1 text-white bg-purple-300">
                    {f}
                  </Badge>
                );
              })}
            </FormItem>
          )}
        />

        {form.getValues().fields && (
          <FormField
            control={form.control}
            name="isUserTable"
            render={({ field }) => (
              <FormItem className="my-[0.5rem]">
                <div className="flex flex-col">
                  <FormLabel
                    className="mr-auto mb-2 text-center"
                    onClick={() => console.log(form.getValues().fields)}
                  >
                    User Table?
                  </FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormItem>
            )}
          />
        )}

        {form.getValues().isUserTable && (
          <>
            <ScrollArea>
              <div className="overflow-scroll w-full max-h-[10rem]">
                <FormField
                  control={form.control}
                  name="userFirstNameColumn"
                  render={({ field }) => (
                    <FormItem className="my-[1.5rem]">
                      <div className="flex flex-col">
                        <FormLabel className="mr-auto mb-2 text-center">
                          User First Name Column?
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a column" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {form.getValues().fields?.map((f) => (
                              <SelectItem key={f} value={f}>
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userLastNameColumn"
                  render={({ field }) => (
                    <FormItem className="my-[1.5rem]">
                      <div className="flex flex-col">
                        <FormLabel className="mr-auto mb-2 text-center">
                          User Last Name Column?
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a column" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {form.getValues().fields?.map((f) => (
                              <SelectItem key={f} value={f}>
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userEmailColumn"
                  render={({ field }) => (
                    <FormItem className="my-[1.5rem]">
                      <div className="flex flex-col">
                        <FormLabel className="mr-auto mb-2 text-center">
                          User Email Column?
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a column" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {form.getValues().fields?.map((f) => (
                              <SelectItem key={f} value={f}>
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </>
        )}
      </form>
    </Form>
  );
};
