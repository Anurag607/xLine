"use client"

import React, { useState, useEffect, useContext } from "react"
// import { Context } from "../../context"
// import dynamic from "next/dynamic"
// import { useRouter } from "next/navigation"
// import Cookies from 'js-cookie'

// const ChatEngine = dynamic<{height: string, projectID: string, userName: string, userSecret: string, renderNewMessageForm: () => void }>(() =>
//   import("react-chat-engine").then((module) => module.ChatEngine)
// )
// const MessageFormSocial = dynamic(() =>
//   import("react-chat-engine").then((module) => module.MessageFormSocial)
// )


// const Home = () => {
//   // let { username, secret } = useContext(Context)
//   const [username, setUsername] = useState(Cookies.get('username') || "")
//   const [secret, setSecret] = useState(Cookies.get('password') || "")
//   const [showChat, setShowChat] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     if (typeof document !== undefined) setShowChat(true)
//   }, [])

//   useEffect(() => {
//     if (username === "" || secret === "") {
//       router.push("/")
//     }
//   }, [username, secret, router])

//   if (!showChat) return <div />

//   return (
//     <div className="background">
//       <div className="shadow">
//         <ChatEngine
//           height="100vh"
//           projectID={`13eecb85-e8da-4d6a-b356-0ac6f4c20caa`}
//           userName={username}
//           userSecret={secret}
//           renderNewMessageForm={() => <MessageFormSocial />}
//         />
//       </div>
//     </div>
//   )
// }

// export default Home