import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/UserContext"

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      {/* <QueryClientProvider client={queryClient}> */}
        <App />
      {/* </QueryClientProvider> */}
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
