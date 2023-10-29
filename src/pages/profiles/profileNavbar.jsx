import React from "react";
import { Navbar, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { appRoutes } from "@/data";
import UserProfileDropdown from "./user-profile-dropdown";

function NavList({currentPage, isCustomer}) {
  console.log(`navList`, isCustomer);
  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.secureRouts.myProfile} className={currentPage == 'dashboard' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          DashBoard
        </a>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.secureRouts.account} className={currentPage == 'account' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          Profile
        </a>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.secureRouts.recommendations} className={currentPage == 'recommendations' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          Recommendations
        </a>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.secureRouts.calendar} className={currentPage == 'calendar' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          Calendar
        </a>
      </Typography>
      {isCustomer && <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href={appRoutes.secureRouts.chatbot} className={currentPage == 'chatbot' ? "flex items-center text-blue-500 hover:text-blue-700 transition-colors" : "flex items-center hover:text-blue-500 transition-colors"}>
          Chatbot
        </a>
      </Typography>}
      <UserProfileDropdown />
    </ul>
  );
}

export function ProfileNavbar({currentPage, isCustomer}) {
  console.log('profilenavbar', isCustomer, currentPage)
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
          <NavList currentPage={currentPage} isCustomer={isCustomer} /> {/* Move the <ul> to the right side */}
        </div>
      </div>
    </Navbar>
  );
}

export default ProfileNavbar;