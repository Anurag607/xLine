"use client"

import React from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.scss'
import Image from 'next/image'
import { auth, logInWithEmailAndPassword, signInWithGoogle } from '../../../firebase/clientApp'
import { useAuthState } from "react-firebase-hooks/auth"
import Loader from '../../components/loader'
import Cookies from 'js-cookie'

interface LoginForm extends HTMLFormControlsCollection {
    email : HTMLInputElement,
    password : HTMLInputElement
}

interface LoginFormEl extends HTMLFormElement {
    readonly elements : LoginForm
}

type template = { email : string, password : string }

export default function Login() {

    const router = useRouter()

    const [user, loading, error] = useAuthState(auth)

    const styling = {
        email: React.useRef<HTMLInputElement>(null),
        pass: React.useRef<HTMLInputElement>(null),
        warning: React.useRef<HTMLInputElement>(null),
        toSignup: React.useRef<HTMLInputElement>(null)
    }

    const [logindet, Setlogindet] = React.useState<template>({
        email : '',
        password : ''
    })

    const HandleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        let target = e.currentTarget
        switch(target.name) {
            case 'email' : {
                Setlogindet({
                    ...logindet,
                    email : target.value
                })
                break
            }
            case 'password' : {
                Setlogindet({
                    ...logindet,
                    password : target.value
                })
                break
            }
            default : {
                Setlogindet({
                    ...logindet,
                })
                break
            }
        }
    }

    const HandleSubmit = (e : React.FormEvent<LoginFormEl>) => {
        e.preventDefault()
        Cookies.remove('currentGroup', {path: ''})
        Cookies.remove('groupList', {path: ''})
        Cookies.remove('usersList', {path: ''})
        Cookies.remove('addGrpState', {path: ''})
        logInWithEmailAndPassword(logindet.email, logindet.password)
    }

    React.useEffect(() => {
        if (user) router.push("/")
      }, [user, loading, router])

    return (
        (loading) ? <Loader /> :
        <main className={styles.loginWrapper}>
            <div>
                <form onSubmit={HandleSubmit}>
                    <h2>Login</h2>
                    <span className={styles.warning} ref={styling.warning}>Invalid Username or Password</span>
                    <span>
                        <label htmlFor='email'>
                            Email: 
                            <span className={styles.loginemail}>
                                <span />
                                <input value={logindet.email} onChange={HandleChange} name='email' ref={styling.email} id='email' type="email" placeholder='Enter your Email' autoComplete='false' />
                            </span>
                        </label>
                    </span>
                    <span>
                        <label htmlFor='password'>
                            Password: 
                            <span className={styles.loginpass}>
                                <span />
                                <input name='password' ref={styling.pass} id='password' value={logindet.password} onChange={HandleChange} type="password" placeholder='Enter your Password' autoComplete='false' />
                            </span>
                            <span className={styles.reset}>
                                Forgot your Password?
                                <Link href='/reset'><p className={styles.loginLinks}>Reset Here</p></Link>
                            </span>
                        </label>
                    </span>
                    <input type='submit' placeholder='Login' value='Login' name='submit' className={styles.loginSubmit} />
                    <section className={styles.options}>
                        <p>Or Sign In using </p>
                        <div className={styles.googleSignIn} onClick={() => {
                            Cookies.remove('currentGroup', {path: ''})
                            Cookies.remove('groupList', {path: ''})
                            Cookies.remove('usersList', {path: ''})
                            Cookies.remove('addGrpState', {path: ''})
                            signInWithGoogle()
                        }}>
                            <Image src='/google.png' alt='Google' width={20} height={20} />
                            <span>Sign in with Google</span>
                        </div>
                    </section>
                    <span className={styles.toSignup} ref={styling.toSignup}>
                        Dont have an account?
                        <Link href='/signup' as='/signup' passHref><p className={styles.loginLinks}>Sign Up</p></Link>
                    </span>
                </form>
            </div>
        </main>
    )
}
