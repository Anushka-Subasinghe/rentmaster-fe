import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CustomerProfilePage from '@/pages/profiles/customer-profile';
import WorkerProfilePage from './worker-profile';
import { appRoutes } from '@/data';
import UserProfileDropdown from './user-profile-dropdown'; // Import the UserProfileDropdown component
import background from "../../assets/profile.jpg";

export function Profile() {
  const location = useLocation();
  const userDetails = location.state?.userDetails || {};
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged');
    setIsLoggedIn(isLogged === 'true');
  }, []);

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);

    if (!isLoggedIn) {
      console.log('Navigating to home...2');
      navigate(appRoutes.publicRouts.home, { replace: true });
    }
  }, [isLoggedIn]);

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

  const handleSignOut = () => {
    localStorage.setItem("isLogged", false);
    localStorage.removeItem('userDetails');
    setIsLoggedIn(false);
  }

  const isCustomer = userDetails.user_type === 'customer';

  return (
    <>
      <html style={{ margin: 0,
    background: `url(${background})`,
    backgroundSize: 'cover',
    height: '100vh', // Adjusted to use viewport height
    overflow: 'auto' }}>
      <div>
      <nav className="px-4 py-4 h-auto mb-4 w-full flex md:flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-wrap flex-grow items-center">
            <UserProfileDropdown userDetails={userDetails} handleSignOut={handleSignOut} />
          </div>
        </nav>
        {isCustomer ? renderCustomerProfile() : renderWorkerProfile()}
      </div>
      </html>
    </>
  );
}

export default Profile;
