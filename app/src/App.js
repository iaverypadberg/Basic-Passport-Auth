import ProtectedRoute from "./ProtectedRoute";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Nav from "./nav/Nav"
import { UserContext } from "./context/UserContext";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";

function App() {
  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = useCallback(() => {
    fetch("http://localhost:8080/user/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        console.log("User Token Refreshed!");
        await setUserContext({ token: data.token, isAuthenticated: true });
      } else {
        setUserContext({ token:null, isAuthenticated:false});
      }

      // call refreshToken every 15 minutes to renew the authentication token.
      setTimeout(verifyUser, 15 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <Router>
      <Nav/>
      <Route path="/" exact>
        <Link to="/login"> Go to Login</Link>
        <Link to="/profile">Go to Profile!</Link>
      </Route>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <ProtectedRoute path="/profile" component={Profile} />
    </Router>
  );
}

export default App;
