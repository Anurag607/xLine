"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordReset } from "../../../firebase/clientApp";

function Reset() {
  // Defining the variables (router, ref, states)...
  const [email, setEmail] = useState("");

  // Returning the JSX...
  return (
    <div className="reset">
      <div className="reset__container">
        {/* Email: Input Field */}
        <input
          type="text"
          className="reset__textBox"
          value={email}
          name={"email"}
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
