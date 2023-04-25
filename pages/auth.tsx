import * as mongoDB from "mongodb";
import AuthForm from '../components/auth/auth-form';
import useAsyncEffect from "use-async-effect";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export const collections: { users?: mongoDB.Collection } = {}

function AuthPage() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useAsyncEffect(async () => {
    getSession().then((session) => {
      if (session) {
        router.replace("/");
      } else {
        setIsLoading(false);
      }
    })
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>
  }

  return <AuthForm />;
}

export default AuthPage;