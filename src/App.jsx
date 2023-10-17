import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes, { authRouts, secureRouts, profileRouts } from "@/routes";
import { appRoutes } from "./data";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

function App() {

  return (
    <>
      {/* <div style={{ paddingTop: '80px' }}>
        <Navbar routes={routes} />
        <ToastContainer position="top-center" autoClose={5000} />
      </div> */}
      <Routes>
        {authRouts.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        {secureRouts.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        {routes.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        {profileRouts.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        <Route path="*" element={<Navigate to={appRoutes.publicRouts.home} replace />} />
      </Routes>
    </>
  );
}

export default App;
