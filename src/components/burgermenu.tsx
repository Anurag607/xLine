import React, { useEffect, useRef, useState } from "react"
import styles from '../styles/burgerMenu.module.scss'
import {Menu} from '../scripts/burger.mjs'
import Link from 'next/link'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { userDetails } from '@/utils/userDetails'
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    addDoc,
    serverTimestamp,
    where
  } from "firebase/firestore"
  import { db, auth } from "../../firebase/clientApp"
import { useAuthState } from "react-firebase-hooks/auth"
import {useRouter} from 'next/navigation'

const Burger = () => {

    const [groupName, setGroupName] = useState<string>("")

    const styling = {
        warning: React.useRef<HTMLInputElement>(null)
    }

    const registerChatRoom = async () => {
        try {
          await addDoc(collection(db, "chatRooms"), {
            name: groupName,
            admin: user?.uid,
            users: addUsers.join(','),
            createdAt: serverTimestamp(),
          })
          router.refresh()
        } catch (err:any) {
          console.error(err);
          alert(err.message);
        }
    }

    const [burgerState ,setBurgerState] = React.useState("close")
    const [messages, setMessages] = useState<any>([])
    const [user] = useAuthState(auth)
    const [usersList, setUsersList] = useState<any[]>((typeof Cookies.get("usersList") !== "undefined") ? JSON.parse(Cookies.get("usersList")) : [])
    const [groups, setGroups] = useState<any[]>((typeof Cookies.get("groupList") !== "undefined") ? JSON.parse(Cookies.get("groupList")) : [])
    const [addUsers, setAddUsers] = useState<any[]>([user?.uid])
    const [addGrpBtnState ,setAddGrpBtnState] = useState<string>((Cookies.get('addGrpState') !== undefined) ? Cookies.get('addGrpState') : 'collapsed')
    const router = useRouter()

    const getUserList = () => {
        try {
            const qUsers = query(
                collection(db, 'users'),
                orderBy('name')
            )

            const getUsers = onSnapshot(qUsers, (QuerySnapshot) => {
                let users:any[] = []
                QuerySnapshot.forEach((doc) => {
                    users.push({...doc.data(), id: doc.id})
                })
                Cookies.set("usersList", JSON.stringify(users))
                setUsersList(users)
            })

            getUsers
        } catch (err) {
            console.error(err)
        }
    }

    const getGroupsForUser = () => {
        try {
            let currentGrp = ''
            const qGrps = query(
                collection(db, "chatRooms"),
                orderBy("createdAt")
            )
    
            const getGroups = onSnapshot(qGrps, (QuerySnapshot) => {
                let groups:any[] = []
                QuerySnapshot.forEach((doc) => {
                    let data = {...doc.data(), id: doc.id} as any
                    let allowedUsers = data.users.split(',')
                    if(user?.uid !== undefined && allowedUsers.includes(user.uid)) {
                        groups.push(data)
                        if(data.name.toLowerCase() === "common" && (Cookies.get("currentGroup") === null || Cookies.get("currentGroup") === undefined)) {
                            Cookies.set("currentGroup", data.id)
                            currentGrp = data.id
                        }
                    }
                })
                if(Cookies.get("currentGroup") === null || Cookies.get("currentGroup") === undefined && groups[0] !== undefined) Cookies.set("currentGroup", groups[0].id)
                Cookies.set("groupList", JSON.stringify(groups))
                setGroups(groups)
            })

            const qMsgs = query(collection(db, "messages"),
                where('room', "==", (Cookies.get("currentGroup") !== undefined) ? Cookies.get("currentGroup") : currentGrp),
                orderBy("createdAt"),
                // limit(50),
            )
        
            const getMessages = onSnapshot(qMsgs, (QuerySnapshot) => {
                let messages:any[] = []
                QuerySnapshot.forEach((doc) => {
                    messages.push({ ...doc.data(), id: doc.id })
                })
                setMessages(messages)
            })

            getGroups
            getMessages
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {

        if(!user || burgerState === 'close') return
        const formCont:HTMLFormElement = document.querySelector('.bg-formCont')!
        if(addGrpBtnState === 'expanded') {
            formCont.style.display = 'flex'
            formCont.style.height = "auto"
            setTimeout(() => {
                formCont.style.opacity = "1"
            }, 100)
        } else {
            formCont.style.opacity = "0"
            setTimeout(() => {
                formCont.style.height = "0rem"
                formCont.style.display = 'none'
            }, 300)
        }

        getUserList()

        getGroupsForUser()

    }, [addGrpBtnState, user]) // eslint-disable-line

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
                <section className={`${styles["chat-groups"]} bg-chatRooms`}>
                    <div className={styles.sideHead}>
                        <button className={styles.addGroupButton} data-toggle={addGrpBtnState} onClick={(event) => {
                            const target:HTMLButtonElement = event.currentTarget
                            const formCont:HTMLFormElement = document.querySelector('.bg-formCont')!
                            if(target.dataset.toggle === 'collapsed') {
                                formCont.style.display = 'flex'
                                formCont.style.height = "auto"
                                setTimeout(() => {
                                    formCont.style.opacity = "1"
                                }, 100)
                                target.dataset.toggle = 'expanded'
                                setAddGrpBtnState("expanded")
                                Cookies.set("addGrpState", target.dataset.toggle)
                            } else {
                                formCont.style.opacity = "0"
                                setTimeout(() => {
                                    formCont.style.height = "0rem"
                                    formCont.style.display = 'none'
                                }, 300)
                                target.dataset.toggle = 'collapsed'
                                styling.warning.current!.style.display = "none"
                                setAddGrpBtnState("collapsed")
                                Cookies.set("addGrpState", target.dataset.toggle)
                            }
                        }}>Add Group +</button>
                        <form className={`${styles.formCont} bg-formCont`}
                            onSubmit={(event) => {
                                event.preventDefault()
                                if(groupName.length >= 4) {
                                    styling.warning.current!.style.display = "none"
                                    const target:HTMLButtonElement = document.querySelector('.addGroupButton')!
                                    const formCont:HTMLFormElement = event.currentTarget
                                    formCont.style.opacity = "0"
                                    setTimeout(() => {
                                        formCont.style.height = "0rem"
                                        formCont.style.display = 'none'
                                    }, 300)
                                    target.dataset.toggle = 'collapsed'
                                    setAddGrpBtnState("collapsed")
                                    Cookies.set("addGrpState", target.dataset.toggle)
                                    registerChatRoom()
                                }
                                else {
                                    styling.warning.current!.style.display = "block"
                                }
                            }}
                        >
                            <span className={styles.warning} ref={styling.warning}>Group name must be at least 4 characters long</span>
                            <input type="text" className={styles.grpName} placeholder="Enter Group Name..." value={groupName} onChange={(event) => setGroupName(event.target.value)} />
                            {usersList.map((el,i) => {
                                if(el.uid !== user?.uid) {
                                    return <div className={styles.users} key={i} data-status="not-added" data-details={JSON.stringify(el)} onClick={(event => {
                                        const target:HTMLDivElement = event.currentTarget
                                        if(target.dataset.status === 'not-added' && target.textContent !== `+ ${user?.displayName}`) {
                                            target.dataset.status = 'added'
                                            target.style.outlineColor = "rgba(0,0,0,0.5)"
                                            target.style.borderColor = "#ffffff"
                                            let newList = [
                                                ...addUsers,
                                                JSON.parse(target.dataset.details as string).uid
                                            ]
                                            setAddUsers(newList)
                                        } else if(target.dataset.status === 'added' && target.textContent !== `+ ${user?.displayName}`) {
                                            target.dataset.status = "not-added"
                                            target.style.outlineColor = "transparent"
                                            target.style.borderColor = "transparent"
                                            let newList = addUsers
                                            let index = 0
                                            let id = JSON.parse(target.dataset.details as string).id
                                            newList.forEach((el,i) => {
                                                if(el.id === id) index = i
                                            })
                                            newList.splice(i,1)
                                            setAddUsers(newList)
                                        }
                                    })}>{`+ ${el.name}`}</div>
                                }
                            })}
                            <input type="submit" className={styles.createGrpBtn} value="Create Group"/>
                        </form>
                    </div>
                    <div className={styles.groups}>
                        {groups.map((el,i) => {
                            return <button className={styles.group} style={{backgroundColor: (Cookies.get('currentGroup') == el.id) ? '#f2c335' : '#6f3df4'}} key={i} data-details={JSON.stringify(el)} onClick={(event) => {
                                Cookies.set("currentGroup", JSON.parse((event.target as HTMLButtonElement).dataset.details as string).id)
                                router.refresh()
                                window.location.reload()
                            }} >{`${el.name} >`}</button>
                        })}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Burger