import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/data";
import config from "@/config";
import { toast, ToastContainer } from "react-toastify";
import { NavbarSimple } from "../public/homeNavbar";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const baseUrl = config.API_BASE_URL;

  const navigate = useNavigate();

  const handleLogin = async () => {
      // Check if all fields are filled
    if (email.length == 0 || password.length == 0) {
      toast.error("Please fill in all the fields.");
      return;
    }

    // Check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
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
        localStorage.setItem("isLogged", true);
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
      <div className="absolute inset-0 z-0 h-full w-full" style={{ margin: 0, backgroundColor: `ghostwhite`, backgroundSize: "cover", height: "100vh", overflow: 'auto', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}/>
      <div style={{ marginLeft: '250px' }}>
            <NavbarSimple currentPage='login' />
          </div> 
        <form className="bg-gray-700 opacity-75 mt-20 pb-4 pt-4" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: '700px', marginLeft: '550px', borderRadius: '20px'}}>
          <div className="mb-4">
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <label className="block text-blue-300 py-2 font-bold mb-2" htmlFor="emailaddress">
                Login to RentMaster
              </label>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
              <input style={{ width: "400px", marginBottom: "20px"}}
                className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                id="emailaddress"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
              />
              <input style={{width: "400px", marginBottom: "20px"}}
                className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar />
    </>
  );
}

export default Login;
