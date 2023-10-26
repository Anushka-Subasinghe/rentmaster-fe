import {
  Home,
  Profile,
  Login,
  SignUpType,
  Advertisements,
} from "@/pages";
import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { appRoutes } from "./data";
import Account from "./pages/profiles/account";
import EditProfile from "./pages/profiles/edit-profile";

export const routes = [
  {
    icon: HomeIcon,
    name: "Home",
    path: appRoutes.publicRouts.home,
    element: <Home />,
    isInfoRoute: false,
  },
  {
    icon: ArrowRightOnRectangleIcon,
    name: "Advertisements",
    path: appRoutes.publicRouts.advertisements,
    element: <Advertisements/>,
    isInfoRoute: false,
  },
];

export const authRouts = [
  {
    icon: ArrowRightOnRectangleIcon,
    name: "Login",
    path: appRoutes.authRouts.login,
    element: <Login />,
  },
  {
    icon: UserPlusIcon,
    name: "Sign Up",
    path: appRoutes.authRouts.signUp,
    element: <SignUpType />,
  },
];

export const profileRouts = [
  {
    icon: ArrowRightOnRectangleIcon,
    name: "My Profile",
    path: appRoutes.secureRouts.myProfile,
    element: <Profile />,
  },
  {
    icon: ArrowRightOnRectangleIcon,
    name: "Account",
    path: appRoutes.secureRouts.account,
    element: <Account />,
  },
  {
    icon: ArrowRightOnRectangleIcon,
    name: "Edit Account",
    path: appRoutes.secureRouts.editProfile,
    element: <EditProfile />,
  },
];

export default routes;
