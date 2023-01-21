import React, { useState, createContext } from "react"

type contextType = {
    username: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    secret: string,
    setSecret: React.Dispatch<React.SetStateAction<string>>
}

export const Context = createContext<contextType>({username: "", setUsername: () => {},secret: "", setSecret: () => {}})

export const ContextProvider = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }) => {
  const [username, setUsername] = useState("")
  const [secret, setSecret] = useState("")

  const value = {
    username,
    setUsername,
    secret,
    setSecret,
  }

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}
