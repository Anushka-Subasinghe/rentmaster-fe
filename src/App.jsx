import { Routes, Route, Navigate } from "react-router-dom";
import routes, { authRouts, profileRouts } from "@/routes";
import { appRoutes } from "./data";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import config from "@/config";

function App() {


  const LoadingComponent = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  };

  const withAuthentication = (Component) => {
  return function AuthenticatedComponent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      async function fetchWorkerDetailsById() {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails == null) {
          setIsAuthenticated(false);
          setIsLoading(false);
        } else {
          const userId = userDetails.id;
          try {
            const response = await fetch(`${config.API_BASE_URL}/user/getUser/${userId}`);
            const data = await response.json();
            setIsAuthenticated(data !== null);
          } catch (error) {
            console.error('Error fetching user details:', error);
            setIsAuthenticated(false);
          } finally {
            setIsLoading(false);
          }  
        }
      }

      fetchWorkerDetailsById();
    }, []);

    if (isLoading) {
      // You can return a loading component here
      return <LoadingComponent />;
    }

    if (isAuthenticated) {
      console.log('inside')
      return Component;
    } else {
      // Redirect to the home page or login page
      return <Navigate to={appRoutes.publicRouts.home} replace />;
    }
  };
};

  return (
    <>
      <Routes>
        {authRouts.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        {routes.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        {profileRouts.map(
          ({ path, element }, key) => {
            if (element) {
              // Wrap the element with the withAuthentication HOC for profile routes
              const AuthenticatedElement = withAuthentication(element);
              return <Route key={key} exact path={path} element={<AuthenticatedElement />} />;
            }
            return null;
          }
        )}
        <Route path="*" element={<Navigate to={appRoutes.publicRouts.home} replace />} />
      </Routes>
    </>
  );
}

export default App;
