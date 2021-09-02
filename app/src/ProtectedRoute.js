import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ isAuth: isAuth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
          //If the user is Authenticated load the component which called ProtectedRoute
        if (isAuth) {
            console.log("Authenticated")
          return <Component />;
          // Otherwise, redirect to the homepage, and set the from location
        } else {
            console.log("Now authenticated")
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
