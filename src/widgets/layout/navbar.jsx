import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/solid";
import { secureRouts, profileRouts } from "@/routes";
import { appRoutes } from "@/data";
import { InfoMenu, ProfileMenu } from "@/widgets/navMenu";
import { UserIcon } from '@heroicons/react/24/outline' // or any other profile icon you have

export function Navbar({ brandName, routes }) {
  const [openNav, setOpenNav] = useState(false);
  const [isLoged, setIsLoged] = useState(
    JSON.parse(localStorage.getItem("isLogged"))
  );
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // Initialize as null

  const attemptUserDetailsRetrieval = () => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
      setIsLoged(JSON.parse(localStorage.getItem("isLogged")));
    } else {
      // Retry after a delay
      setTimeout(attemptUserDetailsRetrieval, 100);
    }
  };

  useEffect(() => {
    attemptUserDetailsRetrieval(); // Start the retrieval attempt
  }, []);

  const isSecureUrl = (url) => {
    const secureURLs = [
      appRoutes.secureRouts.serviceProvider,
      appRoutes.secureRouts.demandArea,
      appRoutes.secureRouts.chatbot,
      appRoutes.secureRouts.customer,
      appRoutes.secureRouts.wheather,
      appRoutes.secureRouts.myProfile
    ];

    return secureURLs.includes(url);
  };

  const commonNavList = [];
  const infoNavList = [];
  const secureNavList = [];

  const location = useLocation();
  const navigate = useNavigate();

  const secureURLs = [];

  secureRouts.forEach((route) => {
    secureURLs.push(route.path);
    if (route.path !== appRoutes.secureRouts.appType) {
      secureNavList.push(route);
    }
  });

  profileRouts.forEach((route) => {
    secureURLs.push(route.path);
  });

  useEffect(() => {
    if (
      secureURLs.includes(location.pathname) &&
      !JSON.parse(localStorage.getItem("isLogged"))
    ) {
      navigate(appRoutes.publicRouts.home);
    } else if (JSON.parse(localStorage.getItem("isLogged")) && (location.pathname === "/" || location.pathname === "/home")) {
      navigate(appRoutes.secureRouts.myProfile);
    }

    setIsLoged(JSON.parse(localStorage.getItem("isLogged")));
  }, [location]);

  routes.forEach((route) => {
    if (isLoged && route.isInfoRoute) {
      infoNavList.push(route);
    } else if (isLoged && !route.isInfoRoute) {
      commonNavList.push(route);
    }
  });

  useEffect(() => {
    // Listen for changes to userDetails in localStorage
    const handleStorageChange = () => {
      setUserDetails(JSON.parse(localStorage.getItem("userDetails")));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const NavbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: '100%',
    height: '80px',
    background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
    color: "black",
    borderRadius: 0,
    justifyContent: 'space-between', // Align items to the start and end of the Navbar
    alignItems: 'center',
    // Adjust background color and transparency
  };

  const NavBtn = ({ name, path, target, icon, isSecureURL }) => {
    if (
      isSecureURL &&
      JSON.parse(localStorage.getItem("isCustomer")) &&
      (path === appRoutes.secureRouts.serviceProvider ||
        path === appRoutes.secureRouts.demandArea || path === appRoutes.secureRouts.myProfile)
    ) {
      return;
    } else if (
      isSecureURL &&
      !JSON.parse(localStorage.getItem("isCustomer")) &&
      (path === appRoutes.secureRouts.chatbot ||
        path === appRoutes.secureRouts.customer ||
        path === appRoutes.secureRouts.wheather || path === appRoutes.secureRouts.myProfile)
    ) {
      return;
    }
    return (
      <Typography
        key={name}
        as="li"
        variant="small"
        color="black"
        className="capitalize"
      >
        <Link
          to={path}
          target={target}
          className="flex items-center gap-1 p-1 font-normal"
        >
          {icon &&
            React.createElement(icon, {
              className: "w-[18px] h-[18px] opacity-75 mr-1",
            })}
          {name}
        </Link>
      </Typography>
    );
  };

  const NavList = ({ isMobile }) => {
    return (
      <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        {!isLoged &&
          routes.map(({ name, path, icon, target }) => (
            <NavBtn
              key={name}
              name={name}
              path={path}
              icon={icon}
              target={target}
              isSecureURL={false}
            />
          ))}
        {isLoged && (
          <>
            {commonNavList.map(({ name, path, icon, target }) => (
              <NavBtn
                key={name}
                name={name}
                path={path}
                icon={icon}
                target={target}
                isSecureURL={false}
              />
            ))}
            {isMobile ? (
              infoNavList.map(({ name, path, icon, target }) => (
                <NavBtn
                  key={name}
                  name={name}
                  path={path}
                  icon={icon}
                  target={target}
                  isSecureURL={false}
                />
              ))
            ) : (
              <InfoMenu infoNavList={infoNavList} />
            )}
            {secureNavList.map(({ name, path, icon, target }) => (
              <NavBtn
                key={name}
                name={name}
                path={path}
                icon={icon}
                target={target}
                isSecureURL={true}
              />
            ))}
          </>
        )}
      </ul>
    );
  };

  const LoginBtn = ({ isMobile }) => {
    return (
      <Link to={appRoutes.authRouts.login}>
        <Button
          variant="gradient"
          size="sm"
          fullWidth
          style={{ color: "black" }}
        >
          Login
        </Button>
      </Link>
    );
  };

  const SignInBtn = () => {
    return (
      <Link to={appRoutes.authRouts.signUp}>
        <Button variant="gradient" size="sm" fullWidth style={{ color: "black" }}>
          Sign Up
        </Button>
      </Link>
    );
  };

  const ProfilePanel = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

    const handleProfilePanelClick = () => {
      const iconBounds = document.querySelector('.rounded-full').getBoundingClientRect();
      setPopupPosition({
        top: iconBounds.bottom + window.scrollY + 5,
        left: iconBounds.left + window.scrollX,
      });
      setIsProfileOpen(!isProfileOpen);
    };

    const popupStyle = {
      top: `${popupPosition.top}px`,
      left: `${popupPosition.left}px`,
    };

    return (
        <div className="relative inline-block" style={{ paddingRight: '120px' }}>
          <IconButton
              variant="text"
              color="white"
              size="sm"
              className="mx-1 rounded-full"
              onClick={handleProfilePanelClick}
          >
            <UserIcon className="h-5 w-5" />
          </IconButton>

          {isProfileOpen && (
              <div className="fixed mt-2 py-2 px-4 bg-white rounded-xl shadow-lg" style={popupStyle}>
                {/* Display profile details here */}
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Name: {userDetails.name}
                </Typography>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Email: {userDetails.email}
                </Typography>
              </div>
          )}
        </div>
    );
  };

  return (
    <div color="transparent" className="p-3" style={NavbarStyle}>
      <div className="container mx-auto flex items-center justify-between text-white" style={{ width: '100%' }}>
        <Link to="/">
          <Typography className="ml-2 mr-4 cursor-pointer py-1.5 font-bold">
            {brandName}
          </Typography>
        </Link>

        <div className="hidden lg:block">
          <NavList isMobile={false} />
        </div>

        <div className="hidden gap-2 lg:flex">
          {isLoged ? (
            <ProfilePanel />
          ) : (
            <>
              <LoginBtn isMobile={false} />
              <SignInBtn />
            </>
          )}
        </div>

        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      <MobileNav
        className="rounded-xl bg-white px-4 pb-4 pt-2 text-blue-gray-900"
        open={openNav}
      >
        <div className="container mx-auto">
          <NavList isMobile={true} />
          {isLoged ? (
            <ProfilePanel />
          ) : (
            <>
              <LoginBtn isMobile={true} />
              <SignInBtn />
            </>
          )}
        </div>
      </MobileNav>
    </div>
  );
}

Navbar.defaultProps = {
  brandName: "RentMaster",
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
