import { verifyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";



export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            async authorize(credentials: any): Promise<any> {

                const { email, password} = credentials;

                const client = await connectToDatabase();

                const usersCollection = client.db().collection("users");

                const user = await usersCollection.findOne({ email });

                if (!user) {
                    throw new Error("No users found with that e-mail address.");
                }

                const isValid = await verifyPassword(password, user?.password);

                if (!isValid) {
                    client.close();
                    throw new Error("Could not log you in.");
                }
                else {

                    client.close();
    
                    return { email: user.email }
                }

                return null;

            },
            credentials: { email: "", password: ""} as any
        })
    ],
    secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg",
    callbacks: {
        async jwt({ token, user }) {
          return { ...token, ...user };
        },
        async session({ session, token }) {
          session.user = token;
          return session;
        },
      }
}

export default NextAuth(authOptions);