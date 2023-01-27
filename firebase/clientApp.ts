// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
  getDoc
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    const commonRoom = doc(db, "chatRooms", process.env.NEXT_PUBLIC_COMMON_ROOM_ID!);
    const q1 = query(collection(db, "chatRooms"), where("name", "==", "Common"))
    const querySnapshot = await getDocs(q1);
    let registeredUsers = ''
    let flag = true
    querySnapshot.forEach((doc) => {
      console.log(doc.data().users)
      registeredUsers = doc.data().users
    })
    registeredUsers.split(',').map(el => {
      if(el === user.uid) flag = false
    })
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
      if(flag) {
        await updateDoc(commonRoom, {
          users: `${registeredUsers},${user.uid}`
        });
      }
    }
  } catch (err:any) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email:string, password:string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err:any) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name:string, email:string, password:string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const commonRoom = doc(db, "chatRooms", process.env.NEXT_PUBLIC_COMMON_ROOM_ID!);
    const q = query(collection(db, "chatRooms"), where("name", "==", "Common"))
    const querySnapshot = await getDocs(q);
    let registeredUsers = ''
    let flag = true
    querySnapshot.forEach((doc) => {
      console.log(doc.data().users)
      registeredUsers = doc.data().users
    })
    registeredUsers.split(',').map(el => {
      if(el === user.uid) flag = false
    })
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    if(flag) {
      await updateDoc(commonRoom, {
        users: `${registeredUsers},${user.uid}`
      });
    }
  } catch (err:any) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email:string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err:any) {
    console.error(err);
    alert(err.message);
  }
};

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
  logout
};