import React, { useState, useEffect, useContext, createContext } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth"
import { authentication } from '../firebase/clientApp.ts'
import { getDatabase, ref, get, set } from "firebase/database";

const authContext = createContext()

export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleUser = (rawUser) => {

    setLoading(true);
    console.log("Handling user");

    if (rawUser) {
      const database = getDatabase();
      const uid = authentication.currentUser.uid;
      const usersRef = ref(database, 'users/' + uid);
  
      get(usersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.val();
            console.log(user);
            setUser(user);
          } else {
            console.log("User doesn't exist!");
            setUser(null);
          }
        })
        .catch((error) => {
          // TODO: Handle error
          console.log(error);
          reject(error);
        });
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  const signout = () => {
    return new Promise((resolve, reject) => {
      authentication.signOut()
        .then(() => {
          handleUser(false);
          resolve(true);
        })
        .catch((error) => {
          resolve(false);
        });
    });
  }

  // Generate reCAPTCHA for phone number verification
  const generateRecaptcha = () => {    
    console.log("Generating reCAPTCHA");
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (recaptchaContainer && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(recaptchaContainer, {
          'size': 'invisible',
          'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            onSignInSubmit();
          }
        }, authentication);
      }
    }
  }

  // Request OTP using phone number
  const requestOTP = (phoneNumber) => {
    return new Promise((resolve, reject) => {
      console.log("Requesting OTP for +1" + phoneNumber + "...");
  
      let newPhoneNumber = "+1" + phoneNumber;
  
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authentication, newPhoneNumber, appVerifier)
        .then(confirmationResult => {
          window.confirmationResult = confirmationResult;
          console.log("OTP sent");
          resolve(true);
        }).catch((error) => {
          console.log("OTP not sent");
          console.log(error);
          resolve(false);
        });
    });
  }

  // Verify OTP
  // TODO: Fix this, only checks if OTP is 6 digits long
  const verifyOTP = (otp, confirmationResult) => {
    console.log("Verifying OTP");
    return new Promise((resolve, reject) => {
      if (otp.length === 6) {
        confirmationResult.confirm(otp)
          .then((result) => {
            const user = result.user;
            resolve(!!user);
          })
          .catch((error) => {
            // TODO: Handle error
            console.log(error);
            reject(error);
          });
      } else {
        resolve(false);
      }
    });
  };
  

  // Checks if the user exists in the real time database via their UID
  function userExists () {
    console.log("Checking if user exists");
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      const uid = authentication.currentUser.uid;
      const usersRef = ref(database, 'users/' + uid);
  
      get(usersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log("User exists!");
            resolve(true);
          } else {
            console.log("User doesn't exist!");
            resolve(false);
          }
        })
        .catch((error) => {
          // TODO: Handle error
          console.log(error);
          reject(error);
        });
    });
  }

  function updateUser () {
    setLoading(true);
    return new Promise((resolve, reject) => {
      console.log("Updating user data")
      setUser(null);
      const database = getDatabase();
      const uid = authentication.currentUser.uid;
      const usersRef = ref(database, 'users/' + uid);
  
      get(usersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.val()
            setUser(user);
            setLoading(false);
            console.log("User data updated");
            resolve(true);
          } else {
            console.log("User doesn't exist!");
            setLoading(false);
            resolve(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          resolve(false);
        });
    });
  }

  useEffect(() => {
    console.log("useEffect in useAuth.js called");
    const unsubscribe = authentication.onAuthStateChanged(handleUser)
    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    requestOTP,
    verifyOTP,
    userExists,
    updateUser,
    generateRecaptcha,
    signout
  }
}