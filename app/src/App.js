import ProtectedRoute from "./ProtectedRoute";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import { useState } from "react";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  
  return (
    <Router>
      <Route path="/" exact>
        <button
          onClick={() => {
            setIsAuth(true);
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            setIsAuth(false);
          }}
        >
          Logout
        </button>
        <Link to="/profile">Go to Profile!</Link>
      </Route>
      <ProtectedRoute path="/profile" component={Profile} isAuth={isAuth} />
    </Router>
  );
}

export default App;
