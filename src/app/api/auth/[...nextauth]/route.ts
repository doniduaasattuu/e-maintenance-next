import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
// import type { NextAuthOptions } from "next-auth";
// import type { JWT } from "next-auth/jwt";
// import type { Session } from "next-auth";

// const prisma = new PrismaClient();

// type SessionProps = { session: Session; token: JWT };

// const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password are required");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//           include: {
//             role: {
//               select: {
//                 id: true,
//                 name: true,
//               },
//             },
//           },
//         });

//         if (!user) {
//           throw new Error("Invalid credentials");
//         }

//         const isPasswordValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isPasswordValid) {
//           throw new Error("Invalid credentials");
//         }

//         return {
//           id: user.id.toString(),
//           name: user.name,
//           email: user.email,
//           role: user.role?.name,
//           image: user.image,
//         };
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user, trigger, session }) {
//       if (user) {
//         token.id = user.id as string;
//         token.email = user.email;
//         token.name = user.name;
//         token.role = user.role;
//         token.image = user.image;
//       }

//       if (trigger === "update" && session) {
//         token.id = session.user.id as string;
//         token.email = session.user.email;
//         token.name = session.user.name;
//         token.role = session.user.role;
//         token.image = session.user.image;
//       }
//       return token;
//     },
//     async session({ session, token }: SessionProps) {
//       if (session.user) {
//         session.user.id = (token.sub as string) ?? (token.id as string);
//         session.user.email = token.email;
//         session.user.name = token.name;
//         session.user.role = token.role;
//         session.user.image = token.image;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
// };

// const handler = NextAuth(authOptions);

// // ✅ Only export HTTP methods
// export { handler as GET, handler as POST };
