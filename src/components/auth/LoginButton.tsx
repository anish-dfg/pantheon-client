import { useAuth0 } from "@auth0/auth0-react";

import { Button } from "~/components/ui/button";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      variant="default"
      className="mx-auto text-gray-100 bg-purple-300 shadow-md hover:bg-pink-300 rounded-[10px] text-[1.25rem]"
      onClick={() => loginWithRedirect()}
    >
      Sign In
    </Button>
  );
};
