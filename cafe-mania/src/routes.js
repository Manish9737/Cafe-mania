import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import PrivateRoute from "./pages/admin/PrivateRoute";
import UserPrivateRoute from "./pages/user/UserPrivateRoute";

const Menu = lazy(() => import("./pages/user/Menu"));
const Payments = lazy(() => import("./pages/admin/Payments"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Events = lazy(() => import("./pages/user/Events"));
const Gallery = lazy(() => import("./pages/user/Gallery"));
const UserOrders = lazy(() => import("./pages/user/Orders"));
const Product = lazy(() => import("./pages/user/Product"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Invoice = lazy(() => import("./pages/admin/Invoice"));
const Feedbacks = lazy(() => import("./pages/admin/Feedbacks"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const About = lazy(() => import("./pages/user/About"));
const Home = lazy(() => import("./pages/user/Home"));
const Layout = lazy(() => import("./components/Layout"));
const Login = lazy(() => import("./pages/user/Login"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const SignIn = lazy(() => import("./pages/admin/SignIn"));
const Products = lazy(() => import("./pages/admin/Products"));
const Users = lazy(() => import("./pages/admin/Users"));
const Register = lazy(() => import("./pages/user/Register"));
const ForgotPassword = lazy(() => import("./pages/user/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/user/ResetPassword"));
const Contact = lazy(() => import("./pages/user/Contact"));
const TermsAndConditions = lazy(() =>
  import("./pages/user/TermsAndConditions")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "menu/",
        element: (
          <UserPrivateRoute>
            <Menu />
          </UserPrivateRoute>
        ),
        children: [
          {
            path: ":pName",
            element: <Menu />,
          },
        ],
      },
      {
        path: "/menu/product/:id",
        element: (
          <UserPrivateRoute>
            <Product />
          </UserPrivateRoute>
        ),
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "profile",
        element: (
          <UserPrivateRoute>
            <Profile />
          </UserPrivateRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <UserPrivateRoute>
            <Cart />
          </UserPrivateRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <UserPrivateRoute>
            <UserOrders />
          </UserPrivateRoute>
        ),
      },
      {
        path: "T&C",
        element: <TermsAndConditions />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "gallery",
        element: <Gallery />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard/>,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "feedbacks",
        element: <Feedbacks />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "invoice",
        element: <Invoice />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <SignIn />,
  },
]);

export default router;
