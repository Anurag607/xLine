"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, sendPasswordReset } from "../../../firebase/clientApp";
import Loader from "../../components/Loader";

function Reset() {
  // Defining the variables (router, ref, states)...
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  // Checking if the user is logged in or not...
  useEffect(() => {
    if (user) router.push("/chat");
  }, []); //eslint-disable-line

  // Returning the JSX...
  return loading ? (
    <Loader />
  ) : (
    <div className="reset">
      <div className="reset__container">
        {/* Email: Input Field */}
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        {/* Send Email Button */}
        <button className="reset__btn" onClick={() => sendPasswordReset(email)}>
          Send password reset email
        </button>

        {/* Signup */}
        <div>
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Reset;
