import React from 'react'
import styles from '../../src/styles/navbar.module.scss'
import Link from 'next/link'
import Cookie from 'js-cookie'
import { userDetails } from '@/utils/userDetails'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, logout } from "../../firebase/clientApp"
import Burger from '../components/burgermenu'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const NavBar = () => {

    const [userDetails, SetuserDetails] = React.useState<userDetails>({
        email: '',
        name: '',
        avatar: ''
    })

    const [user] = useAuthState(auth)
    const router = useRouter()

    /* eslint-disable */

    React.useEffect(() => {
        let auth = Cookie.get('currentLoggedIn')
        SetuserDetails(JSON.parse(auth || JSON.stringify(userDetails)))
        // if(user != null) console.log(user)
    }, [])

    /* eslint-enable */

    return (
        <nav className = {`${styles['nav']} nav`}>
            <Burger />
            <div className={styles["nav-right"]}>
                <div className={styles["navicons"]}>
                    {(user) ?
                        <span className={styles.navDash} onClick={() => {
                            router.push('/login')
                            logout()
                        }}>
                            <div>
                                <Image src={`${(user.photoURL !== undefined && user.photoURL !== null && user.photoURL.length > 0) ? user.photoURL : '/user.png'}`} width={26.5} height={26.5} alt="profilePic" />
                            </div>
                            <div>{(user.displayName === null) ? user.email?.split('@')[0] : user.displayName}</div>
                        </span>
                         : 
                        <Link href='/login' as='/login'>
                            <span className={styles.login}>
                                <div />
                                <span>Login</span>
                            </span>
                        </Link> 
                    }
                </div>
            </div>
        </nav>
    )
}

export default NavBar