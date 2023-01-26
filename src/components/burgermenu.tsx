import React from 'react'
import styles from '../styles/burgerMenu.module.scss'
import {Menu} from '../scripts/burger.mjs'
import Link from 'next/link'
import Cookie from 'js-cookie'
import Image from 'next/image'
import { userDetails } from '@/utils/userDetails'

const Burger = () => {

    const [userDetails, SetuserDetails] = React.useState<userDetails>({
        email: '',
        name: '',
        avatar: ''
    })

    const [burgerState ,setBurgerState] = React.useState("close")

    React.useEffect(() => {
        let auth = Cookie.get('currentLoggedIn')
        SetuserDetails(JSON.parse(auth || JSON.stringify(userDetails)))
    }, [])

    return (
        <div className={`${styles.burgerWrapper} burgerWrapper`}>
            <div className={`${styles.menu1} menu1`} data-toggle={burgerState} onClick={(event) => {
                let state = event.currentTarget.dataset.toggle
                if(burgerState === 'open') setBurgerState("close")
                if(burgerState === 'close') setBurgerState("open")
                Menu()
            }}>
                <div className={`${styles.menuBarCont} menuBarCont`}>
                    <span className={`${styles["menu_bar1"]} menu_bar1`} />
                    <span className={`${styles["menu_bar2"]} menu_bar2`} />
                    <span className={`${styles["menu_bar3"]} menu_bar3`} />
                </div>
            </div>
            <div className={`${styles["sidebar"]} sidebar`}>
                <li className={`${styles.sidebarel} sidebarel`}>
                    <Link href='/home' as='/home'>
                        <span className= {`${styles.navl} navl`}>Home</span>
                    </Link>
                </li>
                <li className={`${styles.sidebarel} sidebarel`}>
                    <Link href='about' as='/about'>
                        <span className= {`${styles.navl} navl`}>About</span>
                    </Link>
                </li>
            </div>
        </div>
    )
}

export default Burger