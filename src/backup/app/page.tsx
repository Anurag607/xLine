"use client";

import React from "react";
import { auth } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "../../components/NavBar";
import ChatBox from "../../components/ChatBox";
import Loader from "../../components/loader";
import { useRouter } from "next/navigation";

function App() {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  React.useEffect(() => {
    if (user === null) router.push("/login");
  }, [user, router]);

  return (
    <div className="App">
      {user === null || loading === true ? (
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

// "use client";

// import React from "react";
// import { auth } from "../../firebase/clientApp";
// import { useAuthState } from "react-firebase-hooks/auth";
// import Loader from "../components/loader";
// import { useRouter } from "next/navigation";

// function App() {
//   const [user, loading, error] = useAuthState(auth);

//   const router = useRouter();

//   React.useEffect(() => {
//     router.push("/login");
//   }, []); //esline-disable-line

//   return <div className="App">{loading === true ? <Loader /> : <></>}</div>;
// }

// export default App;
