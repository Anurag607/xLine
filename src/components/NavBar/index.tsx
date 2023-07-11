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
  // Getting current user session...
  const [user] = useAuthState(auth);

  // Getting user profile pic from firestore
  const [userImage, SetuserImage] = React.useState<string>(
    `${user?.photoURL ?? Cookie.get("userImage")}`
  );

  // Getting router object
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
    if (user === null || user === undefined) router.push("/");
  }, []);

  /* eslint-enable */

  return (
    <nav className={`${styles["nav"]} nav`}>
      <Burger />
      <div className={styles["nav-right"]}>
        <div className={styles["navicons"]}>
          {/* Checking to see if user is logged in */}
          {user ? (
            <span
              className={styles.navDash}
              onClick={() => {
                Cookie.set("loggedIn", false);
                router.push("/");
                window.location.reload();
                logout();
              }}
            >
              <div>
                <Image
                  src={`${userImage ?? "/user.png"}`}
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
