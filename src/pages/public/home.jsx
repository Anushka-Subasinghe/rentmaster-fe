import React from "react";
import { Link } from "react-router-dom";
import { appRoutes } from "@/data";
import { NavbarSimple } from "./homeNavbar";
import carpenter from "../../assets/carpenter.jpg";

export function Home () {
  return (
    <div style={{height: '100vh', // Adjusted to use viewport height
    overflow: 'hidden', margin: 0}} lang="en">
      <div style={{display: 'flex', flexDirection: 'column', background: `url(${carpenter})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
      <div style={{ marginLeft: '250px' }}>
        <NavbarSimple currentPage='home' />
      </div>  
      <body className="leading-normal tracking-normal text-indigo-400 m-6" style={{  backgroundColor: 'rgba(255, 255, 255, 0.0)' }}>
        <div className="h-full">
          <div className="w-full container mx-auto">
            
          </div>
          <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
              <h1 className="my-4 text-4xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                Reliable
                <span className="bg-clip-text text-white bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                &nbsp;Rental Workers
                </span>
                &nbsp;at the right price
              </h1>
              <p className="leading-normal text-white md:text-2xl mb-8 text-center md:text-left">
                Sign up now if you want the best workers or if you are one
              </p>
                <div className="flex items-center justify-between pt-4"   style={{marginBottom: "400px"}}>
                  <Link to={appRoutes.authRouts.signUp}>
                    <button
                      className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="button"
                      style={{ marginLeft: '150px' }}
                    >
                      Sign Up
                    </button>
                  </Link>  
                  <Link to={appRoutes.authRouts.login}>
                    <button style={{marginLeft: "20px"}}
                      className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="button"
                    >
                      Login
                    </button>
                  </Link>
                </div>
            </div>         
          </div>
        </div>
      </body>
      </div>
    </div>
  );
};