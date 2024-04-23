import { useAuth0 } from "@auth0/auth0-react";
import { zodResolver } from "@hookform/resolvers/zod";
import BarLoader from "react-spinners/BarLoader";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Base, Table, View } from "~/components/dashboard/database/airtable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { http } from "~/services/http";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

const AirtableFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  base: z.string(),
  table: z.string(),
  view: z.string(),
  fields: z.array(z.string()),
  isUserTable: z.boolean(),
  firstNameColumn: z.string().optional(),
  lastNameColumn: z.string().optional(),
  emailColumn: z.string().optional(),
});

type AirtableForm = z.infer<typeof AirtableFormSchema>;

export const ConfigureAirtableView = () => {
  const form = useForm<AirtableForm>({
    resolver: zodResolver(AirtableFormSchema),
    defaultValues: {
      fields: [],
    },
  });

  const [isUserTable, setIsUserTable] = useState(false);
  const [views, setViews] = useState<View[]>([]);
  const { toast } = useToast();
  const [availableFields, setAvailableFields] = useState([] as string[]);

  const { getAccessTokenSilently } = useAuth0();

  const { isPending: baseDataIsPending, data: baseData } = useQuery({
    queryKey: ["bases"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      http.defaults.headers.common.Authorization = `Bearer ${token}`;

      const res = await http.get("/airtable/bases");
      return res.data.bases as Base[];
    },
  });

  const { isPending: schemaDataIsPending, data: schemaData } = useQuery({
    queryKey: ["schema"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      http.defaults.headers.common.Authorization = `Bearer ${token}`;

      const { base } = form.getValues();
      const res = await http.get(`/airtable/base/${base}/schema`);
      return res.data.tables as Table[];
    },
    enabled: !!form.getValues().base,
  });

  const canSubmit = () => {
    const { name, description, base, table, view, fields } = form.getValues();
    return name && description && base && table && view && fields;
  };

  const handleSubmit = async () => {
    const {
      name,
      description,
      base,
      table,
      view,
      fields,
      firstNameColumn,
      lastNameColumn,
      emailColumn,
    } = form.getValues();

    const data = {
      name,
      description,
      metadata: {
        base,
        table,
        view,
        fields,
        firstNameColumn,
        lastNameColumn,
        emailColumn,
        isUserTable,
      },
    };

    const token = await getAccessTokenSilently();
    http.defaults.headers.common.Authorization = `Bearer ${token}`;

    const res = await http.post("/datasource/airtable", data);

    if (res.status === 201) {
      toast({
        className: "bg-white",
        title: "Success!",
        description:
          "A job has been started to create your view. This might take a minute or two.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 justify-center p-8 mx-auto mt-16 rounded-md border border-blue-800 shadow-md lg:flex-row w-[50rem]">
      <div className="flex-col gap-4">
        <Form {...form}>
          <form className="grid grid-cols-6 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>The name of your view</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe this view's purpose
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="base"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Base</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="airtable base" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {baseDataIsPending ? (
                          <div>
                            <BarLoader />
                          </div>
                        ) : (
                          baseData?.map((base) => (
                            <SelectItem
                              value={base.id}
                              key={base.id}
                              className="cursor-pointer"
                            >
                              {base.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>The airtable base</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="table"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Table</FormLabel>
                  <FormControl>
                    <Select
                      disabled={!!!form.getValues().base}
                      onValueChange={(v) => {
                        field.onChange(v);
                        const viewData = schemaData!.filter(
                          (table) => table.id === v,
                        )[0];
                        setViews(viewData.views);
                        console.log(viewData.fields);
                        setAvailableFields(
                          viewData.fields
                            .map((f) => f.name)
                            .filter(
                              (f) =>
                                !f.startsWith("Week") &&
                                !f.startsWith("Pre-filled link"),
                            ),
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="airtable table" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {schemaDataIsPending ? (
                          <div>
                            <BarLoader />
                          </div>
                        ) : (
                          schemaData?.map((table) => (
                            <SelectItem
                              key={table.id}
                              value={table.id}
                              className="cursor-pointer"
                            >
                              {table.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>The airtable table</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="view"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>View</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      disabled={!!!form.getValues().table}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="airtable view" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {schemaDataIsPending ? (
                          <div>
                            <BarLoader />
                          </div>
                        ) : (
                          views.map((v) => (
                            <SelectItem
                              key={v.id}
                              value={v.id}
                              className="cursor-pointer"
                            >
                              {v.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>The airtable view</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fields"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Fields</FormLabel>
                  <FormControl>
                    <Select
                      disabled={!!!form.getValues().view}
                      onValueChange={(f) => {
                        if (form.getValues().fields.includes(f)) {
                          field.onChange(
                            form.getValues().fields.filter((x) => x !== f),
                          );
                        } else {
                          field.onChange([...form.getValues().fields, f]);
                        }
                      }}
                    >
                      <SelectTrigger className="max-h-[5rem]">
                        <div className="flex gap-1">
                          {form.getValues().fields.map((f) => {
                            const randColSeed = f.charCodeAt(0) % 3;

                            console.log(randColSeed);
                            const bgCol =
                              randColSeed === 0
                                ? "bg-blue-800"
                                : randColSeed === 1
                                  ? "bg-pink-300"
                                  : "bg-purple-400";

                            return (
                              <Badge key={f} className={`text-white ${bgCol}`}>
                                {f}
                              </Badge>
                            );
                          })}
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {schemaDataIsPending ? (
                          <div>
                            <BarLoader />
                          </div>
                        ) : (
                          availableFields?.map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The fields to include in your view
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isUserTable"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>User Table?</FormLabel>
                  <FormControl>
                    <div>
                      <Switch
                        onCheckedChange={(v) => {
                          setIsUserTable(v);
                          field.onChange(v);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Would you like to export users from this table?
                  </FormDescription>
                </FormItem>
              )}
            />

            {isUserTable && (
              <>
                <FormField
                  control={form.control}
                  name="firstNameColumn"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>First Name Column</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="FirstName" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {schemaDataIsPending ? (
                              <div>
                                <BarLoader />
                              </div>
                            ) : (
                              form.getValues().fields.map((f) => (
                                <SelectItem
                                  key={f}
                                  value={f}
                                  className="cursor-pointer"
                                >
                                  {f}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Column corresponding to a user's first name
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastNameColumn"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Last Name Column</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="LastName" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {schemaDataIsPending ? (
                              <div>
                                <BarLoader />
                              </div>
                            ) : (
                              form.getValues().fields.map((f) => (
                                <SelectItem
                                  key={f}
                                  value={f}
                                  className="cursor-pointer"
                                >
                                  {f}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Column corresponding to a user's last name
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailColumn"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email Column</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Email" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {schemaDataIsPending ? (
                              <div>
                                <BarLoader />
                              </div>
                            ) : (
                              form.getValues().fields.map((f) => (
                                <SelectItem
                                  key={f}
                                  value={f}
                                  className="cursor-pointer"
                                >
                                  {f}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Column corresponding to a user's email
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button
              type="button"
              className="col-start-6 text-white bg-blue-800 hover:bg-pink-300"
              disabled={!canSubmit()}
              onClick={handleSubmit}
            >
              Create View
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
