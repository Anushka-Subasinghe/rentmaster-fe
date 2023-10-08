import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {Navbar, SimpleFooter} from "@/widgets/layout";
import { appRoutes, userData } from "@/data";
import config from "@/config";
import { toast } from "react-toastify";
import routes from "@/routes.jsx";

export function Login() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCustomer, setIsCustomer] = useState(true);
  const baseUrl = config.API_BASE_URL;

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userDetails = await response.json();
        localStorage.setItem("isLogged", JSON.stringify(true));
        localStorage.setItem("isCustomer", JSON.stringify(true));
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        navigate(appRoutes.secureRouts.myProfile, { state: { userDetails } });
      } else {
        // Handle error response (e.g., incorrect credentials)
        const errorResponse = await response.json();
        console.log(errorResponse);
        toast.error(errorResponse.detail);
      }
    } catch (error) {
      toast.error("An error occurred while logging in. Please try again later.");
      console.log("Error logging in:", error);
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-0 h-full w-full" style={{background: "blue"}}/>
      <div className="absolute inset-0 z-0 h-full w-full bg-black/75"/>
      <div className="container mx-auto p-4">
        <Card className="absolute left-2/4 top-2/4 w-full max-w-[24rem] -translate-x-2/4 -translate-y-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Login
            </Typography>
          </CardHeader>

          <CardBody className="flex flex-col gap-4">
            <Input
                variant="standard"
                type="email"
                label="Email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                variant="standard"
                type="password"
                label="Password"
                size="lg"
                icon={
                  showPw ? (
                      <i className="fas fa-eye" onClick={() => setShowPw(false)} />
                  ) : (
                      <i className="fas fa-eye-slash" onClick={() => setShowPw(true)} />
                  )
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </CardBody>

          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={handleLogin} size="lg">
              Login
            </Button>
            <Typography variant="small" className="mt-2 flex justify-center">
              Don't have an account?
              <Link to={appRoutes.authRouts.signUp}>
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
      <div className="container absolute bottom-6 left-2/4 z-10 mx-auto -translate-x-2/4 text-white">
        <SimpleFooter />
      </div>
    </>
  );
}

export default Login;
