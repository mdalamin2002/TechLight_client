import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase/firebase.init";

export const AuthContext = createContext();

export const FirebaseContext = ({ children }) => {
  //Login User state
  const [user, setUser] = useState(null);
  

  //Loading state
  const [loading, setLoading] = useState(true);

    
  //Register user with email and password
  const registerWithEmailPass = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  //Login with email and password
  const loginWithEmailPass = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  //Login with google
  const provider = new GoogleAuthProvider();
  const googleLogin = () => {
    return signInWithPopup(auth, provider);
  };

  //Login with Github
  const githubProvider = new GithubAuthProvider();
  const githubLogin = () => {
    return signInWithPopup(auth, githubProvider);
  };

  //Update user
  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  //Reset password 
  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  }

  //Log out user
  const logOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  //On Auth state change
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (loggedUser) => {
      setUser(loggedUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const userInfo = {
    registerWithEmailPass,
    loginWithEmailPass,
    user,
    setUser,
    setLoading,
    loading,
    updateUser,
    logOutUser,
    googleLogin,
    forgotPassword,
    githubLogin
  };

  return <AuthContext value={userInfo}>{children}</AuthContext>;
};