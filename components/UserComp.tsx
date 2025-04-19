"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function UserComp() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 mt-20">
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
        </>
      ) : (
        <h1>Unknown user</h1>
      )}
    </div>
  );
}
