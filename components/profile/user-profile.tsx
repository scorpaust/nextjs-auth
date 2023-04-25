import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import { useSession, getSession } from "next-auth/react";
import { useState } from 'react';

function UserProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const [loadedSession, setLoadedSession] = useState(undefined);

  /* useAsyncEffect(async () => {
   await getSession().then((session) => {
      if (!session) {
        window.location.href = "/auth"
      } else {
        setIsLoading(false);
      }
    })
  }, [])

  if (isLoading) {
    return <p className={classes.profile}>Loading...</p>
  } */

  async function changePasswordHandler(passwordData: any) {
    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    console.log(data);
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler}/>
    </section>
  );
}

export default UserProfile;