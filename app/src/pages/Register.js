import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, Redirect } from "react-router-dom";
import axios from "axios"

const Register = () => {
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userContext, setUserContext] = useContext(UserContext);

  const formSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      setError("");
      const data = {
        username: username,
        password: password,
        firstName:firstName,
        lastName:lastName,
        withCredentials: true,
      };

      const response = await axios.post(
        "http://localhost:8080/user/signup",
        data
      );
      setIsSubmitting(false);
      if (!response.statusText === "OK") {
        //console.log(response)
        if (response.status === 400) {
          setError("Please fill all the fields correctly!");
        } else if (response.status === 401) {
          setError("Invalid email and password combination.");
        } else {
          setError("BadLogin");
        }
      } else {
        setError("Good Register");
        console.log("Good Register Ingo");
        const data = await response.data;

        await setUserContext({ token: data.token, isAuthenticated: true });
        setRedirect(true);

        console.log(
          "Logged in User Token: " +
            userContext.token +
            "Data Token " +
            data.token
        );
      }
    } catch (err) {
      setIsSubmitting(false);
      console.log("Ugh a catch");
      setError("Something went Wrong!");
    }
  };

  return (
    <div>
      <form onSubmit={formSubmitHandler}>
        <div>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.valast)}
          />
        </div>

        <div>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            Register
          </button>
        </div>
      </form>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
      <div>
        <Link to="/">
          <button type="submit">Home</button>
        </Link>
      </div>
      // Upon successful login, redirect to profile
      {redirect ? <Redirect to="/profile" /> : ""}
    </div>
  );
};

export default Register;
