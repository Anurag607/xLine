import React from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";
import Cookie from "js-cookie";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, logout } from "../../../firebase/clientApp";
import Burger from "../BurgerMenu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

const NavBar = () => {
  const [user] = useAuthState(auth);
  const [userImage, SetuserImage] = React.useState<string>(
    `${Cookie.get("userImage") || user?.photoURL}`
  );
  const router = useRouter();

  // Function for getting user profile pic
  const getProfilePic = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    let userData: any = {};
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });
    Cookie.set("userImage", userData.avatar);
    SetuserImage(userData.avatar);
  };

  /* eslint-disable */
  React.useEffect(() => {
    getProfilePic();
    if (user === null || user === undefined) router.push("/login");
  }, []);

  /* eslint-enable */

  return (
    <nav className={`${styles["nav"]} nav`}>
      <Burger />
      <div className={styles["nav-right"]}>
        <div className={styles["navicons"]}>
          {user ? (
            <span
              className={styles.navDash}
              onClick={() => {
                Cookie.set("loggedIn", false);
                router.push("/login");
                router.refresh();
                logout();
              }}
            >
              <div>
                <Image
                  src={`${userImage || "/user.png"}`}
                  width={26.5}
                  height={26.5}
                  alt="profilePic"
                />
              </div>
              <div>
                {user.displayName === null
                  ? user.email?.split("@")[0]
                  : user.displayName}
              </div>
            </span>
          ) : (
            <Link href="/" as="/">
              <div className={styles.login}>
                <span>Login</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
