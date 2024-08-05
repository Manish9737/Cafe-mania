import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes";
import { Suspense } from "react";
import Loader1 from "./components/Loaders/Loader1";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="vh-100">
            <div className="container h-100 d-flex justify-content-center align-items-center">
              <Loader1 />
            </div>
          </div>
        }
      >
        <AdminProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </AdminProvider>
      </Suspense>
    </>
  );
}

export default App;
