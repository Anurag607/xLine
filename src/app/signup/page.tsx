"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signup.module.scss";
import Image from "next/image";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { SignupTemplate, SignupFormEl } from "../../utils/types";

export default function Signup() {
  // Defining the variables (router, ref, states)...
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const styling = {
    username: React.useRef<HTMLInputElement>(null),
    warning: React.useRef<HTMLInputElement>(null),
    heading: React.useRef<HTMLHeadingElement>(null),
  };

  const [signupdet, Setsignupdet] = React.useState<SignupTemplate>({
    cnfrmpass: "",
    name: "",
    email: "",
    password: "",
  });

  // Function to handle the change in the input fields...
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.currentTarget;
    switch (target.name) {
      case "cnfrmpass": {
        Setsignupdet({
          ...signupdet,
          cnfrmpass: target.value,
        });
        break;
      }
      case "username": {
        Setsignupdet({
          ...signupdet,
          name: target.value,
        });
        break;
      }
      case "email": {
        Setsignupdet({
          ...signupdet,
          email: target.value,
        });
        break;
      }
      case "password": {
        Setsignupdet({
          ...signupdet,
          password: target.value,
        });
        break;
      }
      default: {
        Setsignupdet({
          ...signupdet,
        });
        break;
      }
    }
  };

  // Function to check the validity of the password...
  const checkPasswordValidity = (value: string) => {
    if (value.length == 0) {
      return "Password is required.";
    }

    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return "Password must not contain Whitespaces.";
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      return "Password must have at least one Uppercase Character.";
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      return "Password must have at least one Lowercase Character.";
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      return "Password must contain at least one Digit.";
    }

    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
      return "Password must contain at least one Special Symbol.";
    }

    const isValidLength = /^.{5,128}$/;
    if (!isValidLength.test(value)) {
      return "Password must be 5 or more Characters Long.";
    }

    return null;
  };

  // Function to handle the submit of the form...
  const HandleSubmit = (e: React.FormEvent<SignupFormEl>) => {
    setLoading(true);
    e.preventDefault();
    let passIsValid = checkPasswordValidity(signupdet.password);
    if (signupdet.name.length == 0) {
      styling.warning.current!.style.display = "block";
      styling.username.current!.style.border = "0.05rem solid red";
      styling.heading.current!.style.marginBottom = "0.5rem";
      styling.warning.current!.innerHTML = "Invalid Username";
      setLoading(false);
    } else if (signupdet.email.length == 0) {
      styling.warning.current!.style.display = "block";
      styling.username.current!.style.border = "0.05rem solid red";
      styling.heading.current!.style.marginBottom = "0.5rem";
      styling.warning.current!.innerHTML = "Invalid Email Address";
      setLoading(false);
    } else if (passIsValid && passIsValid.length > 0) {
      styling.warning.current!.style.display = "block";
      styling.username.current!.style.border = "0.05rem solid red";
      styling.heading.current!.style.marginBottom = "0.5rem";
      styling.warning.current!.innerHTML = passIsValid;
      setLoading(false);
    } else if (signupdet.password !== signupdet.cnfrmpass) {
      styling.warning.current!.style.display = "block";
      styling.username.current!.style.border = "0.05rem solid red";
      styling.heading.current!.style.marginBottom = "0.5rem";
      styling.warning.current!.innerHTML = "Passwords do not match";
      setLoading(false);
    } else
      registerWithEmailAndPassword(
        signupdet.name,
        signupdet.email,
        signupdet.password
      ).then(() => setLoading(false));
  };

  // Checking if the user is logged in or not...
  React.useEffect(() => {
    if (loading) return;
    if (user) router.push("/chat");
  }, []); //eslint-disable-line

  // Returning the JSX (SIGNUP FORM)...
  return (
    <main className={styles.signupWrapper}>
      <section />
      <section>
        {/* Signup Form... */}
        <form onSubmit={HandleSubmit}>
          <h2 ref={styling.heading}>Signup</h2>
          {/* Warning! */}
          <span className={styles.warning} ref={styling.warning}>
            Username Already Exists
          </span>
          {/* Username: Input Field */}
          <span>
            <label htmlFor="username">
              Username:
              <span className={styles.user}>
                <span />
                <input
                  ref={styling.username}
                  value={signupdet.name}
                  onChange={HandleChange}
                  name="username"
                  id="username"
                  type="text"
                  placeholder="Enter your Username"
                />
              </span>
            </label>
          </span>
          {/* Email: Input Field */}
          <span>
            <label htmlFor="email">
              Email:
              <span className={styles.signupemail}>
                <span />
                <input
                  value={signupdet.email}
                  onChange={HandleChange}
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                />
              </span>
            </label>
          </span>
          {/* Password: Input Field */}
          <span>
            <label htmlFor="password">
              Password:
              <span className={styles.pass}>
                <span />
                <input
                  value={signupdet.password}
                  onChange={HandleChange}
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                />
              </span>
            </label>
          </span>
          {/* Comfirm Password: Input Field */}
          <span>
            <label htmlFor="cnfrmpass">
              Confirm Password:
              <span className={styles.pass}>
                <span />
                <input
                  value={signupdet.cnfrmpass}
                  onChange={HandleChange}
                  name="cnfrmpass"
                  id="cnfrmpass"
                  type="password"
                  placeholder="Enter your Password Again"
                />
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
                placeholder="Sign Up"
                value="Sign Up"
                name="submit"
                className={styles.signInSubmit}
              />
              {/* Sign In with Google */}
              <section>
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
              {/* Login */}
              <span className={styles.tologin}>
                Already have an account?
                <Link href="/" as="/">
                  <p className={styles.loginLinks}>Login Here</p>
                </Link>
              </span>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
