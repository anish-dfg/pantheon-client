import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { LoginButton } from "./components/auth/LoginButton";

export const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (isAuthenticated) {
    navigate("/dashboard");
  }

  return (
    <section className="flex gap-12 py-48 mx-auto h-full max-w-[60rem]">
      <div className="flex justify-center py-6 bg-blue-700 shadow-lg rounded-[2rem]">
        <div className="flex flex-col gap-5 my-auto w-[60%] ml-24">
          <h1 className="font-bold text-pink-300 text-[3.5rem] font-['Catamaran']">
            Pantheon
          </h1>
          <p className="text-gray-100">
            A unified management tool for Develop for Good
          </p>
          <div>
            <LoginButton />
          </div>
        </div>
        <div className="flex">
          <img
            src="https://assets-global.website-files.com/62d7c8cb6f11a35f47072653/62d87fd0aeb2f66e573cac5e_nonprofit-hero.png"
            alt="develop for good"
            className="max-w-[90%] max-h-[90%] my-auto"
          />
        </div>
      </div>
    </section>
  );
};
