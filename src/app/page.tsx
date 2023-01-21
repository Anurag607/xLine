"use client"

import React, { useContext } from "react"
import { Context } from "../context"
import { useRouter } from 'next/navigation'
import styles from '../styles/auth.module.scss'
import Cookie from 'js-cookie'

const Auth = () => {
  const { username, setUsername, secret, setSecret } = useContext(Context)

  const router = useRouter()

  const HandleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username.length === 0 || secret.length === 0) {
      console.log("FAILED!")
      return;
    }

    fetch("https://api.chatengine.io/users/", {
      method: "PUT",
      mode: 'cors',
      headers: { "Private-Key": `${process.env.NEXT_PUBLIC_PRIVATE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ "username": username, "secret": secret })
    })
    .then((r) => {
      router.push("/chats")
    })
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles["auth-container"]}>
        <form className={styles["auth-form"]} onSubmit={HandleSubmit}>

          <div className={styles["input-container"]}>
            <input
              placeholder="Email"
              className={styles["text-input"]}
              onChange={(e) => {
                setUsername(e.target.value)
                Cookie.set('username', e.target.value)
              }}
            />
          </div>

          <div className={styles["input-container"]}>
            <input
              type="password"
              placeholder="Password"
              className={styles["text-input"]}
              onChange={(e) => {
                setSecret(e.target.value)
                Cookie.set('password', e.target.value)
              }}
            />
          </div>

          <button type="submit" className={styles["submit-button"]}>
            Login / Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default Auth
