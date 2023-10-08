import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Avatar, Typography, Button, Input } from "@material-tailwind/react";
import {
  MapPinIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/solid";
import {Footer, Navbar} from "@/widgets/layout";
import CustomerProfilePage from "@/pages/profiles/customer-profile";
import routes from "@/routes.jsx";
import WorkerProfilePage from "./worker-profile";

export function Profile() {
  const location = useLocation();
  const userDetails = location.state?.userDetails || {};

    const renderCustomerProfile = () => {
        return (
            <div>
                <CustomerProfilePage userDetails={userDetails} />
            </div>
        );
    };

  const renderWorkerProfile = () => {
    return (
        <div>
          <WorkerProfilePage userDetails={userDetails} />
        </div>
    );
  };

  const isCustomer = userDetails.user_type === "customer";
  console.log(isCustomer);

  return (
      <>
          <div>
              {isCustomer ? renderCustomerProfile() : renderWorkerProfile()}
          </div>
      </>
  );
}

export default Profile;
