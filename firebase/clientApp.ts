// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// Function for logging in a user via Google Provider...
const signInWithGoogle = async () => {
  try {
    // Creating a new user...
    const res = await signInWithPopup(auth, googleProvider);

    // Initializing the user and common room...
    const user = res.user;
    const commonRoom = doc(
      db,
      "chatRooms",
      process.env.NEXT_PUBLIC_COMMON_ROOM_ID!
    );

    // Getting the user data from the database...
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    // Getting the common room data from the database...
    const q1 = query(
      collection(db, "chatRooms"),
      where("name", "==", "Common")
    );
    const querySnapshot = await getDocs(q1);

    // Getting the registered users from the common room...
    let registeredUsers = "";
    let flag = true;
    querySnapshot.forEach((doc) => {
      registeredUsers = doc.data().users;
    });
    registeredUsers.split(",").map((el) => {
      if (el === user.uid) flag = false;
    });

    // Adding the user to the database if user not registered...
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        avatar: user.photoURL,
      });

      // Updating the common room...
      if (flag) {
        await updateDoc(commonRoom, {
          users: `${registeredUsers},${user.uid}`,
        });
      }
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

// Function for logging in a user via email and password...
const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

// Function for Registering a new user via email and password...
const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    // Creating a new user...
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // Initializing the user and common room...
    const user = res.user;
    const commonRoom = doc(
      db,
      "chatRooms",
      process.env.NEXT_PUBLIC_COMMON_ROOM_ID!
    );

    // Checking if the user is already registered in common room...
    const q = query(collection(db, "chatRooms"), where("name", "==", "Common"));
    const querySnapshot = await getDocs(q);
    let registeredUsers = "";
    let flag = true;
    querySnapshot.forEach((doc) => {
      registeredUsers = doc.data().users;
    });
    registeredUsers.split(",").map((el) => {
      if (el === user.uid) flag = false;
    });

    // Adding the user to the common room...
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      avatar:
        "https://res.cloudinary.com/dotwawzhk/image/upload/v1688918295/user_sa91hj.png",
    });

    // Updating the common room...
    if (flag) {
      await updateDoc(commonRoom, {
        users: `${registeredUsers},${user.uid}`,
      });
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

// Function for sending password reset email...
const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

// Function for logging out a user...
const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
