import { useContext, useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useQuery } from "react-query";

const fetchProfileDetails = async (config) => {
  const res = await axios.get(
    "http://localhost:8080/details/getDetails",
    config
  );
  const data = await res.data;
  return data;
};

const Profile = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const config = {
    method: "GET",
    withCredentials: true,
    headers: { Authorization: `Bearer ${userContext.token}` },
  };

  const { data, status, isLoading } = useQuery(
    ["profile", config],
    () => fetchProfileDetails(config),
    {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      onError: () => {
        console.log("Could not fetch Profile data");
      },
      onSuccess: (data) => {
        console.log("Profile data successfully fetched");
      },
    }
  );

  //   const setVars  = (data) =>{
  //     const { user } = data;
  //     const { details } = user;
  //     return user, details;
  //   }

  return (
    <body className="profile">
      {status === "loading" && <div>Loading Data...</div>}

      {status === "error" && <div>Errer Fetching Data</div>}
      {status === "success" && (
        <div>
          <h1 className="profile">Private profile</h1>
          <div>
            <div>
              <div className="grid">
                <h1 >{`${data.user.firstName}`}</h1>
                <h2>{` Username: ${data.user.username}`}</h2>
              </div>
              <div className="card">
                <h2>Details</h2>
                <h3>{` Email : ${data.user.details.email}`}</h3>
                <h3>{` Phone : ${data.user.details.phone}`}</h3>
                <h3>{` Age : ${data.user.details.age}`}</h3>
                <h3>{` Description : ${data.user.details.description}`}</h3>
                <h3>{` Professions : ${data.user.details.profession}`}</h3>
              </div>
            </div>
            <Link to="/">
              <button className=" mt-2 px-2 py-1 rounded-md bg-gray-600 hover:bg-gray-400">
                Back to home
              </button>
            </Link>
          </div>
        </div>
      )}
    </body>
  );
};

export default withRouter(Profile);
