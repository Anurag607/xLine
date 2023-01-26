import React from "react"
import { auth } from "../../firebase/clientApp"
import Image from 'next/image'
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth"

const Welcome = () => {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider)
  }

  return (
    <main className="welcome">
      <h2>Welcome to xLine.</h2>
      <p>Sign in with Google to chat with with your fellow React Developers.</p>
      <button className="sign-in">
        <Image
          onClick={googleSignIn}
          src="/btn_google_signin_dark_pressed_web.png"
          alt="sign in with google"
          width={200}
          height={50}
        />
      </button>
    </main>
  )
}

export default Welcome
