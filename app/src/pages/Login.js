import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { atom, useAtom } from "jotai";
import { Link, Redirect } from "react-router-dom";


const Login = () => {
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userContext, setUserContext] = useContext(UserContext);

  const formSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      setError("");
      const data = {
        username: username,
        password: password,
        withCredentials: true,
      };

      const response = await axios.post(
        "http://localhost:8080/user/login",
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
        setError("GoodLogin");
        console.log("Good Login Info");
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
        <input
          type="text"
          name="username"
          id="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <button type="submit" disabled={isSubmitting}>
            Sign in
          </button>
        </div>
      </form>
      <div>
        <Link to="/register">
          <button>Refister</button>
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

export default Login;
