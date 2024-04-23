import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "~/components/ui/button";
import { http } from "~/services/http";

export const ReimportDataAction = ({ id }: { id: string }) => {
  const { getAccessTokenSilently } = useAuth0();

  const handleRefresh = async () => {
    const token = await getAccessTokenSilently();
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await http.post(`/datasource/airtable/${id}/refresh`, {});
    console.log(res.status);
  };

  return (
    <div>
      <Button
        className="text-blue-800 border border-blue-800 hover:text-white hover:bg-blue-800"
        variant="outline"
        onClick={handleRefresh}
      >
        Refresh
      </Button>
    </div>
  );
};
