// @src/components/ErrorBoundary.jsx
import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="container">
      <div className="alert alert-danger" role="alert">
        <h1 className="alert-heading">Error Boundary</h1>
        <p>{error?.message}</p>
      </div>
    </div>
  );
};

export default ErrorBoundary;