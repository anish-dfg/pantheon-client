import { useQuery } from "@tanstack/react-query";
import { CreateDatabaseCard } from "./CreateDatabaseCard";
import { http } from "~/services/http";
import { useAuth0 } from "@auth0/auth0-react";
import { DatasourceView } from "./datasource";
import { DatabaseCard } from "./DatabaseCard";

export const DatabaseCards = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { isPending, data, error } = useQuery({
    queryKey: ["datasource-views"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      const res = await http.get("/datasource");
      return res.data as DatasourceView[];
    },
  });

  return (
    <div className="flex flex-col gap-4 mt-[2rem] ml-[2rem]">
      <h1 className="text-4xl font-bold font-['catamaran']">Databases</h1>
      <div className="flex gap-[2rem] m-[1rem]">
        {isPending ? (
          <h1>Loading</h1>
        ) : error ? (
          <h1>Error</h1>
        ) : (
          data && data.map((view) => <DatabaseCard key={view.id} data={view} />)
        )}
        {!isPending && <CreateDatabaseCard />}
      </div>
    </div>
  );
};
