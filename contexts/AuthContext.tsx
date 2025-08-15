// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import api from "@/lib/utils/axios-config";
// import {
//   setStoredTokens,
//   getStoredTokens,
//   clearStoredTokens,
// } from "@/lib/utils/auth-storage";

// export const AuthContext = createContext<any>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const tokens = getStoredTokens();
//       if (!tokens) {
//         setLoading(false);
//         return;
//       }

//       const response = await api.get("/auth/me");
//       setUser(response.data);
//     } catch (error) {
//       clearStoredTokens();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (credentials: { email: string; password: string }) => {
//     const response = await api.post("/auth/login", credentials);
//     setStoredTokens(response.data.tokens);
//     setUser(response.data.user);
//   };

//   const logout = () => {
//     clearStoredTokens();
//     setUser(null);
//   };

//   // ...rest of context code...
// }
