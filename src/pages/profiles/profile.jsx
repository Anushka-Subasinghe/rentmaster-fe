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
          <Typography variant="h2" color="blue-gray" className="mb-2">
            {userDetails.name}
          </Typography>
          {/* Display active jobs related to worker's job types */}
          {/* Add a real-time update mechanism for new job notifications */}
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
