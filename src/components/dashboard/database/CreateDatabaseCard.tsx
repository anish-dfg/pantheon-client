import { Button } from "~/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { CiSquarePlus } from "react-icons/ci";
import { BsDatabaseFillAdd } from "react-icons/bs";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { http } from "~/services/http";
import { useAuth0 } from "@auth0/auth0-react";
import { Base, AirtableBaseSchema, View } from "./airtable";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { ToastAction } from "~/components/ui/toast";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  name: z.string(),
  description: z.string(),
  datasource: z.string(),
});

const AirtableSchema = z.object({
  base: z.string(),
  table: z.string(),
  view: z.string(),
});

export const CreateDatabaseCard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const form = useForm<z.infer<typeof FormSchema>>();
  const airtableForm = useForm<z.infer<typeof AirtableSchema>>();

  const { toast } = useToast();
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

  const navigate = useNavigate();
  const { isPending, data, error } = useQuery({
    queryKey: ["schema"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();

      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      const res = await http.get(
        `/airtable/base/${airtableForm.getValues().base}/schema`,
      );
      return res.data as AirtableBaseSchema;
    },
    enabled: airtableForm.getValues().base !== undefined,
  });

  const createEnabled = () => {
    const { base, table, view } = airtableForm.getValues();
    return base && table && view;
  };

  const handleCreateDatasource = async () => {
    const { name, description, datasource } = form.getValues();
    const { base, table, view } = airtableForm.getValues();

    const data = {
      viewName: name,
      datasourceName: datasource,
      description,
      metadata: {
        base,
        table,
        view,
      },
    };

    const token = await getAccessTokenSilently();

    http.defaults.headers.common.Authorization = `Bearer ${token}`;

    if (base && table && view) {
      const res = await http.post(`/datasource`, data);
      console.log(res.status);
      toast({
        title: "Success!",
        description: "Created new datasource",
        action: <ToastAction altText="Undo">Undo</ToastAction>,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Must specify a base, table, and view",
      });
    }
  };

  const handleClick = () => {
    navigate("/datasource/configure");
  };

  return (
    <div>
      <Card
        className="flex flex-col cursor-pointer w-[350px]"
        onClick={handleClick}
      >
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <BsDatabaseFillAdd fontSize="1.5rem" />
            <h3>New Database View</h3>
          </CardTitle>
          <CardDescription>
            Create a new database view from an existing data source
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <Form {...form}> */}
          {/*   <form className="flex flex-col"> */}
          {/*     <FormField */}
          {/*       control={form.control} */}
          {/*       name="name" */}
          {/*       render={({ field }) => ( */}
          {/*         <FormItem className="my-[0.5rem]"> */}
          {/*           <FormLabel>Name</FormLabel> */}
          {/*           <Input onChange={field.onChange} /> */}
          {/*         </FormItem> */}
          {/*       )} */}
          {/*     /> */}
          {/*     <FormField */}
          {/*       control={form.control} */}
          {/*       name="description" */}
          {/*       render={({ field }) => ( */}
          {/*         <FormItem className="my-[0.5rem]"> */}
          {/*           <FormLabel>Description</FormLabel> */}
          {/*           <Input onChange={field.onChange} /> */}
          {/*         </FormItem> */}
          {/*       )} */}
          {/*     /> */}
          {/**/}
          {/*     <FormField */}
          {/*       control={form.control} */}
          {/*       name="datasource" */}
          {/*       render={({ field }) => ( */}
          {/*         <FormItem className="my-[0.5rem]"> */}
          {/*           <FormLabel>Datasource</FormLabel> */}
          {/*           <Select onValueChange={field.onChange} defaultValue=""> */}
          {/*             <FormControl> */}
          {/*               <SelectTrigger> */}
          {/*                 <SelectValue placeholder="Select a datasource" /> */}
          {/*               </SelectTrigger> */}
          {/*             </FormControl> */}
          {/*             <SelectContent className="bg-white"> */}
          {/*               <SelectItem value="airtable">Airtable</SelectItem> */}
          {/*             </SelectContent> */}
          {/*           </Select> */}
          {/*         </FormItem> */}
          {/*       )} */}
          {/*     /> */}
          {/**/}
          {/*     <Popover> */}
          {/*       <PopoverTrigger asChild> */}
          {/*         <Button */}
          {/*           variant="outline" */}
          {/*           className="mr-auto mt-[0.5rem]" */}
          {/*           disabled={!form.getValues().datasource} */}
          {/*         > */}
          {/*           Configure */}
          {/*         </Button> */}
          {/*       </PopoverTrigger> */}
          {/*       <PopoverContent className="w-80 bg-white ml-[1rem]"> */}
          {/*         <div className="space-y-2"> */}
          {/*           <h4 className="font-medium leading-none">Airtable</h4> */}
          {/*           <p className="text-sm text-muted-foreground"> */}
          {/*             Configure an Airtable View */}
          {/*           </p> */}
          {/*         </div> */}
          {/*         <div> */}
          {/*           <Form {...airtableForm}> */}
          {/*             <FormField */}
          {/*               control={airtableForm.control} */}
          {/*               name="base" */}
          {/*               render={({ field }) => ( */}
          {/*                 <FormItem className="my-[0.5rem]"> */}
          {/*                   <FormLabel>Base</FormLabel> */}
          {/*                   <Select */}
          {/*                     onValueChange={(value) => { */}
          {/*                       console.log(value); */}
          {/*                       field.onChange(value); */}
          {/*                     }} */}
          {/*                     defaultValue={field.value} */}
          {/*                   > */}
          {/*                     <SelectTrigger> */}
          {/*                       <SelectValue placeholder="Select a base" /> */}
          {/*                       <SelectContent className="bg-white"> */}
          {/*                         <SelectGroup> */}
          {/*                           {fetchBaseDataError ? ( */}
          {/*                             <span>Error</span> */}
          {/*                           ) : isBaseDataPending ? ( */}
          {/*                             <span>Loading...</span> */}
          {/*                           ) : ( */}
          {/*                             baseData?.map((base) => ( */}
          {/*                               <SelectItem */}
          {/*                                 value={base.id} */}
          {/*                                 key={base.id} */}
          {/*                               > */}
          {/*                                 {base.name} */}
          {/*                               </SelectItem> */}
          {/*                             )) */}
          {/*                           )} */}
          {/*                         </SelectGroup> */}
          {/*                       </SelectContent> */}
          {/*                     </SelectTrigger> */}
          {/*                   </Select> */}
          {/*                 </FormItem> */}
          {/*               )} */}
          {/*             /> */}
          {/*             <FormField */}
          {/*               control={airtableForm.control} */}
          {/*               name="table" */}
          {/*               render={({ field }) => ( */}
          {/*                 <FormItem className="my-[0.5rem]"> */}
          {/*                   <FormLabel>Table</FormLabel> */}
          {/*                   <Select */}
          {/*                     onValueChange={(value) => { */}
          {/*                       console.log(value); */}
          {/*                       field.onChange(value); */}
          {/*                       const tableViews = data?.tables?.find( */}
          {/*                         (table) => table.id === value, */}
          {/*                       )?.views; */}
          {/*                       setViews(() => tableViews || []); */}
          {/*                     }} */}
          {/*                     defaultValue={field.value} */}
          {/*                   > */}
          {/*                     <SelectTrigger> */}
          {/*                       <SelectValue placeholder="Select a table" /> */}
          {/*                       <SelectContent className="bg-white"> */}
          {/*                         <SelectGroup> */}
          {/*                           {error ? ( */}
          {/*                             <span>Error</span> */}
          {/*                           ) : isPending ? ( */}
          {/*                             <span>Loading...</span> */}
          {/*                           ) : ( */}
          {/*                             data?.tables.map((table) => ( */}
          {/*                               <SelectItem */}
          {/*                                 value={table.id} */}
          {/*                                 key={table.id} */}
          {/*                               > */}
          {/*                                 {table.name} */}
          {/*                               </SelectItem> */}
          {/*                             )) */}
          {/*                           )} */}
          {/*                         </SelectGroup> */}
          {/*                       </SelectContent> */}
          {/*                     </SelectTrigger> */}
          {/*                   </Select> */}
          {/*                 </FormItem> */}
          {/*               )} */}
          {/*             /> */}
          {/*             <FormField */}
          {/*               control={airtableForm.control} */}
          {/*               name="view" */}
          {/*               render={({ field }) => ( */}
          {/*                 <FormItem className="my-[0.5rem]"> */}
          {/*                   <FormLabel>View</FormLabel> */}
          {/*                   <Select */}
          {/*                     onValueChange={(value) => { */}
          {/*                       console.log(value); */}
          {/*                       field.onChange(value); */}
          {/*                     }} */}
          {/*                     defaultValue={field.value} */}
          {/*                   > */}
          {/*                     <SelectTrigger> */}
          {/*                       <SelectValue placeholder="Select a table" /> */}
          {/*                       <SelectContent className="bg-white"> */}
          {/*                         <SelectGroup> */}
          {/*                           {error ? ( */}
          {/*                             <span>Error</span> */}
          {/*                           ) : isPending ? ( */}
          {/*                             <span>Loading...</span> */}
          {/*                           ) : ( */}
          {/*                             views.length > 0 && */}
          {/*                             views.map((view) => ( */}
          {/*                               <SelectItem */}
          {/*                                 key={view.id} */}
          {/*                                 value={view.id} */}
          {/*                               > */}
          {/*                                 {view.name} */}
          {/*                               </SelectItem> */}
          {/*                             )) */}
          {/*                           )} */}
          {/*                         </SelectGroup> */}
          {/*                       </SelectContent> */}
          {/*                     </SelectTrigger> */}
          {/*                   </Select> */}
          {/*                 </FormItem> */}
          {/*               )} */}
          {/*             /> */}
          {/**/}
          {/*             <Button */}
          {/*               type="submit" */}
          {/*               disabled={!createEnabled()} */}
          {/*               onClick={() => { */}
          {/*                 handleCreateDatasource(); */}
          {/*               }} */}
          {/*             > */}
          {/*               Create */}
          {/*             </Button> */}
          {/*           </Form> */}
          {/*         </div> */}
          {/*       </PopoverContent> */}
          {/*     </Popover> */}
          {/*   </form> */}
          {/* </Form> */}
          <CiSquarePlus size="lg" />
          {/* <AiOutlinePlus size="lg" /> */}
        </CardContent>
      </Card>
    </div>
  );
};
