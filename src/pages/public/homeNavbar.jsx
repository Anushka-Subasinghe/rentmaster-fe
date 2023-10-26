import React from "react";
import { Navbar, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { appRoutes } from "@/data";

function NavList(currentPage) {
  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.publicRouts.home} className={currentPage.currentPage.currentPage == 'home' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          Home
        </a>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.publicRouts.advertisements} className={currentPage.currentPage.currentPage == 'advertisements' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          Advertisements
        </a>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href="#" className={currentPage.currentPage.currentPage == 'aboutUs' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          About Us
        </a>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.authRouts.login} className={currentPage.currentPage.currentPage == 'login' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          Login
        </a>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.authRouts.signUp} className={currentPage.currentPage.currentPage == 'signUp' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          Sign Up
        </a>
      </Typography>
    </ul>
  );
}

export function NavbarSimple(currentPage) {
  return (
    <Navbar>
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="hidden lg:block">
        <div className="flex items-center justify-between">
                <Link
                  className="text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
                  to="#"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                    Rent
                    </span>
                  
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                    Master
                  </span>
                </Link>
              </div>
        </div>
        <div className="lg:flex lg:items-center lg:gap-6"> {/* Added a new <div> here */}
          <NavList currentPage={currentPage} /> {/* Move the <ul> to the right side */}
        </div>
      </div>
    </Navbar>
  );
}

export default NavbarSimple;
