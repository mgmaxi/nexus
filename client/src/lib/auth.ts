import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // 1. Conectamos con TU Backend de Node
        const res = await fetch("http://localhost:4000/api/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        const user = await res.json();

        // 2. Si el backend responde OK y devuelve un usuario, autorizamos
        if (res.ok && user) {
          return user;
        }
        
        // Si falló, retornamos null (login fallido)
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Página personalizada que haremos luego
  },
});