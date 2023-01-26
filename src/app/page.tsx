"use client"

import React from "react"
import { auth } from "../../firebase/clientApp"
import { useAuthState } from "react-firebase-hooks/auth"
import NavBar from "../components/NavBar"
import ChatBox from "../components/ChatBox"
import Welcome from "../components/Welcome"
import {useRouter} from 'next/navigation'

function App() {
  const [user, loading, error] = useAuthState(auth)

  const router = useRouter()

  React.useEffect(() => {
    if(user === null) router.push('/login')
  }, [])

  return (
    <div className="App">
        {(user === null && loading === true) ? 
          <div>Loading...</div>
          :
          <>
            <NavBar />
            <ChatBox />
          </>
        }
    </div>
  )
}

export default App;
