import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerProfilePage from '@/pages/profiles/customer-profile';
import WorkerProfilePage from './worker-profile';
import { appRoutes } from '@/data';
import ProfileNavbar from './profileNavbar';
import excavator from "../../assets/excavator.jpg";

export function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged');
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(userDetails);
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
     
        <CustomerProfilePage userDetails={userDetails} />
    
    );
  };

  const renderWorkerProfile = () => {
    return (
      
        <WorkerProfilePage userDetails={userDetails} />
      
    );
  };

  const isCustomer = userDetails.user_type === 'customer';
  console.log(`isCustomer`, isCustomer);

  return (
 <>
    <div className="absolute inset-0 z-0 h-full w-full"
    style={{background: `url(${excavator})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
    <div key={isCustomer ? 1 : 0}>
      <div style={{ marginLeft: '250px' }}>
            <ProfileNavbar currentPage='dashboard' isCustomer={isCustomer} />
      </div>
    {isCustomer ? renderCustomerProfile() : renderWorkerProfile()}
    </div>
  </div>
  </>
  );
}

export default Profile;
