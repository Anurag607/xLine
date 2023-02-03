import React, { FormEventHandler, useEffect, useRef, useState } from "react"
import {
  query,
  doc,
  collection,
  orderBy,
  onSnapshot,
  limit,
  addDoc,
  serverTimestamp,
  where,
  QuerySnapshot,
  updateDoc,
  getDoc
} from "firebase/firestore"
import { db,auth } from "../../firebase/clientApp"
import Message from "./Message"
import SendMessage from "./SendMessage"
import styles from "../styles/chatBox.module.scss"
import { useAuthState } from "react-firebase-hooks/auth"
import Cookies from 'js-cookie'
import {useRouter} from 'next/navigation'
import Image from 'next/image'

const ChatBox = () => {
    const [messages, setMessages] = useState<any>([])
    const scroll = useRef<any>(null)
    const [groupName, setGroupName] = useState<string>("")
    const [user] = useAuthState(auth)
    const [usersList, setUsersList] = useState<any[]>((typeof Cookies.get("usersList") !== "undefined") ? JSON.parse(Cookies.get("usersList")) : [])
    const [groups, setGroups] = useState<any[]>((typeof Cookies.get("groupList") !== "undefined") ? JSON.parse(Cookies.get("groupList")) : [])
    const [addUsers, setAddUsers] = useState<any[]>([user?.uid])
    const [updateUsers, setUpdateUsers] = useState<any[]>([user?.uid])
    const [admittedUsers, setAdmittedUsers] = useState<any[]>((Cookies.get('currentGroup') !== undefined) ? JSON.parse(Cookies.get('currentGroup')).users.split(',') : [user?.uid])
    const [admins, setAdmins] = useState<any[]>((Cookies.get('currentGroup') !== undefined) ? JSON.parse(Cookies.get('currentGroup')).admin.split(',') : [''])
    const [addGrpBtnState ,setAddGrpBtnState] = useState<string>((Cookies.get('addGrpState') !== undefined) ? Cookies.get('addGrpState') : 'collapsed')
    const [addUserBtnState ,setAddUserBtnState] = useState<string>((Cookies.get('addUserState') !== undefined) ? Cookies.get('addUserState') : 'collapsed')
    const [seeUserBtnState ,setseeUserBtnState] = useState<string>((Cookies.get('seeUserState') !== undefined) ? Cookies.get('seeUserState') : 'collapsed')
    const router = useRouter()

    const styling = {
        warningGroup: React.useRef<HTMLInputElement>(null),
        warningUser: React.useRef<HTMLInputElement>(null)
    }

    useEffect(() => {
        const messagesCont:HTMLElement = document.querySelector('.messages')!
        let el = messagesCont.children[messagesCont.childElementCount-2] as HTMLDivElement
        if(el !== undefined) el.scrollIntoView({block: 'start', inline: 'nearest', behavior: 'smooth'})
    }, [messages]) //eslint-disable-line

    const registerChatRoom = async () => {
        try {
          await addDoc(collection(db, "chatRooms"), {
            name: groupName,
            admin: user?.uid,
            users: addUsers.join(','),
            createdAt: serverTimestamp(),
          })
          setAddUsers([user?.uid])
          router.refresh()
        } catch (err:any) {
          console.error(err);
          alert(err.message);
        }
    }

    const updateUserList = async () => {
        try {
            const docRef = doc(db, 'chatRooms', JSON.parse(Cookies.get('currentGroup')).id)
            const docSnap = await getDoc(docRef)
            let data = docSnap.data()
            await updateDoc(docRef, {
                users: [...new Set([...data?.users.split(','),...updateUsers])].join(',')
            })
            let delta = JSON.parse(Cookies.get('currentGroup'))
            delta.users = [...new Set([...data?.users.split(','),...updateUsers])].join(',')
            Cookies.set('currentGroup', JSON.stringify(delta))
            window.location.reload()
        } catch(err) {
            console.error(err)
        }
    }

    const removeUser = async () => {
        try {
            const docRef = doc(db, 'chatRooms', JSON.parse(Cookies.get('currentGroup')).id)
            const docSnap = await getDoc(docRef)
            let data = docSnap.data()
            let existingUsers = data?.users.split(',')
            let id = JSON.parse(Cookies.get('selectedUser')).uid
            existingUsers = existingUsers.filter((uid:string) => uid !== id)
            await updateDoc(docRef, {
                users: existingUsers.join(',')
            })
            let delta = JSON.parse(Cookies.get('currentGroup'))
            delta.users = existingUsers.join(',')
            Cookies.set('currentGroup', JSON.stringify(delta))
            if(admins.includes(id)) {
                let newAdminList = data?.admin.split(',')
                newAdminList = newAdminList.filter((uid:string) => uid !== id)
                console.log(newAdminList)
                await updateDoc(docRef, {
                    admin: newAdminList.join(',')
                })
                let delta = JSON.parse(Cookies.get('currentGroup'))
                delta.admin = newAdminList.join(',')
                Cookies.set('currentGroup', JSON.stringify(delta))
            }
            window.location.reload()
        } catch(err) {
            console.error(err)
        }
    }

    const updateAdminList = async (newadminList:string[]) => {
        try {
            const docRef = doc(db, 'chatRooms', JSON.parse(Cookies.get('currentGroup')).id)
            const docSnap = await getDoc(docRef)
            let data = docSnap.data()
            await updateDoc(docRef, {
                admin: [...new Set([...data?.admin.split(','),...newadminList])].join(',')
            })
            let delta = JSON.parse(Cookies.get('currentGroup'))
            delta.admin = [...new Set([...data?.admin.split(','),...newadminList])].join(',')
            setAdmins([...new Set([...data?.admin.split(','),...newadminList])])
            Cookies.set('currentGroup', JSON.stringify(delta))
            window.location.reload()
        } catch(err) {
            console.error(err)
        }
    }

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
                            Cookies.set("currentGroup", JSON.stringify(data))
                            currentGrp = data.id
                        }
                    }
                })
                if(groups.length === 0) window.location.reload()
                if(Cookies.get("currentGroup") === null || Cookies.get("currentGroup") === undefined && groups[0] !== undefined) Cookies.set("currentGroup", groups[0].id)
                Cookies.set("groupList", JSON.stringify(groups))
                setGroups(groups)
            })

            const qMsgs = query(collection(db, "messages"),
                where('room', "==", (Cookies.get("currentGroup") !== undefined) ? JSON.parse(Cookies.get('currentGroup')).id : currentGrp),
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

        if(!user) return

        styling.warningGroup.current!.style.display = "none"
        styling.warningUser.current!.style.display = "none"
        
        const formCont:HTMLFormElement = document.querySelector('.formCont')!
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

        const userList:HTMLFormElement = document.querySelector('.userList')!
        if(userList !== undefined && userList !== null) {
            if(addUserBtnState === 'expanded') {
                userList.style.display = 'flex'
                userList.style.height = "auto"
                setTimeout(() => {
                    userList.style.opacity = "1"
                }, 100)
            } else {
                userList.style.opacity = "0"
                setTimeout(() => {
                    userList.style.height = "0rem"
                    userList.style.display = 'none'
                }, 300)
            }
        }

        const addeduserList:HTMLDivElement = document.querySelector('.addeduserList')!
        if(userList !== undefined && userList !== null) {
            if(seeUserBtnState === 'expanded') {
                addeduserList.style.display = 'flex'
                addeduserList.style.height = "auto"
                setTimeout(() => {
                    addeduserList.style.opacity = "1"
                }, 100)
            } else {
                addeduserList.style.opacity = "0"
                setTimeout(() => {
                    addeduserList.style.height = "0rem"
                    addeduserList.style.display = 'none'
                }, 300)
            }
        }

        getUserList()

        getGroupsForUser()

    }, [addGrpBtnState, addUserBtnState, seeUserBtnState, user]) // eslint-disable-line
    
    return (
        <main className={styles["chat-box"]}>
            <div className={styles["chat-body"]}>
                <section className={`${styles["chat-groups"]} chatRooms`}>
                    <div className={styles.sideHead}>
                        <button className={`${styles.addGroupButton} addGroupButton`} data-toggle={addGrpBtnState} onClick={(event) => {
                            const target:HTMLButtonElement = event.currentTarget
                            const formCont:HTMLFormElement = document.querySelector('.formCont')!
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
                                setTimeout(() => {
                                    styling.warningGroup.current!.style.display = "none"
                                }, 200)
                                target.dataset.toggle = 'collapsed'
                                setAddGrpBtnState("collapsed")
                                Cookies.set("addGrpState", target.dataset.toggle)
                            }
                        }}>Add Group +</button>
                        <form className={`${styles.formCont} formCont`}
                            onSubmit={(event) => {
                                event.preventDefault()
                                if(groupName.length >= 4) {
                                    styling.warningGroup.current!.style.display = "none"
                                    const target:HTMLButtonElement = document.querySelector('.addGroupButton')!
                                    const users = document.querySelectorAll('.grp-users');
                                    users.forEach((el, i:number) => {
                                        let target = el as HTMLDivElement
                                        target.dataset.status = "not-added"
                                        target.style.outlineColor = "transparent"
                                        target.style.borderColor = "transparent"
                                    })
                                    const formCont:HTMLFormElement = event.currentTarget
                                    formCont.style.opacity = "0"
                                    setTimeout(() => {
                                        formCont.style.height = "0rem"
                                        formCont.style.display = 'none'
                                    }, 300)
                                    setTimeout(() => {
                                        styling.warningGroup.current!.style.display = "none"
                                    }, 200)
                                    target.dataset.toggle = 'collapsed'
                                    styling.warningGroup.current!.style.display = "none"
                                    setAddGrpBtnState("collapsed")
                                    Cookies.set("addGrpState", target.dataset.toggle)
                                    registerChatRoom()
                                }
                                else {
                                    styling.warningGroup.current!.style.display = "block"
                                }
                            }}
                        >
                            <span className={styles.warning} ref={styling.warningGroup}>Group name must be at least 4 characters long</span>
                            <input type="text" className={styles.grpName} placeholder="Enter Group Name..." value={groupName} minLength={4} onChange={(event) => setGroupName(event.target.value)} />
                            {usersList.map((el,i) => {
                                if(el.uid !== user?.uid) {
                                    return <div className={`${styles.users} grp-users`} key={i} data-status="not-added" data-details={JSON.stringify(el)} onClick={(event => {
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
                                    })}>
                                        <Image className={styles.profilePic} src={el.avatar ? el.avatar : '/user.png'} alt={'profilePic'} width={28} height={28}/>
                                        <div className={styles.details}>
                                            <span className={styles.name}>{`+ ${el.name}`}</span>
                                            <span className={styles.email}>{`${el.email}`}</span>
                                        </div>
                                    </div>
                                }
                            })}
                            <input type="submit" className={styles.createGrpBtn} value="Create Group"/>
                        </form>
                        {((Cookies.get('currentGroup') !== undefined) ? JSON.parse(Cookies.get('currentGroup')).admin.split(',').includes(user?.uid) : '') ?
                        <>
                            <button className={`${styles.addUserButton} addUserButton`} data-toggle={addUserBtnState} onClick={(event) => {
                                const target:HTMLButtonElement = event.currentTarget
                                const userList:HTMLFormElement = document.querySelector('.userList')!

                                const seeuserList:HTMLFormElement = document.querySelector('.addeduserList')!
                                if(seeuserList !== null && seeuserList !== undefined) {
                                    seeuserList.style.opacity = "0"
                                    setTimeout(() => {
                                        seeuserList.style.height = "0rem"
                                        seeuserList.style.display = 'none'
                                    }, 300)
                                    setTimeout(() => {
                                        styling.warningUser.current!.style.display = "none"
                                        const modal = document.querySelectorAll('.modal')
                                        const allinfos = document.querySelectorAll('.adduser-infoContainer')
                                        allinfos.forEach(info => {
                                            (info as HTMLDivElement).style.paddingBottom = '0rem'
                                        })
                                        modal.forEach((el,index) => {
                                            (el as HTMLFormElement).style.display = 'none'
                                        })
                                    }, 200);
                                    (document.querySelector('.seeUserButton') as HTMLButtonElement).dataset.toggle = 'collapsed'
                                    setseeUserBtnState("collapsed")
                                    setUpdateUsers([user?.uid])
                                    Cookies.set("seeUserState", "collapsed")
                                }

                                if(target.dataset.toggle === 'collapsed') {
                                    userList.style.display = 'flex'
                                    userList.style.height = "auto"
                                    setTimeout(() => {
                                        userList.style.opacity = "1"
                                    }, 100)
                                    target.dataset.toggle = 'expanded'
                                    setAddUserBtnState("expanded")
                                    Cookies.set("addUserState", target.dataset.toggle)
                                } else {
                                    userList.style.opacity = "0"
                                    setTimeout(() => {
                                        userList.style.height = "0rem"
                                        userList.style.display = 'none'
                                    }, 300)
                                    setTimeout(() => {
                                        styling.warningUser.current!.style.display = "none"
                                    }, 200)
                                    target.dataset.toggle = 'collapsed'
                                    setAddUserBtnState("collapsed")
                                    Cookies.set("addUserState", target.dataset.toggle)
                                }
                            }}>Add Users +</button>
                            <form className={`${styles.userList} userList`}
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    if(!JSON.parse(Cookies.get('currentGroup')).admin.split(',').includes(user?.uid)) {
                                        styling.warningUser.current!.style.display = "block"
                                        styling.warningUser.current!.innerHTML = "Only the admin can add Users"
                                    }
                                    else if(updateUsers.length < 2) {
                                        styling.warningUser.current!.style.display = "block"
                                    }
                                    else {
                                        styling.warningUser.current!.style.display = "none"
                                        const target:HTMLButtonElement = document.querySelector('.addUserButton')!
                                        const users = document.querySelectorAll('.users');
                                        users.forEach((el, i:number) => {
                                            let target = el as HTMLDivElement
                                            target.dataset.status = "not-added"
                                            target.style.outlineColor = "transparent"
                                            target.style.borderColor = "transparent"
                                        })
                                        const userList:HTMLFormElement = event.currentTarget
                                        userList.style.opacity = "0"
                                        setTimeout(() => {
                                            userList.style.height = "0rem"
                                            userList.style.display = 'none'
                                        }, 300)
                                        setTimeout(() => {
                                            styling.warningUser.current!.style.display = "none"
                                        }, 200)
                                        target.dataset.toggle = 'collapsed'
                                        styling.warningUser.current!.style.display = "none"
                                        setAddUserBtnState("collapsed")
                                        Cookies.set("addUserState", target.dataset.toggle)
                                        updateUserList()
                                    }
                                }}
                            >
                                <span className={styles.warning} ref={styling.warningUser}>Add at least one User</span>
                                {usersList.map((el,i) => {
                                    if(el.uid !== user?.uid && !admittedUsers.includes(el.uid)) {
                                        return <div className={`${styles.users} users`} 
                                                    key={i} 
                                                    data-status="not-added" 
                                                    data-details={JSON.stringify(el)} 
                                                    style={{outlineColor: `${(admittedUsers.includes(el.uid)) ? 'rgba(0,0,0,0.5)' : 'transparent'}}`, borderColor: `${(admittedUsers.includes(el.uid)) ? '#ffffff' : 'transparent'}}`}}
                                                    onClick={(event => {
                                                        const target:HTMLDivElement = event.currentTarget
                                                        if(target.dataset.status === 'not-added') {
                                                            target.dataset.status = 'added'
                                                            target.style.outlineColor = "rgba(0,0,0,0.5)"
                                                            target.style.borderColor = "#ffffff"
                                                            let newList = [
                                                                ...updateUsers,
                                                                JSON.parse(target.dataset.details as string).uid
                                                            ]
                                                            setUpdateUsers(newList)
                                                        } else if(target.dataset.status === 'added') {
                                                            target.dataset.status = "not-added"
                                                            target.style.outlineColor = "transparent"
                                                            target.style.borderColor = "transparent"
                                                            let newList = updateUsers
                                                            let index = 0
                                                            let id = JSON.parse(target.dataset.details as string).id
                                                            newList.forEach((el,i) => {
                                                                if(el.id === id) index = i
                                                            })
                                                            newList.splice(i,1)
                                                            setUpdateUsers(newList)
                                                        }
                                                    })}
                                                >
                                            <Image className={styles.profilePic} src={el.avatar ? el.avatar : '/user.png'} alt={'profilePic'} width={28} height={28}/>
                                            <div className={styles.details}>
                                                <span className={styles.name}>{`+ ${el.name}`}</span>
                                                <span className={styles.email}>{`${el.email}`}</span>
                                            </div>
                                        </div>
                                    }
                                })}
                                <input type="submit" className={styles.addUserBtn} value="Add Users"/>
                            </form>
                        </> : <></>
                        }
                    </div>
                    <button className={`${styles.seeUserButton} seeUserButton`} data-toggle={seeUserBtnState} onClick={(event) => {
                        const target:HTMLButtonElement = event.currentTarget
                        const userList:HTMLDivElement = document.querySelector('.addeduserList')!

                        const adduserList:HTMLFormElement = document.querySelector('.userList')!
                        if(adduserList !== null && adduserList !== undefined) {
                            adduserList.style.opacity = "0"
                            setTimeout(() => {
                                adduserList.style.height = "0rem"
                                adduserList.style.display = 'none'
                            }, 300)
                            setTimeout(() => {
                                styling.warningUser.current!.style.display = "none"
                            }, 200);
                            (document.querySelector('.addUserButton') as HTMLButtonElement).dataset.toggle = 'collapsed'
                            setAddUserBtnState("collapsed")
                            setUpdateUsers([user?.uid])
                            Cookies.set("addUserState", "collapsed")
                        }
                        
                        if(target.dataset.toggle === 'collapsed') {
                            userList.style.display = 'flex'
                            userList.style.height = "auto"
                            setTimeout(() => {
                                userList.style.opacity = "1"
                            }, 100)
                            target.dataset.toggle = 'expanded'
                            setseeUserBtnState("expanded")
                            Cookies.set("seeUserState", target.dataset.toggle)
                        } else if(target.dataset.toggle === 'expanded') {
                            userList.style.opacity = "0"
                            setTimeout(() => {
                                userList.style.height = "0rem"
                                userList.style.display = 'none'
                            }, 300)
                            setTimeout(() => {
                                styling.warningUser.current!.style.display = "none"
                                const modal = document.querySelectorAll('.modal')
                                const allinfos = document.querySelectorAll('.adduser-infoContainer')
                                allinfos.forEach(info => {
                                    (info as HTMLDivElement).style.paddingBottom = '0rem'
                                })
                                modal.forEach((el,index) => {
                                    (el as HTMLFormElement).style.display = 'none'
                                })
                            }, 200)
                            target.dataset.toggle = 'collapsed'
                            setseeUserBtnState("collapsed")
                            Cookies.set("seeUserState", target.dataset.toggle)
                        }
                    }}>{`Users >`}</button>
                    <div className={`${styles.addeduserList} addeduserList`}>
                        {usersList.map((el,i) => {
                            if(admittedUsers.includes(el.uid)) {
                                return <div 
                                            className={`${styles.users} admittedUsers`} 
                                            key={i} 
                                            data-status="not-selected" 
                                            data-details={JSON.stringify(el)}
                                        >
                                    <div className={`${styles.infoContainer} adduser-infoContainer`}
                                        onClick={(event => {
                                            if(!admins.includes(user?.uid)) return
                                            if(el.uid === user?.uid) return
                                            const target:HTMLDivElement = event.currentTarget
                                            const allusers = document.querySelectorAll('.admittedUsers')
                                            const modal = document.querySelectorAll('.modal')
                                            let currentIndex = [...(target.parentElement!).parentElement!.children].indexOf(target.parentElement!)
                                            let currUser = allusers[currentIndex] as HTMLDivElement
                                            modal.forEach((el,index) => {
                                                (el as HTMLFormElement).style.display = 'none'
                                            })
                                            allusers.forEach((user,index) => {
                                                if(index !== currentIndex) (user as HTMLDivElement).dataset.status = 'not-selected';
                                                if(index !== currentIndex) (allusers[index].children[0] as HTMLDivElement).style.paddingBottom = '0rem'
                                            })
                                            if(currUser.dataset.status === 'not-selected') {
                                                target.style.paddingBottom = '1rem'
                                                currUser.dataset.status = 'selected';
                                                (modal[currentIndex] as HTMLFormElement).style.display = 'flex'
                                                Cookies.set('selectedUser', currUser.dataset.details)
                                            } else if(currUser.dataset.status === 'selected') {
                                                target.style.paddingBottom = '0rem'
                                                currUser.dataset.status = "not-selected";
                                                (modal[currentIndex] as HTMLFormElement).style.display = 'none'
                                                Cookies.remove('selectedUser')
                                            }
                                        })}
                                    >
                                        {(admins.includes(el.uid)) ? <Image className={styles.adminSymbol} src='/crown.png' alt={'admin'} width={10} height={10} /> : <></>}
                                        <Image className={styles.profilePic} src={el.avatar ? el.avatar : '/user.png'} alt={'profilePic'} width={28} height={28}/>
                                        <div className={styles.details}>
                                            <span className={styles.name}>{`${el.name}`}</span>
                                            <span className={styles.email}>{`${el.email}`}</span>
                                        </div>
                                    </div>
                                    <form className={`${styles.modal} modal`}
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            const remove = document.querySelector('#remove') as HTMLInputElement
                                            const admin = document.querySelector('#admin') as HTMLInputElement
                                            if(admin.checked) {
                                                let newList = [
                                                    ...admins,
                                                    JSON.parse(Cookies.get('selectedUser')).uid
                                                ]
                                                updateAdminList(newList)
                                            }
                                            if(remove.checked) {
                                                removeUser()
                                            }
                                        }}
                                    >
                                        <span>
                                            <label htmlFor="admin" className={styles.adminLabel}>Assign User as Admin</label>
                                            <input type="checkbox" id='admin' name='admin' className={`${styles.admin} admin checkbox`} onClick={(event) => {
                                                const boxes = document.querySelectorAll('.checkbox')
                                                boxes.forEach((el,index) => {
                                                    if(index !== [...boxes].indexOf(event.currentTarget)) (el as HTMLInputElement).checked = false;
                                                });
                                                (document.querySelector('#admin') as HTMLInputElement).checked = true
                                            }} />
                                        </span>
                                        <span>
                                            <label htmlFor="remove" className={styles.removeLabel}>Remove User</label>
                                            <input type="checkbox" id='remove' name='remove' className={`${styles.remove} remove checkbox`} onClick={(event) => {
                                                const boxes = document.querySelectorAll('.checkbox')
                                                boxes.forEach((el,index) => {
                                                    if(index !== [...boxes].indexOf(event.currentTarget)) (el as HTMLInputElement).checked = false;
                                                });
                                                (document.querySelector('#remove') as HTMLInputElement).checked = true
                                            }} />
                                        </span>
                                        <input type="submit" value={'Done' } className={styles.doneBtn} />
                                    </form>
                                </div>
                            }
                        })}
                    </div>
                    <div className={styles.groups}>
                        {groups.map((el,i) => {
                            return <button className={styles.group} style={{backgroundColor: (JSON.parse(Cookies.get('currentGroup')).id == el.id) ? '#f2c335' : '#6f3df4'}} key={i} data-details={JSON.stringify(el)} onClick={(event) => {
                                Cookies.set("currentGroup", (event.target as HTMLButtonElement).dataset.details)
                                router.refresh()
                                window.location.reload()
                            }} >{`${el.name} >`}</button>
                        })}
                    </div>
                </section>
                <section className={`${styles["messages-wrapper"]} messages`} id={"messages-wrapper"}>
                    {messages.map((message:any, index:number) => {
                        let dateTime = (message.createdAt !== null) ? message.createdAt.toDate() : new Date()
                        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        let day = dateTime.getDate()
                        let month = dateTime.getMonth()
                        let year = dateTime.getFullYear()
                        switch(day[1]) {
                            case '1' : {
                                day += 'st'
                                break
                            }
                            case '2' : {
                                day += 'nd'
                                break
                            }
                            case '3' : {
                                day += 'rd'
                                break
                            }
                            default : {
                                day += 'th'
                                break
                            }
                        }
                        let currentDate = `${day} ${months[month]} ${year}`
                        let date = Cookies.get('currentDate')
                        if(date !== currentDate) {
                            Cookies.set('currentDate', currentDate)
                            return (
                                <div key={message.id}>
                                    <div className={styles.dateContainer}>
                                        <span>{currentDate}</span>
                                    </div>
                                    <Message key={message.id} message={message} index={index} />
                                </div>
                            )
                        }
                        else {
                            return <Message key={message.id} message={message} index={index} />
                        }
                    })}
                    <div className={`${styles.scrollSpan} scrollSpan`} ref={scroll} />
                </section>
            </div>
            <SendMessage scroll={scroll} />
        </main>
    );
};

export default ChatBox;
