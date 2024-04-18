import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { AirtableConfigurationForm } from "./AirtableConfigurationForm";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useAuth0 } from "@auth0/auth0-react";
import { http } from "~/services/http";
import { useToast } from "~/components/ui/use-toast";

const BasicConfigurationSchema = z.object({
  name: z.string(),
  description: z.string(),
  datasource: z.enum(["airtable", "google"]),
});

type BasicConfiguration = z.infer<typeof BasicConfigurationSchema>;

const AirtableConfigurationSchema = z.object({
  base: z.string(),
  table: z.string(),
  view: z.string(),
  fields: z.array(z.string()),
  isUserTable: z.boolean(),
  userFirstNameColumn: z.string(),
  userLastNameColumn: z.string(),
  userEmailColumn: z.string(),
});

type AirtableConfiguration = z.infer<typeof AirtableConfigurationSchema>;

export const BasicConfigurationCard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();

  const form = useForm<BasicConfiguration>({
    resolver: zodResolver(BasicConfigurationSchema),
  });

  const airtableForm = useForm<AirtableConfiguration>({
    resolver: zodResolver(AirtableConfigurationSchema),
  });

  const handleCreateAirtableView = async () => {
    const token = await getAccessTokenSilently();
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    const { name, description } = form.getValues();
    const {
      base,
      table,
      view,
      fields,
      isUserTable,
      userFirstNameColumn,
      userLastNameColumn,
      userEmailColumn,
    } = airtableForm.getValues();
    const metadata = {
      isUserTable,
      userFirstNameColumn,
      userLastNameColumn,
      userEmailColumn,
      base,
      table,
      view,
      fields,
    };

    const data = {
      name,
      description,
      metadata,
    };
    const res = await http.post("/datasource/airtable", data);
    if (res.status === 201) {
      toast({
        title: "Success!",
        description: "Successfully created new Airtable view",
      });
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create View</CardTitle>
        <CardDescription>Create a new Datasource View</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="View name"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A description of this view"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="datasource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datasource</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a datasource" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="airtable">Airtable</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  className="ml-auto"
                  disabled={
                    !!!form.getValues().name ||
                    !!!form.getValues().description ||
                    !!!form.getValues().datasource
                  }
                >
                  Configure
                </Button>
              </SheetTrigger>
              {form.getValues().datasource === "airtable" ? (
                <SheetContent className="overflow-scroll bg-white">
                  <SheetHeader>
                    <SheetTitle>Create a new Airtable view</SheetTitle>
                    <SheetDescription>
                      Customize your view here. Click the "Create" button when
                      you're done. You can always change these values later.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid overflow-scroll gap-4 py-4">
                    <ScrollArea>
                      <AirtableConfigurationForm form={airtableForm} />
                    </ScrollArea>
                  </div>
                  <SheetFooter>
                    {airtableForm.getValues().base &&
                      airtableForm.getValues().table &&
                      airtableForm.getValues().view &&
                      airtableForm.getValues().fields && (
                        <SheetClose>
                          <Button
                            type="button"
                            onClick={handleCreateAirtableView}
                          >
                            Create View
                          </Button>
                        </SheetClose>
                      )}
                  </SheetFooter>
                </SheetContent>
              ) : (
                form.getValues().datasource === "google" && (
                  <SheetContent className="bg-white">
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4"></div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                )
              )}
            </Sheet>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
