import React, { useState, useEffect, useContext, createContext } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth"
import { authentication } from '../firebase/clientApp.ts'
import { getDatabase, ref, get, set } from "firebase/database";

const authContext = createContext()

export function AuthProvider({ children }) {
  const auth = useProvideAuth()

  // Expose the signout function for Cypress
  if (typeof window !== 'undefined' && window.Cypress) {
    window.signOut = auth.signout;
  }

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

    if (rawUser) {
      const database = getDatabase();
      const uid = authentication.currentUser.uid;
      const usersRef = ref(database, 'users/' + uid);
  
      get(usersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.val();
            user.points.total = user.points.community + user.points.sports + user.points.culture + user.points.dance + user.points.wildcard;
            setUser(user);
          } else {
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
    setLoading(true);
    return new Promise((resolve, reject) => {
      authentication.signOut()
        .then(() => {
          handleUser(false);
          resolve(true);
        })
        .catch((error) => {
          resolve(false);
        });
        setLoading(false);
    });
  }

  // Generate reCAPTCHA for phone number verification
  const generateRecaptcha = () => {    
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
  
      let newPhoneNumber = "+1" + phoneNumber;
  
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authentication, newPhoneNumber, appVerifier)
        .then(confirmationResult => {
          window.confirmationResult = confirmationResult;
          resolve(true);
        }).catch((error) => {
          reject(error);
        });
    });
  }

  // Verify OTP
  // TODO: Fix this, only checks if OTP is 6 digits long
  const verifyOTP = (otp, confirmationResult) => {
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
        reject("OTP must be 6 digits long");
      }
    });
  };
  

  // Checks if the user exists in the real time database via their UID
  function userExists () {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      const uid = authentication.currentUser.uid;
      const usersRef = ref(database, 'users/' + uid);
  
      get(usersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve(true);
          } else {
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
    handleUser(true);
  }

  useEffect(() => {
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