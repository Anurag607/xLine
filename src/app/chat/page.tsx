"use client";

import React from "react";
import { auth } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import NavBar from "../../components/NavBar";
import ChatBox from "../../components/ChatBox";
import Loader from "../../components/loader";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function App() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  React.useEffect(() => {
    let loginStat = Cookies.get("loggedIn");
    if (loginStat === "false") {
      router.push("/");
    }
  }, []); //esline-disable-line

  return (
    <div className="App">
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <NavBar />
          <ChatBox />
        </>
      )}
    </div>
  );
}

export default App;
