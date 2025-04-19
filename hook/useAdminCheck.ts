'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // adjust this import if needed

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user?.uid) return;
      const token = await user.getIdToken();
      const res = await fetch('/api/auth/checkAdmin', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.status === 200 && data.message === 'Admin access granted') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkIfAdmin();
  }, [user]);

  return isAdmin;
}
