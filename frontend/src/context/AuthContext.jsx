import { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign Up
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Log In
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Log Out
  function logout() {
    return signOut(auth);
  }

  // Helper to fetch fresh JWT token for FastAPI headers
  async function getToken() {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  }

  useEffect(() => {
    // listen for auth state chages (login, logout, token refresh)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signUp,
    login,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
