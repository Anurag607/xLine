"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.scss";
import Image from "next/image";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../components/Loader";
import Cookies from "js-cookie";
import { LoginTemplate, LoginFormEl } from "../utils/types";

export default function Login() {
  // Defining the variables (router, ref, states)...
  const router = useRouter();

  const [user, loading] = useAuthState(auth);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const styling = {
    email: React.useRef<HTMLInputElement>(null),
    pass: React.useRef<HTMLInputElement>(null),
    warning: React.useRef<HTMLInputElement>(null),
    toSignup: React.useRef<HTMLInputElement>(null),
  };

  const [logindet, Setlogindet] = React.useState<LoginTemplate>({
    email: "",
    password: "",
  });

  // Function to handle the change in the input fields...
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.currentTarget;
    switch (target.name) {
      case "email": {
        Setlogindet({
          ...logindet,
          email: target.value,
        });
        break;
      }
      case "password": {
        Setlogindet({
          ...logindet,
          password: target.value,
        });
        break;
      }
      default: {
        Setlogindet({
          ...logindet,
        });
        break;
      }
    }
  };

  // Function to handle the submit of the form...
  const HandleSubmit = (e: React.FormEvent<LoginFormEl>) => {
    e.preventDefault();
    if (logindet.email.length == 0 || logindet.password.length == 0) {
      styling.warning.current!.style.display = "block";
      return;
    } else {
      styling.warning.current!.style.display = "none";
    }
    setLoading(true);
    logInWithEmailAndPassword(logindet.email, logindet.password).then(() =>
      setLoading(false)
    );
  };

  // Clearing the cookies for new session...
  React.useEffect(() => {
    Cookies.remove("currentGroup", { path: "" });
    Cookies.remove("groupList", { path: "" });
    Cookies.remove("usersList", { path: "" });
    Cookies.remove("addGrpState", { path: "" });
    Cookies.remove("userImage", { path: "" });
    Cookies.remove("currentDate", { path: "" });
  }, []);

  // Checking if the user is logged in or not...
  React.useEffect(() => {
    if (user) {
      Cookies.set("loggedIn", true);
      router.push("/chat");
    }
  }, [user]); //esline-disable-line

  // Returning the JSX (LOGIN FORM)...
  return loading ? (
    <Loader />
  ) : (
    <main className={styles.loginWrapper}>
      <div>
        {/* Login Form... */}
        <form onSubmit={HandleSubmit}>
          <h2>Login</h2>
          {/* Warning! */}
          <span className={styles.warning} ref={styling.warning}>
            Invalid Email or Password
          </span>
          {/* Email: Input Field */}
          <span>
            <label htmlFor="email">
              Email:
              <span className={styles.loginemail}>
                <span />
                <input
                  value={logindet.email}
                  onChange={HandleChange}
                  name="email"
                  ref={styling.email}
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                  autoComplete="false"
                />
              </span>
            </label>
          </span>
          {/* Password: Input Field */}
          <span>
            <label htmlFor="password">
              Password:
              <span className={styles.loginpass}>
                <span />
                <input
                  name="password"
                  ref={styling.pass}
                  id="password"
                  value={logindet.password}
                  onChange={HandleChange}
                  type="password"
                  placeholder="Enter your Password"
                  autoComplete="false"
                />
              </span>
              <span className={styles.reset}>
                Forgot your Password?
                <Link href="/reset">
                  <p className={styles.loginLinks}>Reset Here</p>
                </Link>
              </span>
            </label>
          </span>
          {isLoading ? (
            <Image src="/loader.gif" width={50} height={50} alt={""} />
          ) : (
            <>
              {/* Submit Button */}
              <input
                type="submit"
                placeholder="Login"
                value="Login"
                name="submit"
                className={styles.loginSubmit}
              />
              {/* Google Sign In */}
              <section className={styles.options}>
                <p>Or Sign In using </p>
                <div
                  className={styles.googleSignIn}
                  onClick={() => {
                    setLoading(true);
                    signInWithGoogle().then(() => setLoading(false));
                  }}
                >
                  <Image
                    src="/google.png"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span>Sign in with Google</span>
                </div>
              </section>
              {/* Sign Up */}
              <span className={styles.toSignup} ref={styling.toSignup}>
                Dont have an account?
                <Link href="/signup" as="/signup" passHref>
                  <p className={styles.loginLinks}>Sign Up</p>
                </Link>
              </span>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
