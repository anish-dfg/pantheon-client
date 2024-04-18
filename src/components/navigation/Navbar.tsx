import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { authAtom } from "~/state/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const Navbar = () => {
  const { isAuthenticated, getIdTokenClaims, logout } = useAuth0();

  const [auth, setAuth] = useAtom(authAtom);

  useQuery({
    queryKey: ["identity"],
    queryFn: async () => {
      const claims = await getIdTokenClaims();
      setAuth(() => ({
        firstName: claims?.given_name || "",
        lastName: claims?.family_name || "",
        picture: claims?.picture || "",
      }));
      return claims;
    },
    enabled: isAuthenticated,
  });

  return (
    <nav>
      <div className="flex sticky items-center bg-blue-700 h-[5rem]">
        <img
          src="https://assets-global.website-files.com/62d7c8cb6f11a35f47072653/650a327aee4574b4afe11724_Develop%20for%20Good%20Logo-p-500.png"
          alt="develop for good engineering"
          className="h-[60%] ml-[1.5rem] cursor-pointer"
          onClick={() =>
            (window.location.href = window.location.origin + "/dashboard")
          }
        />
        {isAuthenticated && (
          <div className="ml-auto mr-[1.5rem]">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar>
                  <AvatarImage src={auth.picture} alt="user avatar" />
                  <AvatarFallback>
                    {`${auth.firstName[0]}${auth.lastName[0]}`}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white mr-[1rem]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full">
                  <button
                    className="outline-none"
                    onClick={() =>
                      logout({
                        logoutParams: { returnTo: window.location.origin },
                      })
                    }
                  >
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};
