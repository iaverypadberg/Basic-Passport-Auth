import { useContext} from "react";
import { UserContext } from "./context/UserContext";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [userContext, setUserContext] = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => {
          //If the user is Authenticated load the component which called ProtectedRoute
        if (userContext.isAuthenticated) {
          return <Component />;
          // Otherwise, redirect to the homepage, and set the from location
        } else {
            console.log("Sorry, you're not authenticated")
          return (
            <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
