'use client';
import { useEffect, useState } from 'react';

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIfAdmin = async () => {
      const res = await fetch('/api/auth/checkAdmin', {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await res.json();
      if (res.status === 200 && data.message === 'Admin access granted') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkIfAdmin();
  }, []);

  return isAdmin;
}
