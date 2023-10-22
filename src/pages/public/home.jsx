import React from "react";
import { Link } from "react-router-dom";
import background from "../../assets/header.png";
import construction from "../../assets/construction.jpg";
import { appRoutes } from "@/data";

export function Home () {
  return (
    <div style={{height: '100vh', // Adjusted to use viewport height
    overflow: 'auto', margin: 0,
    background: `url(${background})`,
    backgroundSize: 'cover'}} lang="en">
      <body className="leading-normal tracking-normal text-indigo-400 m-6 bg-cover bg-fixed" style={{ background: 'rgba(0, 0, 0, 0.0)' }}>
        <div className="h-full">
          <div className="w-full container mx-auto">
            <div className="w-full flex items-center justify-between">
              <Link className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl" to="#" style={{marginTop: "10px"}}>
                Rent<span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">Master</span>
              </Link>
            </div>
          </div>

          <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
              <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                Reliable
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                &nbsp;Rental Workers
                </span>
                &nbsp;at the right price
              </h1>
              <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left">
                Sign up now if you want the best workers or if you are one
              </p>
                <div className="flex items-center justify-between pt-4"   style={{marginBottom: "300px"}}>
                  <Link to={appRoutes.authRouts.signUp}>
                    <button
                      className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="button"
                    >
                      Sign Up
                    </button>
                  </Link>  
                  <Link to={appRoutes.authRouts.login}>
                    <button style={{marginLeft: "20px"}}
                      className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                      type="button"
                    >
                      Login
                    </button>
                  </Link>
                </div>
            </div>

            <div className="w-full xl:w-3/5 p-12 overflow-hidden">
              <img className="mx-auto w-full md:w-4/5 transform -rotate-6 transition hover:scale-105 duration-700 ease-in-out hover:rotate-6" src={construction} />
            </div>

            
          </div>
        </div>
      </body>
    </div>
  );
};